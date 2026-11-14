
import mongoose from "mongoose";
import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import followModel from "../models/follow.model.js";
import userModel from "../models/user.model.js";

// Create or get conversation
export async function createOrGetConversation(req, res) {
    try {
        const currentUserId = req.user._id;
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                message: "You cannot create a conversation with yourself"
            });
        }

        // Check target user
        const targetUser = await userModel.findOne({
            _id: userId,
            status: "active"
        }).select("_id");

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found or inactive"
            });
        }

        // Check mutual follow
        const [currentFollowsTarget, targetFollowsCurrent] =
            await Promise.all([
                followModel.exists({
                    follower: currentUserId,
                    following: userId
                }),
                followModel.exists({
                    follower: userId,
                    following: currentUserId
                })
            ]);

        if (!currentFollowsTarget || !targetFollowsCurrent) {
            return res.status(403).json({
                message: "Mutual follow is required to start a conversation"
            });
        }

        // Find existing conversation
        let conversation = await conversationModel.findOne({
            participants: {
                $all: [currentUserId, userId],
                $size: 2
            }
        });

        // Create if it does not exist
        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [currentUserId, userId]
            });
        }

        return res.status(200).json({
            message: "Conversation ready",
            conversation
        });

    } catch (error) {
        console.error("Create conversation error:", error);

        return res.status(500).json({
            message: "Failed to create conversation"
        });
    }
}


// Get user's conversations with cursor pagination

export async function getConversations(req, res) {
    try {
        const userId = req.user._id;

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 15, 1),
            30
        );

        const cursor = req.query.cursor;

        let query = {
            participants: userId,
            isActive: true
        };

        // Cursor pagination
        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    message: "Invalid pagination cursor"
                });
            }

            const cursorConversation = await conversationModel.findOne({
                _id: cursor,
                participants: userId
            }).select("lastMessageAt createdAt");

            if (!cursorConversation) {
                return res.status(400).json({
                    message: "Invalid pagination cursor"
                });
            }

            const cursorDate =
                cursorConversation.lastMessageAt ||
                cursorConversation.createdAt;

            query.$or = [
                {
                    lastMessageAt: { $lt: cursorDate }
                },
                {
                    lastMessageAt: cursorDate,
                    _id: { $lt: cursorConversation._id }
                },
                {
                    lastMessageAt: null,
                    createdAt: { $lt: cursorDate }
                }
            ];
        }

        const conversations = await conversationModel.find(query)
            .sort({ lastMessageAt: -1, createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .populate({
                path: "participants",
                select: "username displayName firstName lastName image isOnline lastSeen"
            })
            .populate({
                path: "lastMessage",
                match: {
                    expiresAt: { $gt: new Date() }
                },
                select: "sender receiver text type media createdAt deliveredAt readAt expiresAt"
            })
            .lean();

        const hasMore = conversations.length > limit;
        const results = conversations.slice(0, limit);

        // Get conversation IDs from current page
        const conversationIds = results.map(
            conversation => conversation._id
        );

        // Calculate unread messages for each conversation
        const unreadResults = await messageModel.aggregate([
            {
                $match: {
                    conversationId: { $in: conversationIds },
                    receiver: userId,
                    readAt: null,
                    expiresAt: { $gt: new Date() }
                }
            },
            {
                $group: {
                    _id: "$conversationId",
                    unreadCount: { $sum: 1 }
                }
            }
        ]);

        // Create lookup map
        const unreadCountMap = new Map(
            unreadResults.map(item => [
                item._id.toString(),
                item.unreadCount
            ])
        );

        // Format conversations
        const formattedConversations = results.map(conversation => {
            const otherUser = conversation.participants.find(
                participant =>
                    participant._id.toString() !== userId.toString()
            );

            return {
                ...conversation,
                otherUser: otherUser || null,

                // WhatsApp-style unread count
                unreadCount:
                    unreadCountMap.get(conversation._id.toString()) || 0
            };
        });

        const nextCursor = hasMore
            ? results[results.length - 1]._id
            : null;

        return res.status(200).json({
            message: "Conversations fetched successfully",
            conversations: formattedConversations,
            pagination: {
                limit,
                hasMore,
                nextCursor
            }
        });

    } catch (error) {
        console.error("Get conversations error:", error);

        return res.status(500).json({
            message: "Failed to fetch conversations"
        });
    }
}

