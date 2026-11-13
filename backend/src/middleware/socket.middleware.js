
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import config from "../config/config.js";

export default async function socketAuthMiddleware(socket, next) {
    try {
        // Get JWT token from Socket.IO handshake
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication token not found"));
        }

        // Verify JWT
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Verify active session
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            user: decoded.id,
            revoke: false
        });

        if (!session) {
            return next(new Error("Session expired or revoked"));
        }

        // Verify user
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return next(new Error("User not found"));
        }

        if (user.status !== "active") {
            return next(new Error("User account is not active"));
        }

        // Attach authenticated user and session to socket
        socket.user = user;
        socket.session = session;

        next();

    } catch (error) {
        console.error("Socket authentication error:", error.message);
        next(new Error("Invalid or expired token"));
    }
}
