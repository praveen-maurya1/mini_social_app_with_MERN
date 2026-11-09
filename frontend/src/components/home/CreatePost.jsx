
import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import API from "../../services/api";
import imageCompression from "browser-image-compression";

const emojis = [
    "😀", "😂", "😍", "🥰", "😊", "😎",
    "🥳", "🤩", "❤️", "🔥", "👏", "🙌",
    "👍", "💯", "✨", "🎉", "🌸", "☕",
    "😢", "😡", "🤔", "🙏", "💖", "🚀",
];

const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Image crop failed"));
                        return;
                    }

                    resolve(URL.createObjectURL(blob));
                },
                "image/jpeg",
                0.95
            );
        };

        image.onerror = reject;
    });
};

function CreatePost({ fetchPosts, user }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [text, setText] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [showDialog, setShowDialog] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspectRatio, setAspectRatio] = useState("4:5");
    const [originalAspect, setOriginalAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const aspectOptions = {
        "1:1": 1,
        "4:5": 4 / 5,
        "16:9": 16 / 9,
        Original: originalAspect,
    };
    const compressImage = async (file) => {
        const MAX_SIZE = 800 * 1024;
        const MAX_ATTEMPTS = 5;

        let compressedFile = file;
        let quality = 0.8;
        let maxWidth = 1280;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            compressedFile = await imageCompression(file, {
                maxSizeMB: 0.78,
                maxWidthOrHeight: maxWidth,
                initialQuality: quality,
                useWebWorker: true,
            });

            console.log(
                `Compression attempt ${attempt}:`,
                (compressedFile.size / 1024).toFixed(0),
                "KB"
            );

            if (compressedFile.size < MAX_SIZE) {
                return compressedFile;
            }

            quality = Math.max(0.1, quality - 0.15);
            maxWidth = Math.max(480, maxWidth - 150);
        }

        throw new Error(
            "Image is still larger than 800 KB after 5 attempts. Please select a smaller image."
        );
    };
    // Automatically increase textarea height
    const resizeTextarea = (element) => {
        if (!element) return;

        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
        resizeTextarea(event.target);
    };

    // Add emoji at the end of the text
    const addEmoji = (emoji) => {
        setText((previous) => previous + emoji);
        setShowEmojiPicker(false);

        requestAnimationFrame(() => {
            if (textareaRef.current) {
                resizeTextarea(textareaRef.current);
                textareaRef.current.focus();
            }
        });
    };

    // Select image
    // const handleImageSelect = (event) => {
    //     const file = event.target.files?.[0];

    //     if (!file) return;

    //     if (!file.type.startsWith("image/")) {
    //         alert("Please select a valid image.");
    //         return;
    //     }

    //     if (imageSrc) URL.revokeObjectURL(imageSrc);
    //     if (previewImage) URL.revokeObjectURL(previewImage);

    //     const imageUrl = URL.createObjectURL(file);
    //     const image = new Image();

    //     image.onload = () => {
    //         setOriginalAspect(image.width / image.height);
    //     };

    //     image.src = imageUrl;

    //     setImageSrc(imageUrl);
    //     setPreviewImage(null);

    //     setCrop({ x: 0, y: 0 });
    //     setZoom(1);
    //     setAspectRatio("4:5");

    //     // Photo selected: open composer dialog
    //     setShowDialog(true);
    //     setShowCropper(false);
    //     setShowEmojiPicker(false);

    //     event.target.value = "";
    // };
    const handleImageSelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            event.target.value = "";
            return;
        }

        // Maximum 20 MB
        if (file.size > 20 * 1024 * 1024) {
            alert("Maximum image size is 20 MB.");
            event.target.value = "";
            return;
        }

        if (imageSrc) URL.revokeObjectURL(imageSrc);
        if (previewImage) URL.revokeObjectURL(previewImage);

        const imageUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            setOriginalAspect(image.width / image.height);
        };

        image.src = imageUrl;

        setSelectedImage(file);
        setImageSrc(imageUrl);
        setPreviewImage(null);

        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspectRatio("4:5");

        setShowDialog(true);
        setShowCropper(false);
        setShowEmojiPicker(false);

        event.target.value = "";
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // Open crop editor inside composer dialog
    const openCropEditor = () => {
        setShowCropper(true);
        setShowEmojiPicker(false);
    };

    const applyCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );

            if (previewImage) URL.revokeObjectURL(previewImage);

            setPreviewImage(croppedImage);
            setShowCropper(false);
        } catch (error) {
            console.error("Image cropping failed:", error);
        }
    };

    // Remove image and return to normal composer
    const removeImage = () => {
        if (imageSrc) URL.revokeObjectURL(imageSrc);
        if (previewImage) URL.revokeObjectURL(previewImage);

        setSelectedImage(null);
        setImageSrc(null);
        setPreviewImage(null);

        setShowDialog(false);
        setShowCropper(false);
    };

    // Close dialog but preserve text
    const closeDialog = () => {
        setShowDialog(false);
        setShowCropper(false);
        setShowEmojiPicker(false);
    };

    // Post action placeholder
    // const handlePost = () => {
    //     if (!text.trim() && !previewImage && !imageSrc) return;

    //     // Connect your create-post API here.
    //     console.log({
    //         text,
    //         image: previewImage || imageSrc,
    //     });

    //     setText("");

    //     if (imageSrc) URL.revokeObjectURL(imageSrc);
    //     if (previewImage) URL.revokeObjectURL(previewImage);

    //     setImageSrc(null);
    //     setPreviewImage(null);
    //     setShowDialog(false);
    //     setShowCropper(false);

    //     if (textareaRef.current) {
    //         textareaRef.current.style.height = "auto";
    //     }
    // };

    const handlePost = async () => {
        if ((!text.trim() && !selectedImage) || loading) return;

        try {
            setLoading(true);

            let imageUrl = "";

            // Upload image first
            if (selectedImage) {
                imageUrl = await uploadImage();
            }

            // Create post using backend API
            await API.post("/posts", {
                text: text.trim(),
                image: imageUrl,
            });

            // Reset composer after successful post
            setText("");

            if (imageSrc) URL.revokeObjectURL(imageSrc);
            if (previewImage) URL.revokeObjectURL(previewImage);

            setSelectedImage(null);
            setImageSrc(null);
            setPreviewImage(null);

            setShowDialog(false);
            setShowCropper(false);
            setShowEmojiPicker(false);

            setCrop({ x: 0, y: 0 });
            setZoom(1);

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }

            // Refresh feed
            await fetchPosts?.();

        } catch (error) {
            console.error("Create post error:", error);

            alert(
                error.message ||
                error.response?.data?.message ||
                "Failed to create post."
            );

        } finally {
            setLoading(false);
        }
    };

    // Emoji picker UI
    const EmojiPicker = () => (
        <div
            className="position-absolute p-3"
            style={{
                zIndex: 20,
                bottom: "100%",
                left: 0,
                width: "250px",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
            }}
        >
            <div className="d-flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        className="btn border-0 p-1"
                        onClick={() => addEmoji(emoji)}
                        style={{ fontSize: "21px" }}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
    const getImageFile = async () => {
        if (previewImage) {
            const response = await fetch(previewImage);
            const blob = await response.blob();

            return new File(
                [blob],
                "post-image.jpg",
                { type: blob.type || "image/jpeg" }
            );
        }

        return selectedImage;
    };

    const uploadImage = async () => {
        const imageFile = await getImageFile();

        if (!imageFile) return "";

        const compressedImage = await compressImage(imageFile);

        const formData = new FormData();

        formData.append("file", compressedImage);
        formData.append(
            "upload_preset",
            import.meta.env.VITE_UPLOAD_PRESET
        );

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok || !data.secure_url) {
            throw new Error(
                data.error?.message || "Image upload failed."
            );
        }

        return data.secure_url;
    };

    return (
        <>
            {/* Hidden image input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleImageSelect}
            />

            {/* ================= DESKTOP COMPOSER ================= */}
            <div
                className="d-none d-lg-block p-3 mb-4"
                style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-sm)",
                }}
            >

                <div className="d-flex gap-3">
                    {user?.image && user.image !== "" ? (
                        <img
                            src={user.image}
                            alt={user.username}
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
                            <i className="bi bi-person-fill fs-4" />
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        className="form-control border-0 shadow-none p-2"
                        placeholder="What's on your mind?"
                        rows="2"
                        value={text}
                        onChange={handleTextChange}
                        style={{
                            resize: "none",
                            overflowY: "auto",
                            minHeight: "65px",
                            maxHeight: "500px",
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            borderRadius: "var(--radius-md)",
                        }}
                    />
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm d-flex align-items-center gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            <i className="bi bi-image fs-5" />
                            <span>Photo</span>
                        </button>

                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn btn-sm d-flex align-items-center gap-2"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                style={{ color: "var(--color-text-secondary)" }}
                            >
                                <i className="bi bi-emoji-smile fs-5" />
                                <span>Feeling</span>
                            </button>

                            {showEmojiPicker && <EmojiPicker />}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn px-4"
                        disabled={loading || (!text.trim() && !selectedImage)}
                        onClick={handlePost}
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            borderRadius: "var(--radius-pill)",
                            opacity: text.trim() ? 1 : 0.6,
                        }}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {/* ================= MOBILE COMPOSER ================= */}
            <div
                className="d-lg-none px-3 py-3"
                style={{
                    backgroundColor: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border-light)",
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    {/* <img
                        src={currentUser.avatar}
                        alt={user?.displayName || user?.username || "User"}
                        width="48"
                        height="48"
                        className="rounded-circle flex-shrink-0"
                        style={{ objectFit: "cover" }}
                    /> */}
                    {user?.image && user.image !== "" ? (
                        <img
                            src={user.image}
                            alt={user.username}
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
                            <i className="bi bi-person-fill fs-4" />
                        </div>
                    )}

                    <textarea
                        className="form-control border-0 shadow-none px-3 py-2"
                        placeholder="What's on your mind?"
                        rows="1"
                        value={text}
                        onChange={handleTextChange}
                        style={{
                            resize: "none",
                            overflow: "hidden",
                            minHeight: "48px",
                            maxHeight: "130px",
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            borderRadius: "var(--radius-lg)",
                        }}
                    />

                    <button
                        type="button"
                        className="btn border-0 p-1"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            color: "var(--color-primary)",
                            backgroundColor: "var(--color-primary-light)",
                        }}
                    >
                        <i className="bi bi-image fs-5" />
                    </button>

                    <button
                        type="button"
                        className="btn border-0 p-1"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        style={{
                            color: "var(--color-primary)",
                            backgroundColor: "var(--color-transparent)",
                        }}
                    >
                        <i className="bi bi-emoji-smile fs-5" />
                    </button>
                </div>

                {showEmojiPicker && (
                    <div className="position-relative mt-2">
                        <EmojiPicker />
                    </div>
                )}

                <div className="d-flex justify-content-end mt-2">
                    <button
                        type="button"
                        className="btn btn-sm px-4"
                        disabled={loading || (!text.trim() && !selectedImage)}
                        onClick={handlePost}
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            borderRadius: "var(--radius-pill)",
                            opacity: text.trim() ? 1 : 0.6,
                        }}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>

            {/* ================= CREATE POST DIALOG ================= */}
            {showDialog && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-sm-3"
                    style={{
                        zIndex: 2000,
                        backgroundColor: "rgba(0,0,0,0.65)",
                    }}
                    onClick={closeDialog}
                >
                    <div
                        className="w-100"
                        style={{
                            maxWidth: "560px",
                            maxHeight: "92dvh",
                            backgroundColor: "var(--color-surface)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Dialog Header */}
                        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                            <h5
                                className="mb-0 fw-semibold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                Create Post
                            </h5>

                            <button
                                type="button"
                                className="btn border-0 rounded-circle"
                                onClick={closeDialog}
                                style={{
                                    backgroundColor: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        {showCropper ? (
                            <>
                                {/* Crop editor */}
                                <div className="d-flex justify-content-center flex-wrap gap-2 p-3">
                                    {Object.keys(aspectOptions).map((ratio) => (
                                        <button
                                            key={ratio}
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => setAspectRatio(ratio)}
                                            style={{
                                                color:
                                                    aspectRatio === ratio
                                                        ? "var(--color-white)"
                                                        : "var(--color-text-secondary)",
                                                backgroundColor:
                                                    aspectRatio === ratio
                                                        ? "var(--color-primary)"
                                                        : "var(--color-surface-secondary)",
                                                borderRadius: "var(--radius-pill)",
                                            }}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>

                                <div
                                    className="position-relative"
                                    style={{
                                        height: "min(45vh, 380px)",
                                        backgroundColor: "var(--color-black)",
                                    }}
                                >
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspectOptions[aspectRatio]}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                        restrictPosition
                                        showGrid
                                    />
                                </div>

                                <div className="px-4 pt-3">
                                    <div className="d-flex justify-content-between">
                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                            Adjust Zoom
                                        </small>
                                        <small style={{ color: "var(--color-text-muted)" }}>
                                            {zoom.toFixed(1)}x
                                        </small>
                                    </div>

                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(event) =>
                                            setZoom(Number(event.target.value))
                                        }
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2 p-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        onClick={() => setShowCropper(false)}
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm px-4"
                                        onClick={applyCrop}
                                        style={{
                                            color: "var(--color-white)",
                                            backgroundColor: "var(--color-primary)",
                                            borderRadius: "var(--radius-pill)",
                                        }}
                                    >
                                        Apply Crop
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* User info */}
                                <div className="d-flex align-items-center gap-2 px-3 pt-3">
                                    {/* <img
                                        src={currentUser.avatar}
                                        alt={user?.displayName || user?.username || "User"}
                                        width="42"
                                        height="42"
                                        className="rounded-circle"
                                        style={{ objectFit: "cover" }}
                                    /> */}
                                    {user?.image && user.image !== "" ? (
                                        <img
                                            src={user.image}
                                            alt={user.username}
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
                                            <i className="bi bi-person-fill fs-4" />
                                        </div>
                                    )}

                                    <div>
                                        <div
                                            className="fw-semibold"
                                            style={{ color: "var(--color-text-primary)" }}
                                        >
                                            {user?.displayName || user?.username || "User"}
                                        </div>
                                        <small style={{ color: "var(--color-text-muted)" }}>
                                            Posting to everyone
                                        </small>
                                    </div>
                                </div>

                                {/* Text and image preview */}
                                <div className="p-3 overflow-auto">
                                    <div className="d-flex gap-2 align-items-start">
                                        <textarea
                                            className="form-control border-0 shadow-none p-0"
                                            placeholder="What's on your mind?"
                                            value={text}
                                            onChange={handleTextChange}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                minHeight: "110px",
                                                resize: "none",
                                                backgroundColor: "transparent",
                                                color: "var(--color-text-primary)",
                                            }}
                                        />

                                        {/* Image thumbnail in upper corner */}
                                        <div
                                            className="position-relative flex-shrink-0"
                                            style={{ width: "115px" }}
                                        >
                                            <img
                                                src={previewImage || imageSrc}
                                                alt="Post preview"
                                                className="w-100"
                                                style={{
                                                    height: "115px",
                                                    objectFit: "cover",
                                                    borderRadius: "var(--radius-md)",
                                                }}
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-sm position-absolute top-0 end-0 m-1 p-1 rounded-circle"
                                                onClick={removeImage}
                                                style={{
                                                    width: "26px",
                                                    height: "26px",
                                                    backgroundColor: "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                    lineHeight: 1,
                                                }}
                                                title="Remove image"
                                            >
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-sm mt-2"
                                        onClick={openCropEditor}
                                        style={{
                                            color: "var(--color-primary)",
                                            backgroundColor: "var(--color-primary-light)",
                                        }}
                                    >
                                        <i className="bi bi-crop me-1" />
                                        Edit / Crop Photo
                                    </button>
                                </div>

                                {/* Add to post */}
                                <div
                                    className="mx-3 p-3 d-flex align-items-center justify-content-between"
                                    style={{
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius-md)",
                                    }}
                                >
                                    <span
                                        className="small fw-semibold"
                                        style={{ color: "var(--color-text-primary)" }}
                                    >
                                        Add to your post
                                    </span>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn border-0"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Add photo"
                                            style={{ color: "var(--color-success)" }}
                                        >
                                            <i className="bi bi-image fs-5" />
                                        </button>

                                        <button
                                            type="button"
                                            className="btn border-0"
                                            onClick={() =>
                                                setShowEmojiPicker(!showEmojiPicker)
                                            }
                                            title="Add emoji"
                                            style={{ color: "var(--color-warning)" }}
                                        >
                                            <i className="bi bi-emoji-smile fs-5" />
                                        </button>
                                    </div>
                                </div>

                                {showEmojiPicker && (
                                    <div className="position-relative mx-3 mt-2">
                                        <EmojiPicker />
                                    </div>
                                )}

                                {/* Post button */}
                                <div className="p-3 mt-3">
                                    <button
                                        type="button"
                                        className="btn w-100"
                                        onClick={handlePost}
                                        disabled={loading || (!text.trim() && !selectedImage)}
                                        style={{
                                            backgroundColor: "var(--color-primary)",
                                            color: "var(--color-white)",
                                            borderRadius: "var(--radius-md)",
                                            opacity:
                                                text.trim() || previewImage || imageSrc
                                                    ? 1
                                                    : 0.6,
                                        }}
                                    >
                                        {loading ? "Uploading & Posting..." : "Post"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default CreatePost;
