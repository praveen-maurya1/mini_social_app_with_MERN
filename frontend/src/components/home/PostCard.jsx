import React, { useState, useRef } from "react";
import API from "../../services/api";
import CommentDialog from "./CommentDialog";
import { useNavigate } from "react-router-dom";

function PostCard({ post, user, onLikeUpdate }) {
    const navigate = useNavigate();
    const [isLiking, setIsLiking] = useState(false);
    const isLikingRef = useRef(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const postUrl = `${window.location.origin}/post/${post._id}`;


    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [followStatusLoading, setFollowStatusLoading] = useState(false);


    const targetUserId =
        post.user?._id ||
        post.userId?._id ||
        post.userId;

    const isOwnPost =
        user?._id &&
        targetUserId &&
        user._id.toString() === targetUserId.toString();

    const handleMoreMenu = async () => {
        const nextState = !showMoreMenu;
        setShowMoreMenu(nextState);

        if (!nextState || !targetUserId || isOwnPost) return;

        try {
            setFollowStatusLoading(true);

            const response = await API.get(
                `/follows/${targetUserId}/status`
            );

            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error("Follow status error:", error);
        } finally {
            setFollowStatusLoading(false);
        }
    };
    const handleStartChat = async () => {
        try {
            const response = await API.post(
                `/conversations/${targetUserId}`
            );

            const conversation = response.data.conversation;

            setShowMoreMenu(false);

            navigate("/chats", {
                state: {
                    conversation
                }
            });

        } catch (error) {
            console.error(
                "Unable to start conversation:",
                error.response?.data || error
            );
        }
    };
    const handleFollowToggle = async () => {
        if (!targetUserId || followLoading) return;

        try {
            setFollowLoading(true);

            if (isFollowing) {
                await API.delete(`/follows/${targetUserId}`);
                setIsFollowing(false);
            } else {
                await API.post(`/follows/${targetUserId}`);
                setIsFollowing(true);
            }

            setShowMoreMenu(false);
        } catch (error) {
            console.error("Follow action error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update follow status."
            );
        } finally {
            setFollowLoading(false);
        }
    };

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

                {/* More Dropdown */}
                {!isOwnPost && targetUserId && (
                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn p-1 border-0"
                            onClick={handleMoreMenu}
                            style={{
                                color: "var(--color-text-muted)",
                            }}
                        >
                            <i className="bi bi-three-dots fs-5" />
                        </button>

                        {showMoreMenu && (
                            <div
                                className="position-absolute end-0"
                                style={{
                                    top: "100%",
                                    marginTop: "6px",
                                    zIndex: 1050,
                                    width: "180px",
                                    background: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-md)",
                                    boxShadow: "var(--shadow-lg)",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Follow / Unfollow */}
                                <button
                                    type="button"
                                    className="btn w-100 d-flex align-items-center gap-2 text-start border-0 rounded-0 px-3 py-2"
                                    onClick={handleFollowToggle}
                                    disabled={followLoading || followStatusLoading}
                                    style={{
                                        color: "var(--color-text-primary)",
                                        backgroundColor: "transparent",
                                        fontSize: "14px",
                                    }}
                                >
                                    <i
                                        className={`bi ${isFollowing
                                            ? "bi-person-dash"
                                            : "bi-person-plus"
                                            }`}
                                    />

                                    {followStatusLoading
                                        ? "Loading..."
                                        : followLoading
                                            ? "Please wait..."
                                            : isFollowing
                                                ? "Unfollow"
                                                : "Follow"}
                                </button>

                                {/* Message - Only for mutual followers */}
                                {post.isMutualFollow && (
                                    <>
                                        <div
                                            style={{
                                                borderTop: "1px solid var(--color-border)",
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn w-100 d-flex align-items-center gap-2 text-start border-0 rounded-0 px-3 py-2"
                                            onClick={handleStartChat}
                                            style={{
                                                color: "var(--color-text-primary)",
                                                backgroundColor: "transparent",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <i className="bi bi-chat-dots" />
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}


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