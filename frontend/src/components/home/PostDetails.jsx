
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import PostCard from "./PostCard";

function PostDetailsDialog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [user] = useState(() =>
        JSON.parse(localStorage.getItem("user") || "null")
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get(`/posts/${id}`);

                if (!cancelled) {
                    setPost(response.data.post);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message || "Unable to load post."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchPost();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleClose = () => {
        navigate("/home", { replace: true });
    };

    const handleLikeUpdate = (postId, liked, likesCount) => {
        setPost(prev => ({
            ...prev,
            isLiked: liked,
            likesCount
        }));
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1055,
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                padding: "24px",
            }}

        >
            <div
                className="position-relative w-100"
                style={{
                    maxWidth: "680px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    backgroundColor: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "20px",
                }}

            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="btn rounded-circle position-absolute d-flex align-items-center justify-content-center"
                    style={{
                        top: "12px",
                        right: "12px",
                        width: "36px",
                        height: "36px",
                        zIndex: 2,
                        backgroundColor: "var(--color-surface-secondary)",
                        color: "var(--color-text-primary)",
                        border: "1px solid var(--color-border)",
                    }}
                    aria-label="Close post"
                >
                    <i className="bi bi-x-lg" />
                </button>

                <div className="pt-4">
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border" role="status" />
                        </div>
                    ) : error || !post ? (
                        <div className="text-center py-5">
                            <i className="bi bi-exclamation-circle fs-1 mb-3 d-block" />

                            <h5>Post unavailable</h5>

                            <p style={{ color: "var(--color-text-muted)" }}>
                                {error || "This post may have been removed."}
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={handleClose}
                            >
                                Go to Home
                            </button>
                        </div>
                    ) : (
                        <PostCard
                            post={post}
                            user={user}
                            onLikeUpdate={handleLikeUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostDetailsDialog;
