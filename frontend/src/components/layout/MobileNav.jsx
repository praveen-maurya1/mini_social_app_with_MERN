import React from "react";
import { NavLink } from "react-router-dom";

function MobileNav() {
    const navItems = [
        {
            label: "Home",
            icon: "bi-house",
            activeIcon: "bi-house-fill",
            path: "/home",
        },
        {
            label: "Search",
            icon: "bi-search",
            activeIcon: "bi-search",
            path: "/search",
        },
        {
            label: "Chats",
            icon: "bi-chat",
            activeIcon: "bi-chat-fill",
            path: "/chats",
        },
        {
            label: "Notifications",
            icon: "bi-bell",
            activeIcon: "bi-bell-fill",
            path: "/notifications",
        },
        {
            label: "Profile",
            icon: "bi-person",
            activeIcon: "bi-person-fill",
            path: "/profile",
        },
    ];

    return (
        <nav
            className="d-lg-none position-fixed bottom-0 start-0 end-0 border-top"
            style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-light)",
                zIndex: 1100,
            }}
        >
            <div className="d-flex align-items-center justify-content-around">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className="text-decoration-none"
                    >
                        {({ isActive }) => (
                            <div
                                className="d-flex flex-column align-items-center justify-content-center px-2 py-2"
                                style={{
                                    minWidth: "52px",
                                    color: isActive
                                        ? "var(--color-primary)"
                                        : "var(--color-text-secondary)",
                                }}
                            >
                                <i
                                    className={`bi ${isActive
                                            ? item.activeIcon
                                            : item.icon
                                        }`}
                                    style={{
                                        fontSize: "19px",
                                    }}
                                />

                                <span
                                    className="mt-1"
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    {item.label}
                                </span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default MobileNav;