// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, 'Username is required'],
//         unique: [true, 'Username must be unique']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: [true, 'Email must be unique']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required']
//     },
//     verified: {
//         type: Boolean,
//         default: false
//     },
//     image: {
//         type: String,
//         default: ""
//     },
// });

// const userModel = mongoose.model('users', userSchema);

// export default userModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    // BASIC INFORMATION
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },

    displayName: {
        type: String,
        trim: true,
        maxlength: 50,
        default: ""
    },

    firstName: {
        type: String,
        trim: true,
        maxlength: 50,
        default: ""
    },

    lastName: {
        type: String,
        trim: true,
        maxlength: 50,
        default: ""
    },


    // PROFILE INFORMATION
    image: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 160,
        default: ""
    },

    location: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ""
    },

    dateOfBirth: {
        type: Date,
        default: null
    },


    // ACCOUNT VERIFICATION
    verified: {
        type: Boolean,
        default: false
    },

    emailVerifiedAt: {
        type: Date,
        default: null
    },
    isPlatformVerified: {
        type: Boolean,
        default: false
    },

    // ACCOUNT STATUS
    status: {
        type: String,
        enum: ["active", "suspended", "deactivated"],
        default: "active"
    },

    isOnline: {
        type: Boolean,
        default: false
    },

    lastSeen: {
        type: Date,
        default: null
    },


    // USER PREFERENCES
    preferences: {
        theme: {
            type: String,
            enum: ["light", "dark", "system"],
            default: "system"
        },

        notifications: {
            likes: {
                type: Boolean,
                default: true
            },

            comments: {
                type: Boolean,
                default: true
            },

            followers: {
                type: Boolean,
                default: true
            },

            messages: {
                type: Boolean,
                default: true
            }
        }
    }

}, {
    timestamps: true
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
