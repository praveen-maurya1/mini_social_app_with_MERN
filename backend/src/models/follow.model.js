
import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    { timestamps: true }
);

// A user can follow another user only once.
followSchema.index(
    { follower: 1, following: 1 },
    { unique: true }
);

// Efficient follower/following lookups.
followSchema.index({ following: 1, createdAt: -1 });
followSchema.index({ follower: 1, createdAt: -1 });

const followModel = mongoose.model("follows", followSchema);

export default followModel;
