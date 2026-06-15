import { useState } from "react";
import API from "../services/api";

function PostCard({
    post,
    fetchPosts,
    setPosts
}) {

    const [comment, setComment] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [visibleComments,
        setVisibleComments] =
        useState(1);

    const [liking, setLiking] =
        useState(false);

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const currentUserId =
        currentUser?._id;

    const liked =
        currentUser &&
        post.likes.some(
            like =>
                like.userId?.toString()
                === currentUserId
        );



    // LIKE

    const handleLike = async () => {

        if (liking) return;

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) return;

        setLiking(true);

        const userId = user._id;

        setPosts(prevPosts =>
            prevPosts.map(p => {

                if (
                    p._id !== post._id
                ) return p;

                const alreadyLiked =
                    p.likes.some(
                        like =>
                            like.userId
                                ?.toString()
                            === userId
                    );

                return {
                    ...p,
                    likes: alreadyLiked
                        ? p.likes.filter(
                            like =>
                                like.userId
                                    ?.toString()
                                !== userId
                        )
                        : [...p.likes,
                        {
                            userId,
                            username:
                                user.username

                        }

                        ]

                };

            })
        );

        try {

            await API.put(
                `/posts/${post._id}/like`
            );

        } catch (error) {

            console.log(error);

            fetchPosts(1);

        } finally {

            setLiking(false);

        }
    };



    // COMMENT

    const handleComment =
        async () => {

            if (
                !comment.trim()
            ) return;

            const currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                );

            if (!currentUser)
                return;

            const newComment = {

                username:
                    currentUser.username,

                text: comment

            };

            setPosts(prevPosts =>

                prevPosts.map(p =>

                    p._id === post._id
                        ? {
                            ...p,
                            comments: [
                                ...p.comments,
                                newComment
                            ]
                        }
                        : p
                )
            );

            const commentText =
                comment;

            setComment("");

            setVisibleComments(
                prev =>
                    Math.max(
                        prev,
                        10
                    )
            );

            try {

                setLoading(true);

                await API.post(

                    `/posts/${post._id}/comment`,

                    {

                        text:
                            commentText

                    }

                );

            } catch (error) {

                console.log(error);

                fetchPosts(1);

            } finally {

                setLoading(false);

            }

        };



    return (

        <div className="card mb-3 p-3 shadow-sm">
            <h5>
                {post.username}
            </h5>
            {post.text && (
                <p>
                    {post.text}
                </p>
            )}
            {post.image && (
                <img
                    src={post.image}
                    alt="post"
                    className="img-fluid rounded mb-3"
                />
            )}
            <div className="d-flex gap-2 mb-3"            >
                <button
                    disabled={liking}
                    className={`btn btn-sm ${liked
                        ? "btn-danger"
                        : "btn-outline-danger"
                        }`}
                    onClick={handleLike}>

                    {liked
                        ? "❤️"
                        : "🤍"}

                    {" "}

                    {post.likes.length}

                </button>



                <button className="btn btn-outline-secondary btn-sm"                >
                    💬

                    {" "}

                    {post.comments.length}

                </button>

            </div>



            <div
                className="d-flex gap-2 mb-3"
            >

                <input

                    type="text"

                    className="form-control"

                    placeholder="Write a comment..."

                    value={comment}

                    onChange={(e) =>

                        setComment(
                            e.target.value
                        )

                    }

                />



                <button

                    disabled={
                        !comment.trim()
                        || loading
                    }

                    className="btn btn-primary"

                    onClick={
                        handleComment
                    }

                >

                    {loading

                        ? "Adding..."

                        : "Add"}

                </button>

            </div>



            {post.comments

                .slice(
                    0,
                    visibleComments
                )

                .map(
                    (
                        comment,
                        index
                    ) => (

                        <div

                            key={index}

                            className="border-top pt-2 mt-2"

                        >

                            <strong>

                                {
                                    comment.username
                                }

                            </strong>

                            <p
                                className="mb-1"
                            >

                                {
                                    comment.text
                                }

                            </p>

                            {post.comments.length >

                                visibleComments && (

                                    <button

                                        className="btn btn-link p-0 mt-2"

                                        onClick={() =>

                                            setVisibleComments(

                                                prev =>

                                                    prev + 10

                                            )

                                        }

                                    >

                                        View more comments

                                    </button>

                                )}
                        </div>

                    )
                )}
        </div>

    );
}

export default PostCard;