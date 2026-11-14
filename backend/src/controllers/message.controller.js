
import mongoose from "mongoose";

import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import followModel from "../models/follow.model.js";
import { createMessageIdempotently, MessageServiceError } from "../services/message.service.js";

// Send text message

export async function sendMessage(req, res) {
    try {
        const senderId = req.user._id;
        const { conversationId } = req.params;
        const { text, clientMessageId } = req.body;

        const io = req.app.get("io");

        const result = await createMessageIdempotently({
            senderId,
            conversationId,
            text,
            clientMessageId,
            io
        });

        return res.status(result.duplicate ? 200 : 201).json({
            message: result.duplicate
                ? "Message already sent"
                : "Message sent successfully",
            data: result.message,
            duplicate: result.duplicate
        });

    } catch (error) {
        if (error instanceof MessageServiceError) {
            return res.status(error.status).json({
                message: error.message
            });
        }

        console.error("Send message error:", error);

        return res.status(500).json({
            message: "Failed to send message"
        });
    }
}

export async function getMessages(req, res) {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversation ID"
            });
        }

        // Pagination limit
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 30, 1),
            50
        );

        const cursor = req.query.cursor;

        // Verify conversation membership
        const conversation = await conversationModel.findOne({
            _id: conversationId,
            participants: userId,
            isActive: true
        }).select("_id");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        const now = new Date();

        const query = {
            conversationId,
            expiresAt: { $gt: now }
        };

        // Fetch older messages using cursor
        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    message: "Invalid message cursor"
                });
            }

            const cursorMessage = await messageModel.findOne({
                _id: cursor,
                conversationId,
                expiresAt: { $gt: now }
            }).select("_id createdAt");

            if (!cursorMessage) {
                return res.status(400).json({
                    message: "Invalid or expired message cursor"
                });
            }

            query.$or = [
                {
                    createdAt: { $lt: cursorMessage.createdAt }
                },
                {
                    createdAt: cursorMessage.createdAt,
                    _id: { $lt: cursorMessage._id }
                }
            ];
        }

        const messages = await messageModel.find(query)
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .populate("sender", "username displayName image")
            .populate("receiver", "username displayName image")
            .lean();

        const hasMore = messages.length > limit;
        const results = messages.slice(0, limit);

        // Oldest message in this batch becomes next cursor
        const nextCursor = hasMore
            ? results[results.length - 1]._id
            : null;

        return res.status(200).json({
            message: "Messages fetched successfully",
            messages: results,
            pagination: {
                limit,
                hasMore,
                nextCursor
            }
        });

    } catch (error) {
        console.error("Get messages error:", error);

        return res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
}


