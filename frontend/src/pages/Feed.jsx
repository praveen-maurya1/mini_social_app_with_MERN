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

    const fetchPosts = async () => {
        try {
            const response = await API.get("/posts");

            setPosts(response.data);
        } catch (error) {
            console.log(error);
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

        fetchPosts();
    }, []);


    const handleLogout = async () => {
        try {
            setUserlogout(true);
            await API.get("/auth/logout");

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
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

                <button
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
        </div>
    );
}

export default Feed;