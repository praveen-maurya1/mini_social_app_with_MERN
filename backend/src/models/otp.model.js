import mongoose from "mongoose";


const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'User is required']
        },
        otpHash: {
            type: String,
            required: [true, 'OTP hash is required']
        }
    }, {
    timestamps: true
});

// Auto delete after 5 minutes
otpSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 300 }
);


const otpModel = mongoose.model('otps', otpSchema);

export default otpModel;