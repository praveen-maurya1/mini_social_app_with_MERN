
import React, { useState, useEffect } from "react";
import API from "../../services/api";

function CommentDialog({ post, onClose, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyInputs, setReplyInputs] = useState({});
    const [activeReply, setActiveReply] = useState(null);
    const [likedComments, setLikedComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchComments();
    }, [post?._id]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/posts/${post._id}/comments`
            );

            setComments(response.data.comments || []);
        } catch (error) {
            console.error("Fetch comments error:", error);
            setError(
                error.response?.data?.message ||
                "Unable to load comments."
            );
        } finally {
            setLoading(false);
        }
    };
    // Add new comment

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await API.post(`/posts/${post._id}/comment`, {
                text: newComment.trim()
            });

            const comment = response.data.comment;

            // Add newly created comment to the list
            setComments((prev) => [...prev, {
                ...comment,
                user: {
                    _id: comment.userId,
                    username: comment.username,
                    displayName: user?.displayName || user?.username || comment.username,
                    image: comment.userImage || ""
                },
                likes: [],
                likesCount: 0,
                replies: []
            }]);

            setNewComment("");

        } catch (error) {
            console.error("Add comment error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to add comment. Please try again."
            );
        }
    };


    // Add reply

    const handleAddReply = async (commentId) => {
        const replyText = replyInputs[commentId]?.trim();

        if (!replyText) return;

        try {
            const response = await API.post(`/posts/${post._id}/comment`, {
                text: replyText,
                parentComment: commentId
            });

            const reply = response.data.comment;

            const formattedReply = {
                ...reply,
                user: {
                    _id: reply.userId,
                    username: reply.username,
                    displayName: user?.displayName || user?.username || reply.username,
                    image: reply.userImage || ""
                },
                likes: [],
                likesCount: 0
            };

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: [
                                ...(comment.replies || []),
                                formattedReply
                            ],
                            repliesCount: (comment.repliesCount || 0) + 1
                        }
                        : comment
                )
            );

            setReplyInputs((prev) => ({
                ...prev,
                [commentId]: ""
            }));

            setActiveReply(null);

        } catch (error) {
            console.error("Add reply error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to add reply. Please try again."
            );
        }
    };


    // Like comment or reply



    // Like / Unlike comment or reply
    const handleLike = async (commentId, replyId = null) => {
        const targetId = replyId || commentId;

        if (!targetId) return;

        try {
            const response = await API.put(
                `/posts/comment/${targetId}/like`
            );

            const { liked, likesCount } = response.data;

            setComments((prev) =>
                prev.map((comment) => {
                    // Reply like
                    if (replyId && comment._id === commentId) {
                        return {
                            ...comment,
                            replies: (comment.replies || []).map((reply) =>
                                reply._id === replyId
                                    ? { ...reply, isLiked: liked, likesCount }
                                    : reply
                            )
                        };
                    }

                    // Normal comment like
                    if (!replyId && comment._id === commentId) {
                        return {
                            ...comment,
                            isLiked: liked,
                            likesCount
                        };
                    }

                    return comment;
                })
            );

        } catch (error) {
            console.error("Like error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to like. Please try again."
            );
        }
    };



    // Comment UI
    const renderComment = (comment) => {
        const isLiked = likedComments.includes(comment._id);

        return (
            <div key={comment._id} className="mb-4">
                <div className="d-flex gap-2">
                    {comment.user?.image?.trim() ? (
                        <img
                            src={comment.user.image}
                            alt={comment.user.displayName || comment.user.username || "User"}
                            width="38"
                            height="38"
                            className="rounded-circle flex-shrink-0"
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: "38px",
                                height: "38px",
                                backgroundColor: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                            }}
                        >
                            <i className="bi bi-person-fill fs-5" />
                        </div>
                    )}

                    <div className="flex-grow-1">
                        <div
                            className="p-3"
                            style={{
                                backgroundColor: "var(--color-surface-secondary)",
                                borderRadius: "var(--radius-lg)",
                            }}
                        >
                            <div
                                className="fw-semibold small mb-1"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                {comment.user?.displayName || comment.user?.username || "User"}
                            </div>

                            <div
                                className="small"
                                style={{
                                    color: "var(--color-text-primary)",
                                    lineHeight: "1.5",
                                }}
                            >
                                {comment.text}
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 mt-2 ms-2">
                            <small style={{ color: "var(--color-text-muted)" }}>
                                {new Date(comment.createdAt).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </small>

                            <button
                                className="btn p-0 border-0 small fw-semibold"
                                style={{
                                    color: isLiked
                                        ? "var(--color-like)"
                                        : "var(--color-text-secondary)",
                                }}
                                onClick={() => handleLike(comment._id)}
                            >
                                {isLiked ? "Liked" : "Like"}
                                {/* {comment.likes?.length + (isLiked ? 1 : 0) > 0 &&
                                    ` (${(comment.likes?.length || 0) + (isLiked ? 1 : 0)})`} */}
                                {comment.likesCount > 0 && ` (${comment.likesCount})`}
                            </button>

                            <button
                                className="btn p-0 border-0 small fw-semibold"
                                style={{ color: "var(--color-text-secondary)" }}
                                onClick={() =>
                                    setActiveReply(
                                        activeReply === comment._id
                                            ? null
                                            : comment._id
                                    )
                                }
                            >
                                Reply
                            </button>
                        </div>

                        {/* Reply Input */}
                        {activeReply === comment._id && (
                            <div className="d-flex gap-2 mt-3">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Write a reply..."
                                    value={replyInputs[comment._id] || ""}
                                    onChange={(e) =>
                                        setReplyInputs((prev) => ({
                                            ...prev,
                                            [comment._id]: e.target.value,
                                        }))
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddReply(comment._id);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "var(--color-surface)",
                                        color: "var(--color-text-primary)",
                                        borderColor: "var(--color-border)",
                                    }}
                                />

                                <button
                                    className="btn btn-sm"
                                    onClick={() => handleAddReply(comment._id)}
                                    style={{
                                        backgroundColor: "var(--color-primary)",
                                        color: "var(--color-white)",
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        )}

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                            <div
                                className="mt-3 ms-3 ps-3"
                                style={{
                                    borderLeft: "2px solid var(--color-border)",
                                }}
                            >
                                {comment.replies.map((reply) => {
                                    const replyLiked = likedComments.includes(reply.id);

                                    return (
                                        <div
                                            key={reply.id}
                                            className="d-flex gap-2 mb-3"
                                        >
                                            {reply.user?.image?.trim() ? (
                                                <img
                                                    src={reply.user.image}
                                                    alt={reply.user.displayName || reply.user.username || "User"}
                                                    width="32"
                                                    height="32"
                                                    className="rounded-circle flex-shrink-0"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        backgroundColor: "var(--color-primary-light)",
                                                        color: "var(--color-primary)",
                                                    }}
                                                >
                                                    <i className="bi bi-person-fill fs-6" />
                                                </div>
                                            )}

                                            <div className="flex-grow-1">
                                                <div
                                                    className="p-3"
                                                    style={{
                                                        backgroundColor: "var(--color-surface-secondary)",
                                                        borderRadius: "var(--radius-lg)",
                                                    }}
                                                >
                                                    <div
                                                        className="fw-semibold small mb-1"
                                                        style={{
                                                            color: "var(--color-text-primary)",
                                                        }}
                                                    >
                                                        {reply.username}
                                                    </div>

                                                    <div
                                                        className="small"
                                                        style={{
                                                            color: "var(--color-text-primary)",
                                                        }}
                                                    >
                                                        {reply.text}
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-3 mt-2 ms-2">
                                                    <small
                                                        style={{
                                                            color: "var(--color-text-muted)",
                                                        }}
                                                    >
                                                        {/* {reply.createdAt} */}
                                                        {new Date(reply.createdAt).toLocaleString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </small>

                                                    <button
                                                        className="btn p-0 border-0 small fw-semibold"
                                                        style={{
                                                            color: replyLiked
                                                                ? "var(--color-like)"
                                                                : "var(--color-text-secondary)",
                                                        }}
                                                        onClick={() => handleLike(comment._id, reply._id)}
                                                    >
                                                        {replyLiked ? "Liked" : "Like"}
                                                        {/* {reply.likes?.length + (replyLiked ? 1 : 0) > 0 &&
                                                            ` (${(reply.likes?.length || 0) + (replyLiked ? 1 : 0)})`} */}
                                                        {reply.likesCount > 0 && ` (${reply.likesCount})`}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-sm-3"
            style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                zIndex: 2100,
            }}
            onClick={onClose}
        >
            <div
                className="w-100 d-flex flex-column"
                style={{
                    maxWidth: "550px",
                    height: "min(500px, 85vh)",
                    backgroundColor: "var(--color-surface)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-lg)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="d-flex align-items-center justify-content-between p-3 border-bottom"
                    style={{ borderColor: "var(--color-border)" }}
                >
                    <h5
                        className="mb-0 fw-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Comments
                    </h5>

                    <button
                        className="btn border-0 p-1"
                        onClick={onClose}
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        <i className="bi bi-x-lg fs-5" />
                    </button>
                </div>

                {/* Comments List */}
                {/* <div className="flex-grow-1 overflow-auto p-3">
                    {comments.length > 0 ? (
                        comments.map((comment) => renderComment(comment))
                    ) : (
                        <div className="text-center py-5">
                            <i
                                className="bi bi-chat-square-text fs-1"
                                style={{ color: "var(--color-text-muted)" }}
                            />
                            <p
                                className="mt-3 mb-1 fw-semibold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                No comments yet
                            </p>
                            <small style={{ color: "var(--color-text-muted)" }}>
                                Be the first to comment on this post.
                            </small>
                        </div>
                    )}
                </div> */}
                {/* Comments List */}
                <div className="flex-grow-1 overflow-auto p-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                style={{ color: "var(--color-primary)" }}
                            />
                            <p
                                className="small mt-2"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Loading comments...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <p style={{ color: "var(--color-danger)" }}>
                                {error}
                            </p>

                            <button
                                className="btn btn-sm"
                                onClick={fetchComments}
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "var(--color-white)",
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map(comment => renderComment(comment))
                    ) : (
                        <div className="text-center py-5">
                            <i
                                className="bi bi-chat-square-text fs-1"
                                style={{ color: "var(--color-text-muted)" }}
                            />

                            <p
                                className="mt-3 mb-1 fw-semibold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                No comments yet
                            </p>

                            <small style={{ color: "var(--color-text-muted)" }}>
                                Be the first to comment on this post.
                            </small>
                        </div>
                    )}
                </div>

                {/* Add Comment */}
                <div
                    className="p-3 border-top"
                    style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                    }}
                >
                    <div className="d-flex align-items-center gap-2">
                        {user?.image?.trim() ? (
                            <img
                                src={user.image}
                                alt={user.displayName || user.username || "User"}
                                width="38"
                                height="38"
                                className="rounded-circle flex-shrink-0"
                                style={{ objectFit: "cover" }}
                            />
                        ) : (
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    backgroundColor: "var(--color-primary-light)",
                                    color: "var(--color-primary)",
                                }}
                            >
                                <i className="bi bi-person-fill" />
                            </div>
                        )}

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment();
                            }}
                            style={{
                                backgroundColor: "var(--color-surface-secondary)",
                                color: "var(--color-text-primary)",
                                borderColor: "var(--color-border)",
                                borderRadius: "var(--radius-pill)",
                            }}
                        />

                        <button
                            className="btn border-0 fw-semibold"
                            disabled={!newComment.trim()}
                            onClick={handleAddComment}
                            style={{
                                color: newComment.trim()
                                    ? "var(--color-primary)"
                                    : "var(--color-text-disabled)",
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentDialog;
