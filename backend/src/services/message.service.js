
import mongoose from "mongoose";

import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import followModel from "../models/follow.model.js";

class MessageServiceError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.name = "MessageServiceError";
        this.status = status;
    }
}

const populateMessage = async (messageId) => {
    return messageModel.findById(messageId)
        .populate("sender", "username displayName image")
        .populate("receiver", "username displayName image")
        .lean();
};

export async function createMessageIdempotently({
    senderId,
    conversationId,
    text,
    clientMessageId,
    io
}) {
    // 1. Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        throw new MessageServiceError("Invalid sender ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new MessageServiceError("Invalid conversation ID", 400);
    }

    // 2. Validate message text
    if (typeof text !== "string" || !text.trim()) {
        throw new MessageServiceError("Message cannot be empty", 400);
    }

    const trimmedText = text.trim();

    if (trimmedText.length > 5000) {
        throw new MessageServiceError(
            "Message cannot exceed 5000 characters",
            400
        );
    }

    // 3. Validate client-generated ID
    if (
        clientMessageId !== undefined &&
        (
            typeof clientMessageId !== "string" ||
            !clientMessageId.trim() ||
            clientMessageId.length > 100
        )
    ) {
        throw new MessageServiceError("Invalid client message ID", 400);
    }

    const normalizedClientId = clientMessageId?.trim();

    // 4. Verify conversation membership
    const conversation = await conversationModel.findOne({
        _id: conversationId,
        participants: senderId,
        isActive: true
    });

    if (!conversation) {
        throw new MessageServiceError("Conversation not found", 404);
    }

    // 5. Check for an already-created message
    if (normalizedClientId) {
        const existingMessage = await messageModel.findOne({
            sender: senderId,
            clientMessageId: normalizedClientId
        }).select("_id conversationId");

        if (existingMessage) {
            if (
                existingMessage.conversationId.toString() !==
                conversationId.toString()
            ) {
                throw new MessageServiceError(
                    "Client message ID already used",
                    409
                );
            }

            return {
                message: await populateMessage(existingMessage._id),
                duplicate: true
            };
        }
    }

    // 6. Find receiver
    const receiverId = conversation.participants.find(
        id => id.toString() !== senderId.toString()
    );

    if (!receiverId) {
        throw new MessageServiceError(
            "Invalid conversation participants",
            400
        );
    }

    // 7. Verify mutual follow
    const [senderFollowsReceiver, receiverFollowsSender] =
        await Promise.all([
            followModel.exists({
                follower: senderId,
                following: receiverId
            }),
            followModel.exists({
                follower: receiverId,
                following: senderId
            })
        ]);

    if (!senderFollowsReceiver || !receiverFollowsSender) {
        throw new MessageServiceError(
            "Mutual follow is required to send messages",
            403
        );
    }

    try {
        // 8. Create message
        const messageData = {
            conversationId,
            sender: senderId,
            receiver: receiverId,
            type: "text",
            text: trimmedText
        };

        if (normalizedClientId) {
            messageData.clientMessageId = normalizedClientId;
        }

        const createdMessage = await messageModel.create(messageData);

        // 9. Update conversation's latest message
        await conversationModel.findByIdAndUpdate(conversationId, {
            $set: {
                lastMessage: createdMessage._id,
                lastMessageAt: createdMessage.createdAt
            }
        });

        // 10. Populate message
        const populatedMessage = await populateMessage(createdMessage._id);

        // 11. Notify receiver only for a newly created message
        if (io) {
            io.to(`user:${receiverId}`).emit("message:new", {
                message: populatedMessage,
                conversationId: conversationId.toString()
            });
        }

        return {
            message: populatedMessage,
            duplicate: false
        };

    } catch (error) {
        // 12. Handle simultaneous REST + Socket requests
        if (error.code === 11000 && normalizedClientId) {
            const existingMessage = await messageModel.findOne({
                sender: senderId,
                clientMessageId: normalizedClientId
            }).select("_id conversationId");

            if (existingMessage) {
                if (
                    existingMessage.conversationId.toString() !==
                    conversationId.toString()
                ) {
                    throw new MessageServiceError(
                        "Client message ID already used",
                        409
                    );
                }

                return {
                    message: await populateMessage(existingMessage._id),
                    duplicate: true
                };
            }
        }

        throw error;
    }
}

export { MessageServiceError };
