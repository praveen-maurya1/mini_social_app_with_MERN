import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import API from "../../services/api";

function Topbar({ user }) {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);
    const { activeMode, setMode } = useTheme();

    const profileImage = user?.image?.trim();
    const displayName =
        user?.displayName?.trim() || user?.username || "User";
    const [userlogout, setUserlogout] = useState(false);
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
            setUserlogout(false);
        }
    };


    const toggleTheme = () => {
        setMode(activeMode === "dark" ? "light" : "dark");
    };
    // Close menu when clicking outside
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (
    //             profileMenuRef.current &&
    //             !profileMenuRef.current.contains(event.target)
    //         ) {
    //             setShowProfileMenu(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);
    return (
        <header
            style={{
                backgroundColor: "var(--color-surface)",
                borderBottom: "1px solid var(--color-border-light)",
                flexShrink: 0,
                zIndex: 1000,
            }}
        >
            {/* ================= DESKTOP TOPBAR ================= */}
            <div
                className="d-none d-lg-flex align-items-center justify-content-between px-4"
                style={{
                    height: "72px",
                }}
            >
                {/* Search */}
                <div
                    className="d-flex align-items-center gap-3 px-3"
                    style={{
                        width: "480px",
                        height: "40px",
                        borderRadius: "var(--radius-pill)",
                        backgroundColor:
                            "var(--color-surface-secondary)",
                    }}
                >
                    <i
                        className="bi bi-search"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "16px",
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Search people, posts..."
                        className="form-control border-0 shadow-none p-0"
                        style={{
                            backgroundColor: "transparent",
                            color: "var(--color-text-primary)",
                            fontSize: "16px",
                            fontFamily: "inherit",
                        }}
                    />
                </div>

                {/* Desktop Actions */}
                <div className="d-flex align-items-center gap-4">
                    <button
                        type="button"
                        className="btn border-0 p-0"
                        onClick={toggleTheme}
                        title={activeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        aria-label="Toggle theme"
                        style={{
                            color: "var(--color-text-primary)",
                            backgroundColor: "transparent",
                        }}
                    >
                        <i
                            className={`bi ${activeMode === "dark" ? "bi-moon-stars-fill" : "bi-sun"
                                } fs-5`}
                        />
                    </button>

                    <button
                        type="button"
                        className="btn border-0 p-0 position-relative"
                        onClick={() => navigate("/notifications")}
                        style={{
                            color: "var(--color-text-primary)",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        <i className="bi bi-bell fs-5" />

                        <span
                            className="position-absolute"
                            style={{
                                width: "7px",
                                height: "7px",
                                top: "0",
                                right: "0",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-danger)",
                                border:
                                    "1px solid var(--color-surface)",
                            }}
                        />
                    </button>


                    <div
                        className="position-relative"
                        ref={profileMenuRef}
                    >
                        <button
                            type="button"
                            className="btn border-0 p-0 rounded-circle"
                            onClick={() => setShowProfileMenu((prev) => !prev)}
                            style={{
                                backgroundColor: "transparent",
                            }}
                        >

                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={displayName}
                                    width="44"
                                    height="44"
                                    className="rounded-circle"
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
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
                        </button>

                        {showProfileMenu && (
                            <div
                                className="position-absolute end-0 mt-2 p-2"
                                style={{
                                    width: "230px",
                                    backgroundColor: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-lg)",
                                    boxShadow: "var(--shadow-lg)",
                                    zIndex: 1500,
                                }}
                            >
                                {/* User Info */}
                                <div className="d-flex align-items-center gap-2 p-2 overflow-hidden">
                                    {/* User Avatar */}
                                    {user?.image?.trim() ? (
                                        <img
                                            src={user.image}
                                            alt={user.username || "User"}
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

                                    {/* User Details */}
                                    <div className="overflow-hidden">
                                        <div
                                            className="fw-semibold text-truncate"
                                            style={{
                                                color: "var(--color-text-primary)",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {displayName}
                                        </div>

                                        <small
                                            className="text-truncate d-block"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            @{user?.username || "user"}
                                        </small>
                                    </div>
                                </div>

                                <hr
                                    className="my-2"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                />

                                {/* Settings */}
                                <button
                                    type="button"
                                    className="btn w-100 border-0 d-flex align-items-center gap-3 text-start py-2"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate("/settings");
                                    }}
                                    style={{
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    <i className="bi bi-gear fs-5" />
                                    <span>Settings</span>
                                </button>

                                {/* Logout */}
                                <button
                                    type="button"
                                    className="btn w-100 border-0 d-flex align-items-center gap-3 text-start py-2"
                                    onClick={() => {
                                        handleLogout();
                                        // setShowProfileMenu(false);
                                    }}
                                    disabled={userlogout}
                                    style={{
                                        color: "var(--color-danger)",
                                        opacity: userlogout ? 0.7 : 1,
                                    }}
                                >
                                    {userlogout ? (
                                        <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                        <i className="bi bi-box-arrow-right fs-5" />
                                    )}

                                    <span>
                                        {userlogout ? "Logging out..." : "Logout"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= MOBILE TOPBAR ================= */}
            <div
                className="d-flex d-lg-none align-items-center justify-content-between px-4"
                style={{
                    height: "80px",
                }}
            >
                {/* Caché Logo */}

                <div className="d-flex align-items-center gap-2">
                    <div
                        className="d-flex align-items-center justify-content-center fw-bold"
                        style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                        }}
                    >
                        C
                    </div>
                    <div
                        className="fw-bold"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "28px",
                            letterSpacing: "-1px",
                        }}
                    >
                        Caché
                    </div>
                </div>
                {/* Mobile Actions */}
                <div className="d-flex align-items-center gap-4">
                    {/* Search */}
                    <button
                        type="button"
                        className="btn border-0 p-0"
                        style={{
                            color: "var(--color-text-primary)",
                            backgroundColor: "transparent",
                        }}
                    >
                        <i
                            className="bi bi-search"
                            style={{ fontSize: "22px" }}
                        />
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        className="btn border-0 p-0 position-relative"
                        onClick={() => navigate("/notifications")}
                        style={{
                            color: "var(--color-text-primary)",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        <i
                            className="bi bi-bell"
                            style={{ fontSize: "22px" }}
                        />

                        <span
                            className="position-absolute"
                            style={{
                                width: "8px",
                                height: "8px",
                                top: "0",
                                right: "-1px",
                                borderRadius: "50%",
                                backgroundColor:
                                    "var(--color-danger)",
                                border:
                                    "1px solid var(--color-surface)",
                            }}
                        />
                    </button>

                    {/* Avatar */}

                    <div
                        className="position-relative"
                        ref={profileMenuRef}
                    >
                        <button
                            type="button"
                            className="btn border-0 p-0 rounded-circle"
                            onClick={() => setShowProfileMenu((prev) => !prev)}
                            style={{
                                backgroundColor: "transparent",
                            }}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={displayName}
                                    width="44"
                                    height="44"
                                    className="rounded-circle"
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
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

                        </button>

                        {showProfileMenu && (
                            <div
                                className="position-absolute end-0 mt-2 p-2"
                                style={{
                                    width: "230px",
                                    backgroundColor: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-lg)",
                                    boxShadow: "var(--shadow-lg)",
                                    zIndex: 1500,
                                }}
                            >
                                {/* User Info */}
                                <div className="d-flex align-items-center gap-2 p-2 overflow-hidden">
                                    {/* User Avatar */}
                                    {user?.image?.trim() ? (
                                        <img
                                            src={user.image}
                                            alt={user?.username || "User"}
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

                                    {/* User Details */}
                                    <div className="overflow-hidden">
                                        <div
                                            className="fw-semibold text-truncate"
                                            style={{
                                                color: "var(--color-text-primary)",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {displayName}
                                        </div>

                                        <small
                                            className="d-block text-truncate"
                                            style={{ color: "var(--color-text-muted)" }}
                                        >
                                            @{user?.username || "user"}
                                        </small>
                                    </div>
                                </div>

                                <hr
                                    className="my-2"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                />

                                {/* Settings */}
                                <button
                                    type="button"
                                    className="btn w-100 border-0 d-flex align-items-center gap-3 text-start py-2"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate("/settings");
                                    }}
                                    style={{
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    <i className="bi bi-gear fs-5" />
                                    <span>Settings</span>
                                </button>

                                {/* Logout */}
                                <button
                                    type="button"
                                    disabled={userlogout}
                                    className="btn w-100 border-0 d-flex align-items-center gap-3 text-start py-2"
                                    onClick={() => {
                                        handleLogout();
                                        // Yahan apna existing logout logic call karna
                                    }}
                                    style={{
                                        color: "var(--color-danger)",
                                    }}
                                >
                                    <i className="bi bi-box-arrow-right fs-5" />
                                    <span>
                                        {userlogout ? "Logging out..." : "Logout"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;