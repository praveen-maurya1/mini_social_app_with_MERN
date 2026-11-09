import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MobileNav from "../components/layout/MobileNav";
import CreatePost from "../components/home/CreatePost";
import PostCard from "../components/home/PostCard";
import SuggestedUsers from "../components/home/SuggestedUsers";
import Trending from "../components/home/Trending";
import API from "../services/api";

function Home() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState("");

    const feedRef = useRef(null);
    const isFetchingRef = useRef(false);
    const currentPageRef = useRef(1);

    const handlePostLikeUpdate = (postId, liked, likesCount) => {
        setPosts((prev) =>
            prev.map((post) =>
                post._id === postId
                    ? { ...post, isLiked: liked, likesCount }
                    : post
            )
        );
    };

    const fetchPosts = async (pageNumber = 1) => {
        if (isFetchingRef.current) return;

        try {
            isFetchingRef.current = true;
            setLoadingPosts(true);
            setError("");

            const response = await API.get(`/posts?page=${pageNumber}`);

            const newPosts = response.data.posts || [];

            if (pageNumber === 1) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }

            currentPageRef.current = pageNumber;
            setHasMore(Boolean(response.data.hasMore));

        } catch (error) {
            console.log(error);
            setError("Unable to load posts. Please try again.");
        } finally {
            isFetchingRef.current = false;
            setLoadingPosts(false);
        }
    };

    const fetchMe = async () => {
        try {
            const res = await API.get("/auth/get-me");

            setUser(res.data.user);

            // console.log("Fetched User:", res.data.user);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMe();
        fetchPosts(1);
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page]);

    useEffect(() => {
        const feed = feedRef.current;

        if (!feed) return;

        const handleScroll = () => {
            const bottom =
                feed.scrollTop + feed.clientHeight >=
                feed.scrollHeight - 200;

            if (
                bottom &&
                hasMore &&
                !isFetchingRef.current
            ) {
                fetchPosts(currentPageRef.current + 1);
            }
        };

        feed.addEventListener("scroll", handleScroll);

        return () => {
            feed.removeEventListener("scroll", handleScroll);
        };

    }, [hasMore, posts.length]);


    return (
        <div className="min-vh-100" style={{
            backgroundColor: "var(--color-background)",
            color: "var(--color-text-primary)",
        }}>
            <div className="d-flex" style={{ height: "100vh", overflow: "hidden", }}>
                <div className="d-none d-lg-block flex-shrink-0"><Sidebar user={user} /></div>
                <div className="flex-grow-1 min-vw-0 d-flex flex-column"
                    style={{ height: "100vh", minHeight: 0, overflow: "hidden", }}>
                    <Topbar user={user} />
                    <div className="container-fluid flex-grow-1 p-0 " style={{ overflow: "hidden", }}>
                        <div className="row h-100 g-0">
                            <main ref={feedRef}
                                className="col-12 col-lg-8 col-xl-8 main-feed-scroll"
                                style={{ height: "100%", minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
                                <div className="container py-lg-4 onlyPc" style={{ paddingBottom: "70px" }}>
                                    <CreatePost fetchPosts={fetchPosts} user={user} />

                                    <div className="d-flex flex-column gap-3">

                                        {error && (
                                            <div className="text-center py-3">
                                                <p style={{ color: "var(--color-danger)" }}>
                                                    {error}
                                                </p>

                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => {
                                                        requestedPageRef.current = 1;
                                                        setPage(1);
                                                        fetchPosts(1);
                                                    }}
                                                    disabled={loadingPosts}
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        )}

                                        {!loadingPosts && !error && posts.length === 0 && (
                                            <div
                                                className="text-center p-5"
                                                style={{
                                                    backgroundColor: "var(--color-surface)",
                                                    borderRadius: "var(--radius-lg)",
                                                    color: "var(--color-text-secondary)",
                                                }}
                                            >
                                                <i className="bi bi-chat-square-text fs-1 mb-3 d-block" />
                                                <h5>No posts yet</h5>
                                                <p className="mb-0">
                                                    Be the first to share something!
                                                </p>
                                            </div>
                                        )}

                                        {posts.map((post) => (
                                            <PostCard
                                                key={post._id}
                                                post={post}
                                                fetchPosts={fetchPosts}
                                                setPosts={setPosts}
                                                user={user}
                                                onLikeUpdate={handlePostLikeUpdate}
                                            />
                                        ))}
                                        

                                        {loadingPosts && (
                                            <div className="text-center my-4">
                                                <div
                                                    className="spinner-border"
                                                    style={{ color: "var(--color-primary)" }}
                                                />
                                                <p className="mt-2 text-secondary">
                                                    Loading posts...
                                                </p>
                                            </div>
                                        )}

                                        {!hasMore && posts.length > 0 && (
                                            <p className="text-center my-3 text-secondary">
                                                You've reached the end!
                                            </p>
                                        )}

                                    </div >
                                </div>
                            </main>
                            <aside className="d-none d-lg-block col-lg-4 col-xl-4"
                                style={{ height: "100%", overflowY: "auto", overflowX: "hidden", }}>
                                <div className="py-4 pe-3">
                                    <SuggestedUsers />
                                    <Trending />
                                    <div
                                        className="mt-3 p-4"
                                        style={{
                                            minHeight: "180px", borderRadius: "var(--radius-lg)",
                                            backgroundColor: "var(--color-primary)",
                                            color: "var(--color-white)", boxShadow: "var(--shadow-sm)",
                                        }}
                                    >
                                        <div className="h-100 d-flex flex-column justify-content-end">
                                            <span className="fs-4 fw-bold">Collect</span>
                                            <span className="fs-4 fw-bold">Moments</span>
                                            <span className="fs-4 fw-bold">Not Things.</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
            <MobileNav />
        </div>
    );
}
export default Home;