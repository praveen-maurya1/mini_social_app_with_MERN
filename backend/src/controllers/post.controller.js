import postModel from "../models/post.model.js";

export async function createPost(req, res) {
    const { text, image } = req.body;

    const post = await postModel.create({
        userId: req.user._id,
        username: req.user.username,
        text,
        image
    });

    res.status(201).json({
        message: "Post created successfully",
        post
    });
}

export async function getAllPosts(req, res) {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export async function likePost(req, res) {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.find(
            (like) => like.userId === req.user.id
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (like) => like.userId !== req.user.id
            );

            await post.save();

            return res.status(200).json({
                message: "Post unliked",
                likes: post.likes.length
            });
        }

        post.likes.push({
            userId: req.user.id,
            username: req.user.username
        });

        await post.save();

        res.status(200).json({
            message: "Post liked",
            likes: post.likes.length
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export async function addComment(req, res) {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.comments.push({
            userId: req.user.id,
            username: req.user.username,
            text
        });

        await post.save();

        res.status(200).json({
            message: "Comment added successfully",
            commentsCount: post.comments.length,
            comments: post.comments
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}