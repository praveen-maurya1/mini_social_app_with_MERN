import userModel from "../models/user.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";

export async function register(req, res) {

    const { username, email, password } = req.body;

    const isaAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isaAlreadyRegistered) {
        return res.status(409).json({
            message: 'Username or email already exists'
        })
    }


    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const User = await userModel.create({
        username,
        email,
        password: hashedPassword
    });


    const otp = generateOtp();

    const html = getOtpHtml(otp);

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await otpModel.create({
        email,
        user: User._id,
        otpHash
    });

    await sendEmail(email, 'Verify your email', `Your OTP code is ${otp}`, html);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            username: User.username,
            email: User.email,
            verified: User.verified
        }
    });

}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }

    if (!user.verified) {
        return res.status(403).json({
            message: 'Please verify your email before logging in'
        });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,

        secure: true, //for production
        sameSite: 'none', //for production

        // secure: false,  //for development
        // sameSite: 'lax', //for development

        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        message: 'Logged in successfully',
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    });

}

export async function getMe(req, res) {

    res.status(200).json({
        message: 'User fetched successfully',
        user: {
            username: req.user.username,
            email: req.user.email,
            verified: req.user.verified
        }
    });

}

export async function refreshToken(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: 'Refresh token not found'
        });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke: false
    });

    if (!session) {
        return res.status(401).json({
            message: 'Invalid refresh token'
        });
    }

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );

    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        message: 'Access token refreshed successfully',
        accessToken
    });

}

export async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token not found'
        });
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoke: false
    });

    if (!session) {
        return res.status(400).json({
            message: 'Invalid refresh token'
        });
    }

    session.revoke = true;
    await session.save();

    res.clearCookie('refreshToken');

    res.status(200).json({
        message: 'Logged out successfully'
    });
}

export async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token not found'
        });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        user: decoded.id,
        revoke: false
    }, {
        revoke: true
    });

    res.clearCookie('refreshToken');

    res.status(200).json({
        message: 'Logged out from all devices successfully'
    });
}

export async function verifyEmail(req, res) {

    const { otp, email } = req.body;

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: 'Invalid OTP'
        })
    }

    const user = await userModel.findByIdAndUpdate(
        otpDoc.user,
        { verified: true },
        { new: true }
    );

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message: 'Email verified successfully',
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });

}
