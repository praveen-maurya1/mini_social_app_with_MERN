import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
            }
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
            default: null
        },

        lastMessageAt: {
            type: Date,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

conversationSchema.index({ participants: 1 });

const conversationModel = mongoose.model(
    "conversations",
    conversationSchema
);

export default conversationModel;