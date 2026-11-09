import { React, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../services/api";

function Sidebar({ user }) {
    const [userlogout, setUserlogout] = useState(false);
    const navigate = useNavigate();
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
    const navItems = [
        {
            label: "Home",
            path: "/home",
            icon: "bi-house",
        },
        {
            label: "Search",
            path: "/search",
            icon: "bi-search",
        },
        {
            label: "Chats",
            path: "/chats",
            icon: "bi-chat",
        },
        {
            label: "Notifications",
            path: "/notifications",
            icon: "bi-bell",
        },
        {
            label: "Profile",
            path: "/profile",
            icon: "bi-person",
        },
        {
            label: "Settings",
            path: "/settings",
            icon: "bi-gear",
        },
    ];

    return (
        <aside
            className="d-none d-lg-flex flex-column position-sticky top-0 vh-100 p-4"
            style={{
                width: "260px",
                borderRight: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
            }}
        >
            {/* Brand */}
            <div className="d-flex align-items-center gap-2 mb-5">
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

                <span
                    className="fs-5 fw-bold"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    Caché
                </span>
            </div>

            {/* Navigation */}
            <nav className="d-flex flex-column gap-2 flex-grow-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="text-decoration-none"
                    >
                        {({ isActive }) => (
                            <div
                                className="d-flex align-items-center gap-3 px-3 py-2"
                                style={{
                                    borderRadius: "var(--radius-md)",
                                    backgroundColor: isActive
                                        ? "var(--color-primary-light)"
                                        : "transparent",
                                    color: isActive
                                        ? "var(--color-primary)"
                                        : "var(--color-text-secondary)",
                                    fontWeight: isActive ? 600 : 500,
                                }}
                            >
                                <i className={`bi ${item.icon} fs-5`} />
                                <span>{item.label}</span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Current User */}
            <div
                className="d-flex align-items-center gap-3 p-2 mb-3"
                style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-surface-secondary)",
                }}
            >
                {user?.image?.trim() ? (
                    <img
                        src={user.image}
                        alt={user.username || "User"}
                        className="rounded-circle flex-shrink-0"
                        width="40"
                        height="40"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "var(--color-primary-light)",
                            color: "var(--color-primary)",
                        }}
                    >
                        <i className="bi bi-person-fill fs-5" />
                    </div>
                )}

                <div className="overflow-hidden">
                    <div
                        className="fw-semibold text-truncate"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        {user?.displayName?.trim() || user?.username || "User"}
                    </div>

                    <div
                        className="small text-truncate"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        @{user?.username || "user"}
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                type="button"
                onClick={handleLogout}
                disabled={userlogout}
                className="btn d-flex align-items-center gap-3 text-start px-3 py-2 border-0 w-100"
                style={{
                    color: "var(--color-danger)",
                    backgroundColor: "transparent",
                    borderRadius: "var(--radius-md)",
                    opacity: userlogout ? 0.7 : 1,
                }}
            >
                {userlogout ? (
                    <span className="spinner-border spinner-border-sm" />
                ) : (
                    <i className="bi bi-box-arrow-right fs-5" />
                )}

                <span className="fw-medium">
                    {userlogout ? "Logging out..." : "Logout"}
                </span>
            </button>
        </aside>
    );
}

export default Sidebar;