import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        text: {
            type: String,
        },

        image: {
            type: String,
        },

        likes: [
            {
                userId: String,
                username: String,
            },
        ],

        comments: [
            {
                userId: String,
                username: String,
                text: String,
            },
        ],
    },
    { timestamps: true }
);

const postModel = mongoose.model('posts', postSchema);

export default postModel;