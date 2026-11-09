
import React, { useState } from "react";
import posts from "../../data/posts";
import PostCard from "../home/PostCard";

function ProfilePosts() {
    const [activeTab, setActiveTab] = useState("Posts");
    const [selectedPost, setSelectedPost] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const tabs = [
        { label: "Posts", icon: "bi-grid-3x3" },
        { label: "Saved", icon: "bi-bookmark" },
        { label: "Tagged", icon: "bi-person-square" },
    ];

    const visiblePosts = posts.filter((post) => post.image);

    return (
        <>
            <section>
                {/* Tabs */}
                <div
                    className="d-flex align-items-center justify-content-center gap-5"
                    style={{
                        borderTop: "1px solid var(--color-border)",
                        borderBottom: "1px solid var(--color-border-light)",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className="btn rounded-0 border-0 d-flex align-items-center gap-2 py-3 px-2"
                            style={{
                                color:
                                    activeTab === tab.label
                                        ? "var(--color-text-primary)"
                                        : "var(--color-text-muted)",
                                borderBottom:
                                    activeTab === tab.label
                                        ? "2px solid var(--color-primary)"
                                        : "2px solid transparent",
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "1px",
                            }}
                        >
                            <i className={`bi ${tab.icon}`} />
                            <span className="d-none d-sm-inline">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {activeTab === "Posts" ? (
                    <div className="row g-1 g-md-2 mt-1">
                        {visiblePosts.map((post) => (
                            <div
                                className="col-4"
                                key={post.id || post._id}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedPost(post)}
                                    className="btn p-0 border-0 w-100 overflow-hidden"
                                    style={{
                                        aspectRatio: "1 / 1",
                                        backgroundColor:
                                            "var(--color-surface-secondary)",
                                    }}
                                >
                                    <img
                                        src={post.image}
                                        alt="Profile post"
                                        className="w-100 h-100"
                                        style={{
                                            objectFit: "cover",
                                        }}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i
                            className={
                                activeTab === "Saved"
                                    ? "bi bi-bookmark"
                                    : "bi bi-person-square"
                            }
                            style={{
                                fontSize: "42px",
                                color: "var(--color-text-muted)",
                            }}
                        />

                        <h6 className="fw-semibold mt-3">
                            {activeTab === "Saved"
                                ? "No saved posts yet"
                                : "No tagged posts yet"}
                        </h6>

                        <p
                            className="small"
                            style={{
                                color: "var(--color-text-muted)",
                            }}
                        >
                            {activeTab === "Saved"
                                ? "Posts you save will appear here."
                                : "Posts you're tagged in will appear here."}
                        </p>
                    </div>
                )}
            </section>

            {/* Post Dialog */}
            {selectedPost && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4"
                    onClick={() => setSelectedPost(null)}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        zIndex: 2000,
                    }}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        className="btn position-absolute top-0 end-0 m-3 border-0"
                        onClick={() => setSelectedPost(null)}
                        style={{
                            color: "var(--color-white)",
                        }}
                        aria-label="Close post"
                    >
                        <i className="bi bi-x-lg fs-3" />
                    </button>

                    {/* Complete PostCard */}
                    <div
                        className="w-100 overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            borderRadius: "var(--radius-lg)",
                            backgroundColor: "var(--color-surface)",
                        }}
                    >
                        <PostCard post={selectedPost} onCommentClick={() => setShowComments(true)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfilePosts;
