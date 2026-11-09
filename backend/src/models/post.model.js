// import mongoose from "mongoose";


// const postSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "user",
//             required: true,
//         },

//         username: {
//             type: String,
//             required: true,
//         },

//         text: {
//             type: String,
//         },

//         image: {
//             type: String,
//         },

//         likes: [
//             {
//                 userId: String,
//                 username: String,
//             },
//         ],

//         comments: [
//             {
//                 userId: String,
//                 username: String,
//                 text: String,
//             },
//         ],
//     },
//     { timestamps: true }
// );

// const postModel = mongoose.model('posts', postSchema);

// export default postModel;



import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        // POST OWNER
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
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

        // POST CONTENT
        text: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        // POST VISIBILITY
        visibility: {
            type: String,
            enum: ["public", "followers", "private"],
            default: "public",
        },

        // POST ENGAGEMENT
        likes: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                },
                username: {
                    type: String,
                },
            },
        ],

        likesCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        commentsCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // POST STATUS
        status: {
            type: String,
            enum: ["active", "hidden", "removed"],
            default: "active",
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        editedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Feed query optimization
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ visibility: 1, status: 1, createdAt: -1 });

const postModel = mongoose.model("posts", postSchema);

export default postModel;
