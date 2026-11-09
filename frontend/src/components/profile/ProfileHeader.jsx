
import React, { useState } from "react";
import currentUser from "../../data/currentUser";

function ProfileHeader() {
    const [showPhoto, setShowPhoto] = useState(false);

    return (
        <>
            <section className="px-3 px-md-4 pt-4">
                <div className="row align-items-center g-3">

                    {/* Profile Picture */}
                    <div className="col-4 col-md-4 d-flex justify-content-center">
                        <button
                            type="button"
                            onClick={() => setShowPhoto(true)}
                            className="btn border-0 p-0 rounded-circle"
                            aria-label="View profile photo"
                        >
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="rounded-circle"
                                style={{
                                    width: "clamp(76px, 12vw, 150px)",
                                    height: "clamp(76px, 12vw, 150px)",
                                    objectFit: "cover",
                                }}
                            />
                        </button>
                    </div>

                    {/* Profile Information */}
                    <div className="col-8 col-md-8">

                        {/* Username */}
                        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                            <h5
                                className="mb-0 fw-normal"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {currentUser.username}
                            </h5>

                            <button
                                type="button"
                                className="btn border-0 p-1"
                                style={{
                                    color: "var(--color-text-primary)",
                                }}
                                aria-label="Profile settings"
                            >
                                <i className="bi bi-gear-wide-connected fs-5" />
                            </button>
                        </div>

                        {/* Statistics */}
                        <div className="d-flex align-items-center gap-3 gap-md-5 mb-3">
                            <div className="text-center text-md-start">
                                <strong>{currentUser.posts}</strong>
                                <span className="d-none d-md-inline ms-1">
                                    posts
                                </span>
                            </div>

                            <div className="text-center text-md-start">
                                <strong>{currentUser.followers}</strong>
                                <span className="d-none d-md-inline ms-1">
                                    followers
                                </span>
                            </div>

                            <div className="text-center text-md-start">
                                <strong>{currentUser.following}</strong>
                                <span className="d-none d-md-inline ms-1">
                                    following
                                </span>
                            </div>
                        </div>

                        {/* Name and Bio */}
                        <div className="d-none d-md-block">
                            <div className="fw-semibold">
                                {currentUser.name}
                            </div>

                            <div
                                className="mt-1"
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontSize: "14px",
                                }}
                            >
                                {currentUser.bio}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Name and Bio */}
                <div className="d-md-none mt-3">
                    <div className="fw-semibold">
                        {currentUser.name}
                    </div>

                    <div
                        className="mt-1"
                        style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "14px",
                        }}
                    >
                        {currentUser.bio}
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="d-flex gap-2 mt-3">
                    <button
                        type="button"
                        className="btn btn-sm flex-grow-1 fw-semibold"
                        style={{
                            backgroundColor: "var(--color-primary-light)",
                            color: "var(--color-primary)",
                            borderRadius: "var(--radius-md)",
                        }}
                    >
                        Edit Profile
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm flex-grow-1 fw-semibold"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            borderRadius: "var(--radius-md)",
                        }}
                    >
                        Share Profile
                    </button>
                </div>
            </section>

            {/* Profile Photo Dialog */}
            {showPhoto && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    onClick={() => setShowPhoto(false)}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        zIndex: 2000,
                    }}
                >
                    <button
                        type="button"
                        className="btn position-absolute top-0 end-0 m-3 border-0"
                        onClick={() => setShowPhoto(false)}
                        aria-label="Close profile photo"
                        style={{
                            color: "var(--color-white)",
                        }}
                    >
                        <i className="bi bi-x-lg fs-3" />
                    </button>

                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-circle"
                        style={{
                            width: "min(80vw, 420px)",
                            height: "min(80vw, 420px)",
                            objectFit: "cover",
                            boxShadow: "var(--shadow-lg)",
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ProfileHeader;
