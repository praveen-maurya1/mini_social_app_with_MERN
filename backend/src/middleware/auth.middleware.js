// import jwt from "jsonwebtoken";
// import userModel from "../models/user.model.js";
// import config from "../config/config.js";

// export default async function authMiddleware(req, res, next) {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({
//                 message: "Token not found"
//             });
//         }

//         const decoded = jwt.verify(token, config.JWT_SECRET);

//         const user = await userModel.findById(decoded.id);

//         req.user = user;

//         next();

//     } catch (error) {
//         return res.status(401).json({
//             message: "Invalid token"
//         });
//     }
// }

import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import config from "../config/config.js";

export default async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token not found",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Validate session
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            user: decoded.id,
            revoke: false,
        });

        if (!session) {
            return res.status(401).json({
                message: "Session expired or revoked. Please login again.",
            });
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                message: "Your account is not active",
            });
        }

        req.user = user;
        req.session = session;

        next();

    } catch (error) {
        console.error("Auth error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}