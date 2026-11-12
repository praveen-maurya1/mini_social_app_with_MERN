import React, { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MobileNav from "../components/layout/MobileNav";

import SuggestedUsers from "../components/home/SuggestedUsers";
import Trending from "../components/home/Trending";


function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    const query = searchQuery.trim().toLowerCase();

    const filteredUsers = users;

    const filteredPosts = posts;

    // const filteredTrends = trends.filter((trend) =>
    //     `${trend.name || trend.title}`
    //         .toLowerCase()
    //         .includes(query)
    // );

    const [user, setUser] = useState(null);
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
    }, []);

    useEffect(() => {
        if (!query) {
            setUsers([]);
            setPosts([]);
            setSearchError("");
            setSearchLoading(false);
            return;
        }

        const delaySearch = setTimeout(async () => {
            try {
                setSearchLoading(true);
                setSearchError("");

                let type = "all";

                if (activeFilter === "People") {
                    type = "users";
                } else if (activeFilter === "Posts") {
                    type = "posts";
                }

                if (activeFilter === "Topics") {
                    setUsers([]);
                    setPosts([]);
                    return;
                }

                const response = await API.get("/posts/search", {
                    params: {
                        q: query,
                        type,
                        page: 1,
                        limit: 10
                    }
                });

                setUsers(response.data.users || []);
                setPosts(response.data.posts || []);

            } catch (error) {
                console.error("Search API error:", error);

                setSearchError(
                    error.response?.data?.message ||
                    "Unable to search. Please try again."
                );

                setUsers([]);
                setPosts([]);

            } finally {
                setSearchLoading(false);
            }
        }, 400);

        return () => clearTimeout(delaySearch);

    }, [query, activeFilter]);


    // const filters = ["All", "People", "Posts", "Topics"];
    const filters = ["All", "People", "Posts"];

    const showPeople =
        activeFilter === "All" || activeFilter === "People";

    const showPosts =
        activeFilter === "All" || activeFilter === "Posts";

    // const showTopics =
    //     activeFilter === "All" || activeFilter === "Topics";

    const hasResults =
        (showPeople && filteredUsers.length > 0) ||
        (showPosts && filteredPosts.length > 0)

    // const hasResults =
    //     (showPeople && filteredUsers.length > 0) ||
    //     (showPosts && filteredPosts.length > 0) ||
    //     (showTopics && filteredTrends.length > 0);

    return (
        <div
            style={{
                backgroundColor: "var(--color-background)",
                color: "var(--color-text-primary)",
            }}
        >
            <div
                className="d-flex"
                style={{
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {/* Desktop Sidebar */}
                <div className="d-none d-lg-block flex-shrink-0">
                    <Sidebar user={user} />
                </div>

                {/* Main Area */}
                <div
                    className="flex-grow-1 min-vw-0 d-flex flex-column"
                    style={{
                        height: "100vh",
                        overflow: "hidden",
                    }}
                >
                    <Topbar />

                    <div
                        className="container-fluid flex-grow-1 p-0 mb-lg-0 mb-5"
                        style={{ overflow: "hidden" }}
                    >
                        <div className="row h-100 g-0 ">

                            {/* Search Results */}
                            <main
                                className="col-12 col-lg-8 col-xl-8 main-feed-scroll"
                                style={{
                                    height: "100%",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                }}
                            >
                                <div className="container px-3 pb-lg-4">

                                    {/* Heading */}
                                    <div className="pt-4 pb-3">
                                        <h4
                                            className="fw-bold mb-1"
                                            style={{
                                                color: "var(--color-text-primary)",
                                            }}
                                        >
                                            Explore
                                        </h4>

                                        <p
                                            className="mb-0"
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "14px",
                                            }}
                                        >
                                            Discover people, posts and topics.
                                        </p>
                                    </div>

                                    {/* Search Input */}
                                    <div
                                        className="d-flex align-items-center gap-3 px-3 mb-3"
                                        style={{
                                            height: "48px",
                                            backgroundColor: "var(--color-surface)",
                                            border: "1px solid var(--color-border)",
                                            borderRadius: "var(--radius-lg)",
                                        }}
                                    >
                                        <i
                                            className="bi bi-search"
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "18px",
                                            }}
                                        />

                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search people, posts, topics..."
                                            className="form-control border-0 shadow-none p-0"
                                            style={{
                                                backgroundColor: "transparent",
                                                color: "var(--color-text-primary)",
                                                fontSize: "14px",
                                            }}
                                        />

                                        {searchQuery && (
                                            <button
                                                type="button"
                                                className="btn border-0 p-0"
                                                onClick={() => setSearchQuery("")}
                                                style={{
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                <i className="bi bi-x-circle-fill" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Filters */}
                                    <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
                                        {filters.map((filter) => (
                                            <button
                                                key={filter}
                                                type="button"
                                                className="btn btn-sm px-3"
                                                onClick={() => setActiveFilter(filter)}
                                                style={{
                                                    borderRadius: "var(--radius-pill)",
                                                    backgroundColor:
                                                        activeFilter === filter
                                                            ? "var(--color-primary)"
                                                            : "var(--color-surface)",
                                                    color:
                                                        activeFilter === filter
                                                            ? "var(--color-white)"
                                                            : "var(--color-text-secondary)",
                                                    border:
                                                        activeFilter === filter
                                                            ? "1px solid var(--color-primary)"
                                                            : "1px solid var(--color-border)",
                                                }}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Results */}
                                    {searchLoading && (
                                        <div className="text-center py-4">
                                            <div
                                                className="spinner-border"
                                                style={{ color: "var(--color-primary)" }}
                                            />
                                            <p className="small mt-2 text-secondary">
                                                Searching...
                                            </p>
                                        </div>
                                    )}

                                    {searchError && (
                                        <div className="text-center py-3">
                                            <p style={{ color: "var(--color-danger)" }}>
                                                {searchError}
                                            </p>
                                        </div>
                                    )}
                                    {!hasResults ? (
                                        <div
                                            className="text-center py-5"
                                            style={{
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            <i className="bi bi-search fs-1" />

                                            <h6
                                                className="mt-3 fw-semibold"
                                                style={{
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                No results found
                                            </h6>

                                            <p className="small mb-0">
                                                Try searching with another keyword.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* People */}
                                            {showPeople && filteredUsers.length > 0 && (
                                                <section className="mb-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="fw-bold mb-0">
                                                            People
                                                        </h6>
                                                        <span
                                                            className="small"
                                                            style={{
                                                                color: "var(--color-text-muted)",
                                                            }}
                                                        >
                                                            {filteredUsers.length} results
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="p-3"
                                                        style={{
                                                            backgroundColor: "var(--color-surface)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-lg)",
                                                        }}
                                                    >
                                                        {filteredUsers.map((user) => (
                                                            <div
                                                                key={user._id}
                                                                className="d-flex align-items-center gap-3 py-2"
                                                            >
                                                                {/* <img
                                                                    src={user.image}
                                                                    alt={user.displayName || user.username}
                                                                    width="46"
                                                                    height="46"
                                                                    className="rounded-circle"
                                                                    style={{
                                                                        objectFit: "cover",
                                                                    }}
                                                                /> */}
                                                                {user.user?.image || user.userImage ? (
                                                                    <img
                                                                        src={user.user?.image || user.userImage}
                                                                        alt="User"
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

                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <div className="d-flex align-items-center gap-1">
                                                                        <span className="fw-semibold text-truncate">
                                                                            {user.displayName || user.username}
                                                                        </span>

                                                                        {user.isPlatformVerified && (
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
                                                                        @{user.username}
                                                                    </small>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm px-3"
                                                                    style={{
                                                                        backgroundColor: "var(--color-primary-light)",
                                                                        color: "var(--color-primary)",
                                                                        borderRadius: "var(--radius-pill)",
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Follow
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {/* Posts */}
                                            {/* {showPosts && filteredPosts.length > 0 && (
                                                <section className="mb-4">
                                                    <h6 className="fw-bold mb-3">
                                                        Posts
                                                    </h6>

                                                    <div className="d-flex flex-column gap-3">
                                                        {filteredPosts.map((post) => (
                                                            <div
                                                                key={post.id || post._id}
                                                                className="p-3"
                                                                style={{
                                                                    backgroundColor: "var(--color-surface)",
                                                                    border: "1px solid var(--color-border)",
                                                                    borderRadius: "var(--radius-lg)",
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                  
                                                                    {post.image && (
                                                                        <img
                                                                            src={post.image}
                                                                            alt="Post"
                                                                            className="w-100 rounded-3 mt-2 mb-2"
                                                                            style={{
                                                                                maxHeight: "350px",
                                                                                objectFit: "cover"
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <span className="fw-semibold">
                                                                        {post.user?.displayName || post.user?.username || post.username}
                                                                    </span>
                                                                </div>

                                                                <p
                                                                    className="mb-0"
                                                                    style={{
                                                                        color: "var(--color-text-secondary)",
                                                                        fontSize: "14px",
                                                                    }}
                                                                >
                                                                    {post.text}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )} */}

                                            {showPosts && filteredPosts.length > 0 && (
                                                <section className="mb-4">
                                                    <h6 className="fw-bold mb-3">
                                                        Posts
                                                    </h6>

                                                    <div className="d-flex flex-column gap-3 ">
                                                        {filteredPosts.map((post) => (
                                                            <div
                                                                key={post.id || post._id}
                                                                className="p-3"
                                                                style={{
                                                                    backgroundColor: "var(--color-surface)",
                                                                    border: "1px solid var(--color-border)",
                                                                    borderRadius: "var(--radius-lg)",
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                {/* User Header */}
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    {post.user?.image || post.userImage ? (
                                                                        <img
                                                                            src={post.user?.image || post.userImage}
                                                                            alt="User"
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
                                                                    <div className="flex-grow-1 overflow-hidden">
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <span className="fw-semibold text-truncate">
                                                                                {post.user?.displayName ||
                                                                                    post.user?.username ||
                                                                                    post.username}
                                                                            </span>

                                                                            {post.user?.isPlatformVerified && (
                                                                                <i
                                                                                    className="bi bi-patch-check-fill flex-shrink-0"
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
                                                                            @{post.user?.username || post.username}
                                                                        </small>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="flex-grow-1 overflow-hidden">
                                                                    <div className="d-flex align-items-center gap-1">
                                                                        <span className="fw-semibold text-truncate">
                                                                            {user.displayName || user.username}
                                                                        </span>

                                                                        {user.isPlatformVerified && (
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
                                                                        @{user.username}
                                                                    </small>
                                                                </div> */}

                                                                {/* Post Image */}

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

                                                                {/* Post Text */}
                                                                {post.text && (
                                                                    <p
                                                                        className="mb-0"
                                                                        style={{
                                                                            color: "var(--color-text-secondary)",
                                                                            fontSize: "14px",
                                                                            overflowWrap: "anywhere",
                                                                        }}
                                                                    >
                                                                        {post.text}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}


                                            {/* Topics */}
                                            {/* {showTopics && filteredTrends.length > 0 && (
                                                <section className="mb-4">
                                                    <h6 className="fw-bold mb-3">
                                                        Topics
                                                    </h6>

                                                    <div
                                                        className="p-3"
                                                        style={{
                                                            backgroundColor: "var(--color-surface)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-lg)",
                                                        }}
                                                    >
                                                        {filteredTrends.map((trend) => (
                                                            <div
                                                                key={trend.id}
                                                                className="d-flex justify-content-between align-items-center py-2"
                                                            >
                                                                <div>
                                                                    <div className="fw-semibold">
                                                                        #{trend.name || trend.title}
                                                                    </div>

                                                                    <small
                                                                        style={{
                                                                            color: "var(--color-text-muted)",
                                                                        }}
                                                                    >
                                                                        {trend.posts} posts
                                                                    </small>
                                                                </div>

                                                                <i
                                                                    className="bi bi-arrow-up-right"
                                                                    style={{
                                                                        color: "var(--color-text-muted)",
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )} */}
                                        </>
                                    )}

                                    {/* Mobile Suggestions & Trending */}
                                    <div className="d-lg-none mt-4">
                                        <SuggestedUsers />
                                        <Trending />
                                    </div>

                                </div>
                            </main>

                            {/* Desktop Right Sidebar */}
                            <aside
                                className="d-none d-lg-block col-lg-4 col-xl-4"
                                style={{
                                    height: "100%",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                }}
                            >
                                <div className="py-4 pe-3">
                                    <SuggestedUsers />
                                    <Trending />
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

export default Search;




// import ComingSoon from "../components/commonModule/CommingSoon";

// function Search() {
//     return <ComingSoon title="Search" />;
// }

// export default Search;