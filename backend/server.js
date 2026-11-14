import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import socketAuthMiddleware from "./src/middleware/socket.middleware.js";
import userModel from "./src/models/user.model.js";
import followModel from "./src/models/follow.model.js";
import conversationModel from "./src/models/conversation.model.js";
import messageModel from "./src/models/message.model.js";


import { createMessageIdempotently, MessageServiceError } from "./src/services/message.service.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

// User ID -> Set of socket IDs
const onlineUsers = new Map();

// Get all mutual followers of a user
async function getMutualFollowers(userId) {
    const follows = await followModel.find({
        $or: [
            { follower: userId },
            { following: userId }
        ]
    }).select("follower following").lean();

    const following = new Set();
    const followers = new Set();

    follows.forEach((item) => {
        if (item.follower.toString() === userId.toString()) {
            following.add(item.following.toString());
        }

        if (item.following.toString() === userId.toString()) {
            followers.add(item.follower.toString());
        }
    });

    return [...following].filter(id => followers.has(id));
}

async function syncPendingDeliveries(userId) {
    try {
        const now = new Date();

        // Find messages received while this user was offline
        const pendingMessages = await messageModel.find({
            receiver: userId,
            deliveredAt: null,
            expiresAt: { $gt: now }
        })
            .select("_id sender conversationId")
            .lean();

        if (pendingMessages.length === 0) return;

        const messageIds = pendingMessages.map(message => message._id);

        const deliveredAt = new Date();

        // Atomically mark only messages that are still undelivered
        const result = await messageModel.updateMany(
            {
                _id: { $in: messageIds },
                receiver: userId,
                deliveredAt: null,
                expiresAt: { $gt: now }
            },
            {
                $set: { deliveredAt }
            }
        );

        if (result.modifiedCount === 0) return;

        // Fetch only messages updated by this operation
        const updatedMessages = await messageModel.find({
            _id: { $in: messageIds },
            receiver: userId,
            deliveredAt,
        })
            .select("_id sender conversationId")
            .lean();

        // Group receipts by original sender and conversation
        const groupedReceipts = new Map();

        updatedMessages.forEach(message => {
            const senderId = message.sender.toString();
            const conversationId = message.conversationId.toString();

            const key = `${senderId}:${conversationId}`;

            if (!groupedReceipts.has(key)) {
                groupedReceipts.set(key, {
                    senderId,
                    conversationId,
                    messageIds: []
                });
            }

            groupedReceipts.get(key).messageIds.push(
                message._id.toString()
            );
        });

        // Notify original senders
        groupedReceipts.forEach(receipt => {
            io.to(`user:${receipt.senderId}`).emit("message:delivered", {
                conversationId: receipt.conversationId,
                messageIds: receipt.messageIds,
                deliveredAt
            });
        });

        console.log(
            `Pending messages delivered for user ${userId}:`,
            result.modifiedCount
        );

    } catch (error) {
        console.error("Pending delivery sync error:", error);
    }
}

// Authenticate socket connections
io.use(socketAuthMiddleware);

io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();

    try {
        // Join user's private room
        socket.join(`user:${userId}`);
        // Sync messages received while user was offline
        await syncPendingDeliveries(userId);
        // Track active sockets
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }

        const sockets = onlineUsers.get(userId);
        const wasOffline = sockets.size === 0;

        sockets.add(socket.id);

        // Only update and broadcast on first connection
        if (wasOffline) {
            await userModel.findByIdAndUpdate(userId, {
                isOnline: true
            });

            const mutualFollowers = await getMutualFollowers(userId);

            mutualFollowers.forEach((followerId) => {
                io.to(`user:${followerId}`).emit("user:online", {
                    userId
                });
            });
        }

        console.log(`Socket connected: ${userId}`);

        // Send message through Socket.IO
        socket.on("message:send", async (payload = {}, acknowledge) => {
            try {
                const {
                    conversationId,
                    text,
                    clientMessageId
                } = payload;

                const result = await createMessageIdempotently({
                    senderId: userId,
                    conversationId,
                    text,
                    clientMessageId,
                    io
                });

                // Acknowledge successful persistence
                if (typeof acknowledge === "function") {
                    acknowledge({
                        ok: true,
                        message: result.message,
                        duplicate: result.duplicate
                    });
                }

            } catch (error) {
                console.error("Socket message send error:", error);

                if (typeof acknowledge === "function") {
                    acknowledge({
                        ok: false,
                        error: error.message || "Failed to send message",
                        status: error instanceof MessageServiceError
                            ? error.status
                            : 500
                    });
                }
            }
        });

        // Typing indicator: Start
        socket.on("typing:start", async ({ conversationId } = {}) => {
            try {
                if (!conversationId) return;

                const conversation = await conversationModel.findOne({
                    _id: conversationId,
                    participants: userId
                }).select("participants").lean();

                if (!conversation) return;

                const receiverId = conversation.participants
                    .map(id => id.toString())
                    .find(id => id !== userId);

                if (!receiverId) return;

                // Ensure both users still mutually follow each other
                const mutualFollow = await Promise.all([
                    followModel.exists({
                        follower: userId,
                        following: receiverId
                    }),
                    followModel.exists({
                        follower: receiverId,
                        following: userId
                    })
                ]);

                if (!mutualFollow.every(Boolean)) return;

                io.to(`user:${receiverId}`).emit("typing:start", {
                    conversationId: conversationId.toString(),
                    userId
                });

            } catch (error) {
                console.error("Typing start error:", error);
            }
        });

        // Typing indicator: Stop
        socket.on("typing:stop", async ({ conversationId } = {}) => {
            try {
                if (!conversationId) return;

                const conversation = await conversationModel.findOne({
                    _id: conversationId,
                    participants: userId
                }).select("participants").lean();

                if (!conversation) return;

                const receiverId = conversation.participants
                    .map(id => id.toString())
                    .find(id => id !== userId);

                if (!receiverId) return;
                // Verify mutual follow relationship
                const mutualFollow = await Promise.all([
                    followModel.exists({
                        follower: userId,
                        following: receiverId
                    }),
                    followModel.exists({
                        follower: receiverId,
                        following: userId
                    })
                ]);

                if (!mutualFollow.every(Boolean)) return;
                io.to(`user:${receiverId}`).emit("typing:stop", {
                    conversationId: conversationId.toString(),
                    userId
                });

            } catch (error) {
                console.error("Typing stop error:", error);
            }
        });
        socket.on("disconnect", async () => {
            try {
                const userSockets = onlineUsers.get(userId);

                if (!userSockets) return;

                userSockets.delete(socket.id);

                // Remain online if another device is connected
                if (userSockets.size > 0) return;

                onlineUsers.delete(userId);

                const lastSeen = new Date();

                await userModel.findByIdAndUpdate(userId, {
                    isOnline: false,
                    lastSeen
                });

                const mutualFollowers = await getMutualFollowers(userId);

                mutualFollowers.forEach((followerId) => {
                    io.to(`user:${followerId}`).emit("user:offline", {
                        userId,
                        lastSeen
                    });
                });

                console.log(`Socket disconnected: ${userId}`);

            } catch (error) {
                console.error("Presence disconnect error:", error);
            }
        });

    } catch (error) {
        console.error("Presence connection error:", error);
        socket.disconnect(true);
    }
});

// Start server
async function startServer() {
    try {
        await connectDB();

        // Reset stale presence after server restart
        await userModel.updateMany(
            { isOnline: true },
            { $set: { isOnline: false } }
        );

        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("Socket.IO server initialized");
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();