// Mark messages as delivered
export async function markMessagesDelivered(req, res) {
    try {
        const receiverId = req.user._id;
        const { conversationId } = req.params;
        const { messageIds } = req.body;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversation ID"
            });
        }

        if (
            !Array.isArray(messageIds) ||
            messageIds.length === 0 ||
            messageIds.length > 100
        ) {
            return res.status(400).json({
                message: "Valid message IDs are required (maximum 100)"
            });
        }

        const validMessageIds = [
            ...new Set(messageIds.filter(id =>
                mongoose.Types.ObjectId.isValid(id)
            ))
        ];

        if (validMessageIds.length !== messageIds.length) {
            return res.status(400).json({
                message: "One or more message IDs are invalid"
            });
        }

        // Verify conversation membership
        const conversation = await conversationModel.findOne({
            _id: conversationId,
            participants: receiverId,
            isActive: true
        }).select("_id participants");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        const senderId = conversation.participants.find(
            id => id.toString() !== receiverId.toString()
        );

        if (!senderId) {
            return res.status(400).json({
                message: "Invalid conversation participants"
            });
        }

        // Verify mutual follow relationship
        const [receiverFollowsSender, senderFollowsReceiver] =
            await Promise.all([
                followModel.exists({
                    follower: receiverId,
                    following: senderId
                }),
                followModel.exists({
                    follower: senderId,
                    following: receiverId
                })
            ]);

        if (!receiverFollowsSender || !senderFollowsReceiver) {
            return res.status(403).json({
                message: "Mutual follow is required"
            });
        }

        const deliveredAt = new Date();

        // Only mark messages that were sent to this receiver
        // and have not already been delivered.
        const result = await messageModel.updateMany(
            {
                _id: { $in: validMessageIds },
                conversationId,
                sender: senderId,
                receiver: receiverId,
                deliveredAt: null,
                expiresAt: { $gt: deliveredAt }
            },
            {
                $set: { deliveredAt }
            }
        );

        // Fetch only messages updated by this acknowledgement
        const deliveredMessages = await messageModel.find({
            _id: { $in: validMessageIds },
            conversationId,
            sender: senderId,
            receiver: receiverId,
            deliveredAt,
        }).select("_id deliveredAt").lean();

        const deliveredIds = deliveredMessages.map(message =>
            message._id.toString()
        );

        // Notify original sender
        const io = req.app.get("io");

        if (io && deliveredIds.length > 0) {
            io.to(`user:${senderId}`).emit("message:delivered", {
                conversationId: conversationId.toString(),
                messageIds: deliveredIds,
                deliveredAt
            });
        }

        return res.status(200).json({
            message: "Messages marked as delivered",
            deliveredCount: result.modifiedCount,
            deliveredAt,
            messageIds: deliveredIds
        });

    } catch (error) {
        console.error("Mark messages delivered error:", error);

        return res.status(500).json({
            message: "Failed to mark messages as delivered"
        });
    }
}


// Mark incoming messages as read
export async function markMessagesRead(req, res) {
    try {
        const receiverId = req.user._id;
        const { conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                message: "Invalid conversation ID"
            });
        }

        // Verify conversation membership
        const conversation = await conversationModel.findOne({
            _id: conversationId,
            participants: receiverId,
            isActive: true
        }).select("_id participants");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        const senderId = conversation.participants.find(
            id => id.toString() !== receiverId.toString()
        );

        if (!senderId) {
            return res.status(400).json({
                message: "Invalid conversation participants"
            });
        }

        const now = new Date();

        // Find unread incoming messages
        const unreadMessages = await messageModel.find({
            conversationId,
            sender: senderId,
            receiver: receiverId,
            readAt: null,
            expiresAt: { $gt: now }
        }).select("_id").lean();

        const messageIds = unreadMessages.map(msg => msg._id);

        if (messageIds.length === 0) {
            return res.status(200).json({
                message: "No unread messages",
                readCount: 0,
                messageIds: []
            });
        }

        // Read implies delivered
        const deliveredResult = await messageModel.updateMany(
            {
                _id: { $in: messageIds },
                deliveredAt: null
            },
            {
                $set: { deliveredAt: now }
            }
        );

        // Mark messages as read
        const readResult = await messageModel.updateMany(
            {
                _id: { $in: messageIds },
                conversationId,
                receiver: receiverId,
                readAt: null,
                expiresAt: { $gt: now }
            },
            {
                $set: { readAt: now }
            }
        );

        const io = req.app.get("io");

        if (io) {
            // Send delivered event for messages that were not delivered before
            if (deliveredResult.modifiedCount > 0) {
                io.to(`user:${senderId}`).emit("message:delivered", {
                    conversationId: conversationId.toString(),
                    messageIds: messageIds.map(id => id.toString()),
                    deliveredAt: now
                });
            }

            // Send read receipt
            if (readResult.modifiedCount > 0) {
                io.to(`user:${senderId}`).emit("message:read", {
                    conversationId: conversationId.toString(),
                    messageIds: messageIds.map(id => id.toString()),
                    readAt: now
                });
            }
        }

        return res.status(200).json({
            message: "Messages marked as read",
            readCount: readResult.modifiedCount,
            messageIds: messageIds.map(id => id.toString()),
            readAt: now
        });

    } catch (error) {
        console.error("Mark messages read error:", error);

        return res.status(500).json({
            message: "Failed to mark messages as read"
        });
    }
}
