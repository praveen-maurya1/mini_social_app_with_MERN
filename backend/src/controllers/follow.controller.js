
import mongoose from "mongoose";
import followModel from "../models/follow.model.js";
import userModel from "../models/user.model.js";

// Follow a user
export async function followUser(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                message: "You cannot follow yourself",
            });
        }

        const targetUser = await userModel.findOne({
            _id: userId,
            status: "active",
        }).select("_id username");

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingFollow = await followModel.findOne({
            follower: currentUserId,
            following: userId,
        });

        if (!existingFollow) {
            try {
                await followModel.create({
                    follower: currentUserId,
                    following: userId,
                });
            } catch (error) {
                // Handle simultaneous duplicate follow requests.
                if (error.code !== 11000) throw error;
            }
        }

        const isFollowedBack = await followModel.exists({
            follower: userId,
            following: currentUserId,
        });

        return res.status(200).json({
            message: existingFollow
                ? "Already following this user"
                : "User followed successfully",
            isFollowing: true,
            isFollowedBy: Boolean(isFollowedBack),
            canChat: Boolean(isFollowedBack),
        });
    } catch (error) {
        console.error("Follow user error:", error);
        return res.status(500).json({
            message: "Unable to follow user",
        });
    }
}

// Unfollow a user
export async function unfollowUser(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (currentUserId.toString() === userId) {
            return res.status(400).json({
                message: "Invalid unfollow request",
            });
        }

        await followModel.deleteOne({
            follower: currentUserId,
            following: userId,
        });

        const isFollowedBy = await followModel.exists({
            follower: userId,
            following: currentUserId,
        });

        return res.status(200).json({
            message: "User unfollowed successfully",
            isFollowing: false,
            isFollowedBy: Boolean(isFollowedBy),
            canChat: false,
        });
    } catch (error) {
        console.error("Unfollow user error:", error);
        return res.status(500).json({
            message: "Unable to unfollow user",
        });
    }
}

// Check follow relationship and mutual-follow chat permission
export async function getFollowStatus(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (currentUserId.toString() === userId) {
            return res.status(200).json({
                isFollowing: false,
                isFollowedBy: false,
                isMutual: false,
                canChat: false,
                isSelf: true,
            });
        }

        const [isFollowing, isFollowedBy] = await Promise.all([
            followModel.exists({
                follower: currentUserId,
                following: userId,
            }),
            followModel.exists({
                follower: userId,
                following: currentUserId,
            }),
        ]);

        const mutual = Boolean(isFollowing && isFollowedBy);

        return res.status(200).json({
            isFollowing: Boolean(isFollowing),
            isFollowedBy: Boolean(isFollowedBy),
            isMutual: mutual,
            canChat: mutual,
            isSelf: false,
        });
    } catch (error) {
        console.error("Get follow status error:", error);
        return res.status(500).json({
            message: "Unable to fetch follow status",
        });
    }
}

// Get followers of a user
export async function getFollowers(req, res) {
    try {
        const { userId } = req.params;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const [follows, total] = await Promise.all([
            followModel.find({ following: userId })
                .populate("follower", "username displayName image verified isPlatformVerified")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            followModel.countDocuments({ following: userId }),
        ]);

        return res.status(200).json({
            followers: follows.map(item => item.follower).filter(Boolean),
            total,
            page,
            hasMore: skip + follows.length < total,
        });
    } catch (error) {
        console.error("Get followers error:", error);
        return res.status(500).json({
            message: "Unable to fetch followers",
        });
    }
}

// Get users followed by a user
export async function getFollowing(req, res) {
    try {
        const { userId } = req.params;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const [follows, total] = await Promise.all([
            followModel.find({ follower: userId })
                .populate("following", "username displayName image verified isPlatformVerified")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            followModel.countDocuments({ follower: userId }),
        ]);

        return res.status(200).json({
            following: follows.map(item => item.following).filter(Boolean),
            total,
            page,
            hasMore: skip + follows.length < total,
        });
    } catch (error) {
        console.error("Get following error:", error);
        return res.status(500).json({
            message: "Unable to fetch following",
        });
    }
}
