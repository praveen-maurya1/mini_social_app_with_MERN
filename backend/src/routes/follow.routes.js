import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
    followUser,
    unfollowUser,
    getFollowStatus,
    getFollowers,
    getFollowing,
} from "../controllers/follow.controller.js";

const followRouter = express.Router();

followRouter.use(authMiddleware);

followRouter.get("/:userId/status", getFollowStatus);
followRouter.get("/:userId/followers", getFollowers);
followRouter.get("/:userId/following", getFollowing);

followRouter.post("/:userId", followUser);
followRouter.delete("/:userId", unfollowUser);

export default followRouter;
