import postModel from "../models/post.model.js";
import commentModel from "../models/comments.model.js";
import mongoose from "mongoose";

export async function createPost(req, res) {
    const { text, image } = req.body;

    if (!text?.trim() && !image) {
        return res.status(400).json({
            message: "Post must contain text or image"
        });
    }

    const post = await postModel.create({
        userId: req.user._id,
        username: req.user.username,
        text,
        image
    });

    res.status(201).json({
        message: "Post created successfully",
        post
    });
}

// export async function getAllPosts(req, res) {
//     try {

//         const page =
//             Number(req.query.page) || 1;

//         const limit = 10;

//         const posts = await postModel
//             .find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         const totalPosts =
//             await postModel.countDocuments();

//         res.status(200).json({
//             posts,
//             hasMore:
//                 page * limit < totalPosts
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message
//         });

//     }
// }
export async function getAllPosts(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = 10;

        const posts = await postModel
            .find({
                status: "active",
                visibility: "public",
            })
            .populate("userId", "username displayName firstName lastName image verified isPlatformVerified")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const totalPosts = await postModel.countDocuments({
            status: "active",
            visibility: "public",
        });

        const formattedPosts = posts.map(post => {
            const { userId, ...postData } = post;

            return {
                ...postData,
                isLiked: post.likes?.some(
                    like => like.userId?.toString() === req.user._id.toString()
                ) || false,
                user: userId ? {
                    _id: userId._id,
                    username: userId.username,
                    displayName:
                        userId.displayName?.trim() ||
                        [userId.firstName, userId.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                        userId.username,
                    image: userId.image || "",
                    verified: userId.verified || false,
                    isPlatformVerified: userId.isPlatformVerified || false
                } : null,

                likes: (post.likes || []).map(like => ({
                    userId: like.userId,
                    username: like.username,
                })),

                likesCount: post.likesCount ?? post.likes?.length ?? 0,
            };
        });

        return res.status(200).json({
            posts: formattedPosts,
            hasMore: page * limit < totalPosts,
        });

    } catch (error) {
        console.error("Get all posts error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
}

// export async function likePost(req, res) {
//     try {

//         const post =
//             await postModel.findById(
//                 req.params.id
//             );

//         if (!post) {

//             return res.status(404)
//                 .json({
//                     message:
//                         "Post not found"
//                 });

//         }

//         const alreadyLiked =
//             post.likes.find(
//                 like =>
//                     like.userId.toString()
//                     === req.user.id
//             );

//         if (alreadyLiked) {

//             post.likes =
//                 post.likes.filter(
//                     like =>
//                         like.userId.toString()
//                         !== req.user.id
//                 );

//             await post.save();

//             return res.status(200)
//                 .json({
//                     message:
//                         "Post unliked",
//                     likes:
//                         post.likes.length
//                 });

//         }

//         post.likes.push({

//             userId: req.user.id,

//             username:
//                 req.user.username

//         });

//         await post.save();

//         res.status(200).json({

//             message:
//                 "Post liked",

//             likes:
//                 post.likes.length

//         });

//     } catch (error) {

//         res.status(500).json({

//             message:
//                 error.message

//         });

//     }
// }

export async function likePost(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check whether user already liked the post
        const alreadyLiked = post.likes.some(
            like => like.userId?.toString() === userId.toString()
        );

        if (alreadyLiked) {
            // Unlike post
            post.likes = post.likes.filter(
                like => like.userId?.toString() !== userId.toString()
            );

            post.likesCount = post.likes.length;

            await post.save();

            return res.status(200).json({
                message: "Post unliked successfully",
                liked: false,
                likes: post.likesCount
            });
        }

        // Like post
        post.likes.push({
            userId,
            username: req.user.username
        });

        post.likesCount = post.likes.length;

        await post.save();

        return res.status(200).json({
            message: "Post liked successfully",
            liked: true,
            likes: post.likesCount
        });

    } catch (error) {
        console.error("Like post error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}

export async function getComments(req, res) {
    try {
        const { id: postId } = req.params;

        // Fetch parent comments
        const comments = await commentModel
            .find({
                postId,
                parentComment: null,
                status: "active",
            })
            .populate(
                "userId",
                "username displayName firstName lastName image verified"
            )
            .populate(
                "likes",
                "username displayName image"
            )
            .sort({ createdAt: -1 })
            .lean();

        // Fetch all replies belonging to these parent comments
        const commentIds = comments.map(comment => comment._id);

        const replies = await commentModel
            .find({
                postId,
                parentComment: { $in: commentIds },
                status: "active",
            })
            .populate(
                "userId",
                "username displayName firstName lastName image verified"
            )
            .populate(
                "likes",
                "username displayName image"
            )
            .sort({ createdAt: 1 })
            .lean();

        // Format user details
        const formatUser = (user) => {
            if (!user) return null;

            return {
                _id: user._id,
                username: user.username,
                displayName:
                    user.displayName?.trim() ||
                    [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                    user.username,
                image: user.image || "",
                verified: user.verified || false,
            };
        };

        // Format likes
        const formatLikes = (likes = []) => {
            return likes.map(like => ({
                _id: like._id,
                username: like.username,
                displayName:
                    like.displayName?.trim() || like.username,
                image: like.image || "",
            }));
        };

        // Format replies
        const formattedReplies = replies.map(reply => ({
            ...reply,
            user: formatUser(reply.userId),
            likes: formatLikes(reply.likes),
            likesCount: reply.likesCount ?? reply.likes?.length ?? 0,
        }));

        // Attach replies to their parent comments
        const formattedComments = comments.map(comment => {
            const commentReplies = formattedReplies.filter(
                reply =>
                    reply.parentComment?.toString() ===
                    comment._id.toString()
            );

            return {
                ...comment,
                user: formatUser(comment.userId),
                likes: formatLikes(comment.likes),
                likesCount:
                    comment.likesCount ?? comment.likes?.length ?? 0,
                replies: commentReplies,
                repliesCount: comment.repliesCount ?? commentReplies.length,
            };
        });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments: formattedComments,
        });

    } catch (error) {
        console.error("Get comments error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
}



export async function addComment(req, res) {
    try {
        const { text, parentComment } = req.body;
        const { id: postId } = req.params;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        if (text.trim().length > 2000) {
            return res.status(400).json({
                message: "Comment cannot exceed 2000 characters"
            });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        let parent = null;

        // Validate parent comment when creating a reply
        if (parentComment) {
            if (!mongoose.Types.ObjectId.isValid(parentComment)) {
                return res.status(400).json({
                    message: "Invalid parent comment ID"
                });
            }

            parent = await commentModel.findOne({
                _id: parentComment,
                postId,
                parentComment: null,
                status: "active"
            });

            if (!parent) {
                return res.status(400).json({
                    message: "Invalid parent comment. Replies to replies are not allowed."
                });
            }
        }

        const comment = await commentModel.create({
            postId,
            userId: req.user._id,
            username: req.user.username,
            userImage: req.user.image || "",
            text: text.trim(),
            parentComment: parent ? parent._id : null,
            replyToUserId: parent ? parent.userId : null,
            replyToUsername: parent ? parent.username : ""
        });

        // Update post comments count
        post.commentsCount = (post.commentsCount || 0) + 1;
        await post.save();

        // Update parent replies count
        if (parent) {
            parent.repliesCount = (parent.repliesCount || 0) + 1;
            await parent.save();
        }

        return res.status(201).json({
            message: parent
                ? "Reply added successfully"
                : "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error("Add comment error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}


export async function likeComment(req, res) {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Valid comment ID is required"
            });
        }

        const userId = req.user._id;

        const comment = await commentModel.findOne({
            _id: id,
            status: "active"
        });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        const alreadyLiked = comment.likes.some(
            likedUserId =>
                likedUserId.toString() === userId.toString()
        );

        if (alreadyLiked) {
            comment.likes.pull(userId);
        } else {
            comment.likes.addToSet(userId);
        }

        comment.likesCount = comment.likes.length;

        await comment.save();

        return res.status(200).json({
            message: alreadyLiked
                ? "Unliked successfully"
                : "Liked successfully",
            liked: !alreadyLiked,
            likesCount: comment.likesCount
        });

    } catch (error) {
        console.error("Like comment error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}
