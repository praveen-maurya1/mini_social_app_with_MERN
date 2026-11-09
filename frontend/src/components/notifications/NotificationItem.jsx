
import React from "react";

function NotificationItem({ notification, onRead }) {
    const iconMap = {
        like: {
            icon: "bi-heart-fill",
            color: "var(--color-like)",
        },
        comment: {
            icon: "bi-chat-fill",
            color: "var(--color-comment)",
        },
        follow: {
            icon: "bi-person-plus-fill",
            color: "var(--color-success)",
        },
        mention: {
            icon: "bi-at",
            color: "var(--color-info)",
        },
    };

    const config = iconMap[notification.type] || iconMap.like;

    return (
        <button
            type="button"
            onClick={() => onRead(notification.id)}
            className="btn w-100 border-0 rounded-0 text-start p-3"
            style={{
                backgroundColor: notification.read
                    ? "var(--color-surface)"
                    : "var(--color-primary-light)",
            }}
        >
            <div className="d-flex align-items-center gap-3">
                {/* Avatar and Notification Icon */}
                <div className="position-relative flex-shrink-0">
                    <img
                        src={notification.avatar}
                        alt={notification.name}
                        width="48"
                        height="48"
                        className="rounded-circle"
                        style={{ objectFit: "cover" }}
                    />

                    <span
                        className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "21px",
                            height: "21px",
                            backgroundColor: "var(--color-surface)",
                            color: config.color,
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <i
                            className={`bi ${config.icon}`}
                            style={{ fontSize: "11px" }}
                        />
                    </span>
                </div>

                {/* Notification Details */}
                <div className="flex-grow-1 overflow-hidden">
                    <div
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "14px",
                            lineHeight: "1.5",
                        }}
                    >
                        <strong>{notification.name}</strong>{" "}
                        {notification.message}
                    </div>

                    <small
                        style={{
                            color: "var(--color-text-muted)",
                            fontSize: "12px",
                        }}
                    >
                        {notification.time}
                    </small>
                </div>

                {/* Unread Indicator */}
                {!notification.read && (
                    <span
                        className="rounded-circle flex-shrink-0"
                        style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "var(--color-primary)",
                        }}
                    />
                )}
            </div>
        </button>
    );
}

export default NotificationItem;
