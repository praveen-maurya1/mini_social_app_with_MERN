
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        // POST REFERENCE
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
            required: true,
        },

        // COMMENT OWNER
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        username: {
            type: String,
            required: true,
            trim: true,
        },

        userImage: {
            type: String,
            default: "",
        },

        // COMMENT CONTENT
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        // REPLY SYSTEM
        // null = Original comment
        // ObjectId = Reply to an original comment
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
            default: null,
        },

        replyToUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },

        replyToUsername: {
            type: String,
            default: "",
            trim: true,
        },

        // COMMENT LIKES
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],

        likesCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // REPLY COUNT
        repliesCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // COMMENT STATUS
        status: {
            type: String,
            enum: ["active", "hidden", "removed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
commentSchema.index({
    postId: 1,
    parentComment: 1,
    createdAt: 1,
});

commentSchema.index({
    userId: 1,
    createdAt: -1,
});

const commentModel = mongoose.model("comments", commentSchema);

export default commentModel;
