import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Feed() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const response = await API.get("/posts");

            setPosts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const handleLogout = async () => {
        try {
            await API.get("/auth/logout");

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2 mb-3 align-items-center justify-content-center">
                    <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}><img src="/favicon.ico" alt="Logo" /></div>
                    <h2 className="text-center mb-2">
                        MySocialMedia
                    </h2>
                </div>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>


            <CreatePost fetchPosts={fetchPosts} />

            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    fetchPosts={fetchPosts}
                />
            ))}
        </div>
    );
}

export default Feed;