import { useState } from "react";
import API from "../services/api";

function CreatePost({ fetchPosts }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await API.post("/posts", {
                text,
                image,
            });

            setText("");
            setImage("");

            fetchPosts();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="card p-3 mb-4">
            <h4 className="mb-3 ">Let's just do some posts </h4>
            <textarea
                className="form-control mb-3"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) =>
                    setText(e.target.value)
                }
            />

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Image URL"
                value={image}
                onChange={(e) =>
                    setImage(e.target.value)
                }
            />

            <button disabled={!text?.trim() && !image, loading} className="btn btn-primary" onClick={handleSubmit}>
                {loading
                    ? "Posting..."
                    : "Post"}
            </button>

        </div>
    );
}

export default CreatePost;