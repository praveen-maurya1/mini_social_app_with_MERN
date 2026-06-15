import API from "../services/api";
import imageCompression from "browser-image-compression";
import { useRef, useState } from "react";

function CreatePost({ fetchPosts }) {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const compressImage = async (file) => {

        // 800 KB se chhoti image ko compress mat karo

        if (file.size <= 800 * 1024) {

            return file;

        }

        const options = {

            maxSizeMB: 0.8,

            maxWidthOrHeight: 1280,

            initialQuality: 0.7,

            useWebWorker: true

        };

        try {

            const compressedFile =
                await imageCompression(
                    file,
                    options
                );

            console.log(
                "Original:",
                (file.size / 1024).toFixed(0),
                "KB"
            );

            console.log(
                "Compressed:",
                (compressedFile.size / 1024)
                    .toFixed(0),
                "KB"
            );

            return compressedFile;

        } catch (error) {

            console.log(error);

            return file;

        }

    };

    const uploadImage = async () => {

        if (!image) return "";

        const compressedImage =
            await compressImage(image);

        const formData =
            new FormData();

        formData.append(
            "file",
            compressedImage
        );

        formData.append(

            "upload_preset",

            import.meta.env
                .VITE_UPLOAD_PRESET

        );

        const response =
            await fetch(

                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,

                {

                    method: "POST",

                    body: formData

                }

            );

        const data =
            await response.json();

        return data.secure_url;
    };

    const handleSubmit = async () => {

        try {

            setLoading(true);

            let imageUrl = "";

            if (image) {

                imageUrl =
                    await uploadImage();

            }

            await API.post(
                "/posts",
                {
                    text,

                    image:
                        imageUrl,
                }
            );

            setText("");

            setImage(null);
            if (fileInputRef.current) {

                fileInputRef.current.value = "";

            }
            fetchPosts();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) => {

                    const file =
                        e.target.files[0];

                    if (!file) return;

                    if (
                        file.size >
                        5 * 1024 * 1024
                    ) {

                        alert(
                            "Maximum image size is 5 MB"
                        );

                        return;

                    }

                    setImage(file);

                }}
            />

            <button disabled={!text?.trim() && !image, loading} className="btn btn-primary" onClick={handleSubmit}>
                {loading
                    ? "Compressing & Posting..."
                    : "Post"}
            </button>

        </div>
    );
}

export default CreatePost;