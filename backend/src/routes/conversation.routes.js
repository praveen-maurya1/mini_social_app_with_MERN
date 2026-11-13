
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
    createOrGetConversation,
    getConversations
} from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

conversationRouter.use(authMiddleware);

conversationRouter.post("/:userId", createOrGetConversation);
conversationRouter.get("/", getConversations);

export default conversationRouter;
