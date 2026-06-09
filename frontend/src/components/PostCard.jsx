import { useState } from "react";
import API from "../services/api";

function PostCard({ post, fetchPosts }) {

    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        try {
            await API.put(
                `/posts/${post._id}/like`
            );

            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    };

    const handleComment = async () => {
        try {

            if (!comment.trim()) return;
            setLoading(true);
            await API.post(
                `/posts/${post._id}/comment`,
                {
                    text: comment
                }
            );

            setComment("");

            fetchPosts();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-3 p-3 shadow-sm">

            <h5>{post.username}</h5>

            {post.text && (
                <p>{post.text}</p>
            )}

            {post.image && (
                <img
                    src={post.image}
                    alt="post"
                    className="img-fluid rounded mb-3"
                />
            )}

            <div className="d-flex gap-2 mb-3">

                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLike}
                >
                    ❤️ {post.likes.length}
                </button>

                <button
                    className="btn btn-outline-secondary btn-sm"
                >
                    💬 {post.comments.length}
                </button>

            </div>

            <div className="d-flex gap-2 mb-3">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                />

                <button
                    disabled={!comment, loading}
                    className="btn btn-primary"
                    onClick={handleComment}
                >
                    {loading
                        ? "Adding..."
                        : "Add"}

                </button>

            </div>

            {post.comments.length > 0 && (
                <div>

                    <h6>Comments</h6>

                    {post.comments.map(
                        (comment, index) => (
                            <div
                                key={index}
                                className="border-top pt-2 mt-2"
                            >
                                <strong>
                                    {comment.username}
                                </strong>

                                <p className="mb-1">
                                    {comment.text}
                                </p>
                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default PostCard;