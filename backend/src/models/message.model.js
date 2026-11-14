import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversations",
            required: true,
            index: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        // Client-generated ID for safe retries and duplicate prevention
        clientMessageId: {
            type: String,
            trim: true,
            default: undefined
        },

        type: {
            type: String,
            enum: ["text", "image", "video", "file", "audio", "call"],
            required: true,
            default: "text"
        },

        text: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: ""
        },

        media: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
            mimeType: { type: String, default: "" },
            fileName: { type: String, default: "" },
            fileSize: { type: Number, default: 0 }
        },

        call: {
            callId: { type: String, default: "" },

            callType: {
                type: String,
                enum: ["audio", "video"],
                default: undefined
            },

            status: {
                type: String,
                enum: ["initiated", "answered", "missed", "rejected", "ended", "cancelled"],
                default: undefined
            },

            startedAt: { type: Date, default: null },
            answeredAt: { type: Date, default: null },
            endedAt: { type: Date, default: null },

            duration: { type: Number, default: 0 }
        },

        deliveredAt: {
            type: Date,
            default: null
        },

        readAt: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 48 * 60 * 60 * 1000)
        }
    },
    { timestamps: true }
);

// Chat timeline
messageSchema.index({ conversationId: 1, createdAt: -1 });

// Prevent duplicate messages when the same client request is retried
messageSchema.index(
    { sender: 1, clientMessageId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            clientMessageId: { $type: "string" }
        }
    }
);

// Automatically delete each message after 48 hours
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
