
import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    sendMessage,
    getMessages,
    markMessagesDelivered,
    markMessagesRead
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.use(authMiddleware);

messageRouter.get("/:conversationId", getMessages);
messageRouter.post("/:conversationId", sendMessage);
messageRouter.patch("/:conversationId/delivered", markMessagesDelivered);
messageRouter.patch("/:conversationId/read", markMessagesRead);
export default messageRouter;
