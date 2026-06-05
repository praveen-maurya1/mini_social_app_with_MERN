import authMiddleware from "../middleware/auth.middleware.js";
import * as postController from "../controllers/post.controller.js";
import { Router } from "express";

const postRouter = Router();

// POST /api/posts

postRouter.post("/", authMiddleware, postController.createPost);

// GET /api/posts
postRouter.get("/", authMiddleware, postController.getAllPosts);

// PUT /api/posts/POST_ID/like
postRouter.put("/:id/like", authMiddleware, postController.likePost);


// POST /api/posts/POST_ID/comment
postRouter.post("/:id/comment", authMiddleware, postController.addComment);

export default postRouter;