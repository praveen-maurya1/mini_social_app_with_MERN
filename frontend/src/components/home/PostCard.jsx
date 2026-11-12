import React, { useState, useRef } from "react";
import API from "../../services/api";
import CommentDialog from "./CommentDialog";

function PostCard({ post, user, onLikeUpdate }) {
    const [isLiking, setIsLiking] = useState(false);
    const isLikingRef = useRef(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const postUrl = `${window.location.origin}/post/${post._id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    const likesCount = post.likesCount ?? post.likes?.length ?? 0;
    const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;


    // const handleLike = async () => {
    //     try {
    //         const response = await API.put(`/posts/${post._id}/like`);

    //         onLikeUpdate(
    //             post._id,
    //             response.data.liked,
    //             response.data.likes
    //         );

    //     } catch (error) {
    //         console.error("Like post error:", error);

    //         alert(
    //             error.response?.data?.message ||
    //             "Unable to like post. Please try again."
    //         );
    //     }
    // };


    const handleLike = async () => {
        if (isLikingRef.current) return;

        const previousLiked = Boolean(post.isLiked);
        const previousCount = post.likesCount ?? post.likes?.length ?? 0;

        const newLiked = !previousLiked;
        const newCount = Math.max(
            0,
            previousCount + (newLiked ? 1 : -1)
        );

        // Immediately update UI (Optimistic Update)
        onLikeUpdate(post._id, newLiked, newCount);

        isLikingRef.current = true;
        setIsLiking(true);

        try {
            const response = await API.put(`/posts/${post._id}/like`);

            // Sync with actual backend response
            onLikeUpdate(
                post._id,
                response.data.liked,
                response.data.likes ?? response.data.likesCount ?? newCount
            );

        } catch (error) {
            console.error("Like post error:", error);

            // Rollback if API fails
            onLikeUpdate(
                post._id,
                previousLiked,
                previousCount
            );

            alert(
                error.response?.data?.message ||
                "Unable to like post. Please try again."
            );

        } finally {
            isLikingRef.current = false;
            setIsLiking(false);
        }
    };

    return (<>
        <article
            className="p-3"
            style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
            }}
        >
            {/* =========================
          Post Header
      ========================= */}
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    {post.avatar?.trim() ? (
                        <img
                            src={post.avatar}
                            alt={post.username || "User"}
                            width="44"
                            height="44"
                            className="rounded-circle flex-shrink-0"
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: "44px",
                                height: "44px",
                                backgroundColor: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                            }}
                        >
                            <i className="bi bi-person-fill fs-5"></i>
                        </div>
                    )}

                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span
                                className="fw-semibold"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {post.username}
                            </span>

                            {post.user?.isPlatformVerified && (
                                <i
                                    className="bi bi-patch-check-fill"
                                    style={{
                                        color: "var(--color-primary)",
                                    }}
                                />
                            )}
                        </div>

                        <small
                            style={{
                                color: "var(--color-text-muted)",
                            }}
                        >
                            {new Date(post.createdAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </small>
                    </div>
                </div>

                {/* More */}
                <button
                    type="button"
                    className="btn p-1 border-0"
                    style={{
                        color: "var(--color-text-muted)",
                    }}
                >
                    <i className="bi bi-three-dots fs-5" />
                </button>
            </div>

            {/* =========================
          Post Content
      ========================= */}
            {post.text && (
                <p
                    className="mb-3 mt-3"
                    style={{
                        color: "var(--color-text-primary)",
                        lineHeight: "1.6",
                    }}
                >
                    {post.text}
                </p>
            )}

            {/* =========================
          Post Image
      ========================= */}
            {post.image && (
                <div className="mb-3 overflow-hidden rounded-3">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-100 d-block"
                        style={{
                            maxHeight: "500px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}




            {/* =========================
          Stats
      ========================= */}
            <div
                className="d-flex align-items-center justify-content-between pb-2"
                style={{
                    color: "var(--color-text-muted)",
                    fontSize: "13px",
                }}
            >
                <span>
                    {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>

                <div className="d-flex gap-3">
                    <span>
                        {commentsCount}{" "}
                        {commentsCount === 1 ? "comment" : "comments"}
                    </span>

                    {post.shares !== undefined && (
                        <span>
                            {post.shares}{" "}
                            {post.shares === 1 ? "share" : "shares"}
                        </span>
                    )}
                </div>
            </div>

            {/* =========================
          Actions
      ========================= */}
            <div
                className="d-flex align-items-center justify-content-between border-top pt-2"
                style={{
                    borderColor: "var(--color-border-light) !important",
                }}
            >
                {/* Like */}

                {/* <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    onClick={() => handleLike(post._id)}
                    style={{
                        color: post.isLiked
                            ? "var(--color-like)"
                            : "var(--color-text-secondary)",
                    }}
                >
                    <i className={`bi ${post.isLiked ? "bi-heart-fill" : "bi-heart"}`} />
                    <span>Like</span>
                    <span>{post.likesCount ?? post.likes?.length ?? 0}</span>
                </button> */}
                <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    onClick={handleLike}
                    disabled={isLiking}
                    style={{
                        color: post.isLiked
                            ? "var(--color-like)"
                            : "var(--color-text-secondary)",
                        transition: "color 0.15s ease"
                    }}
                >
                    <i
                        className={`bi ${post.isLiked ? "bi-heart-fill" : "bi-heart"
                            }`}
                    />

                    <span>Like</span>

                    <span>{likesCount}</span>
                </button>



                {/* Comment */}
                {/* <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    style={{
                        color: "var(--color-text-secondary)",
                    }}
                >
                    <i className="bi bi-chat" />

                    <span>Comment</span>
                </button> */}
                {/* Comment */}
                <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    onClick={() => setShowComments(true)}
                    style={{
                        color: "var(--color-text-secondary)",
                    }}
                >
                    <i className="bi bi-chat" />
                    <span>Comment</span>
                </button>

                {/* Share */}
                <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                    onClick={() => setShowShareDialog(true)}
                    style={{
                        color: "var(--color-text-secondary)",
                    }}
                >
                    <i className="bi bi-share" />
                    <span className="d-none d-sm-inline">Share</span>
                </button>

                {/* Bookmark */}
                <button
                    type="button"
                    className="btn border-0 d-flex align-items-center justify-content-center"
                    onClick={() => setBookmarked((prev) => !prev)}
                    style={{
                        color: bookmarked
                            ? "var(--color-bookmark)"
                            : "var(--color-text-secondary)",
                    }}
                >
                    <i
                        className={`bi ${bookmarked
                            ? "bi-bookmark-fill"
                            : "bi-bookmark"
                            }`}
                    />
                </button>
            </div>
        </article>

        {showComments && (
            // <CommentDialog
            //     post={post}
            //     onClose={() => setShowComments(false)}
            // />
            <CommentDialog
                post={post}
                onClose={() => setShowComments(false)}
                user={user}
            />
        )}
        {showShareDialog && (
            <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                style={{
                    zIndex: 2000,
                    backgroundColor: "rgba(0,0,0,0.55)",
                }}
                onClick={() => setShowShareDialog(false)}
            >
                <div
                    className="w-100 p-4"
                    style={{
                        maxWidth: "420px",
                        backgroundColor: "var(--color-surface)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5
                            className="mb-0 fw-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Share Post
                        </h5>

                        <button
                            type="button"
                            className="btn border-0 p-1"
                            onClick={() => setShowShareDialog(false)}
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    <div
                        className="d-flex align-items-center gap-2 p-3 mb-3"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                        }}
                    >
                        <i
                            className="bi bi-link-45deg fs-5"
                            style={{ color: "var(--color-primary)" }}
                        />

                        <span
                            className="small text-truncate"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            {postUrl}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleCopyLink}
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            borderRadius: "var(--radius-md)",
                        }}
                    >
                        <i className={`bi ${copied ? "bi-check2" : "bi-copy"}`} />
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                </div>
            </div>
        )}
    </>
    );
}

export default PostCard;