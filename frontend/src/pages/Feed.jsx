import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [userlogout, setUserlogout] = useState(false);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const fetchPosts = async (
        pageNumber = 1
    ) => {

        if (loadingPosts) return;

        try {

            setLoadingPosts(true);

            const response = await API.get(
                `/posts?page=${pageNumber}`
            );

            if (pageNumber === 1) {

                setPosts(
                    response.data.posts
                );

            } else {

                setPosts(prev => [
                    ...prev,
                    ...response.data.posts
                ]);

            }

            setHasMore(
                response.data.hasMore
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoadingPosts(false);

        }
    };

    const fetchMe = async () => {

        try {

            const res = await API.get(
                "auth/get-me"
            );

            setUser(res.data.user);

        } catch (error) {

            console.log(error);

        }

    };
    
    useEffect(() => {

        fetchMe();

        fetchPosts(1);

    }, []);

    useEffect(() => {

        const handleScroll = () => {

            const bottom =
                window.innerHeight +
                window.scrollY >=
                document.documentElement.scrollHeight - 200;

            if (
                bottom &&
                hasMore &&
                !loadingPosts
            ) {

                setPage(prev => prev + 1);

            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );

    }, [hasMore, loadingPosts]);

    useEffect(() => {

        if (page > 1) {

            fetchPosts(page);

        }

    }, [page]);


    const handleLogout = async () => {
        try {
            setUserlogout(true);
            await API.get("/auth/logout");

            localStorage.clear();

            navigate("/", {
                replace: true
            });
        } catch (error) {
            console.log(error);
        } finally {
            setUserlogout(false)
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex gap-2 mb-1 align-items-center justify-content-center">
                    <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}>
                        <img src="/favicon.ico" alt="Logo" />
                    </div>
                    <h2 className="text-center mb-2">
                        MySocialMedia
                    </h2>
                </div>
                {/* <button>
                    Chat
                </button> */}
                <button
                    disabled={userlogout}
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    {userlogout ? "Logging out..." : "Logout"}

                </button>
            </div>

            <div>
                <h3 className="fs-4">Welcome - {user?.username}</h3>

            </div>
            <CreatePost fetchPosts={fetchPosts} />

            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    fetchPosts={fetchPosts}
                    setPosts={setPosts}
                />
            ))}
            {loadingPosts && (
                <div className="text-center my-3">
                    Loading posts...
                </div>
            )}
            {!hasMore && posts.length > 0 && (
                <div className="text-center my-3">
                    No More Posts !
                </div>
            )}
        </div>
    );
}

export default Feed;