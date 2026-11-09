
import React, { useMemo, useState } from "react";

const initialNotifications = [
    {
        id: 1,
        title: "New User Registration",
        message: "Rahul Sharma has created a new account on Caché.",
        category: "users",
        icon: "bi-person-plus",
        time: "2 minutes ago",
        date: "Nov 08, 2026",
        read: false,
        details: "A new user has successfully registered on the platform.",
    },
    {
        id: 2,
        title: "New Content Report",
        message: "A post has received 8 reports for Spam.",
        category: "reports",
        icon: "bi-flag",
        time: "15 minutes ago",
        date: "Nov 08, 2026",
        read: false,
        details: "A post has been reported multiple times. Please review it from the Reports Management section.",
    },
    {
        id: 3,
        title: "Content Removed",
        message: "A comment was removed by the moderation team.",
        category: "moderation",
        icon: "bi-shield-check",
        time: "1 hour ago",
        date: "Nov 08, 2026",
        read: false,
        details: "The moderation team removed a comment for violating community guidelines.",
    },
    {
        id: 4,
        title: "System Update",
        message: "Platform maintenance is scheduled for this weekend.",
        category: "system",
        icon: "bi-gear",
        time: "3 hours ago",
        date: "Nov 08, 2026",
        read: true,
        details: "A scheduled system maintenance window has been announced. Review the maintenance settings before the scheduled period.",
    },
    {
        id: 5,
        title: "New User Registration",
        message: "Priya Verma has joined Caché.",
        category: "users",
        icon: "bi-person-plus",
        time: "5 hours ago",
        date: "Nov 08, 2026",
        read: true,
        details: "A new user has successfully registered on the platform.",
    },
    {
        id: 6,
        title: "Multiple Reports Received",
        message: "A comment has received 5 reports for Harassment.",
        category: "reports",
        icon: "bi-exclamation-triangle",
        time: "Yesterday",
        date: "Nov 07, 2026",
        read: true,
        details: "Multiple users have reported a comment for harassment. Check the Reports Management section.",
    },
    {
        id: 7,
        title: "Moderation Review Completed",
        message: "A reported post has been reviewed and restored.",
        category: "moderation",
        icon: "bi-check-circle",
        time: "Yesterday",
        date: "Nov 07, 2026",
        read: true,
        details: "The moderation team reviewed the reported post and found no policy violation. The content has been restored.",
    },
    {
        id: 8,
        title: "Platform Activity",
        message: "Your platform has crossed 12,000 registered users.",
        category: "system",
        icon: "bi-graph-up-arrow",
        time: "2 days ago",
        date: "Nov 06, 2026",
        read: true,
        details: "Caché has crossed an important user growth milestone.",
    },
    {
        id: 9,
        title: "New Content Report",
        message: "A post has been reported for a possible copyright violation.",
        category: "reports",
        icon: "bi-flag",
        time: "3 days ago",
        date: "Nov 05, 2026",
        read: true,
        details: "A user has reported a post for a possible copyright violation. The claim requires review.",
    },
];

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [search, setSearch] = useState("");

    const unreadCount = notifications.filter(n => !n.read).length;
    const readCount = notifications.length - unreadCount;

    const categoryLabels = {
        users: "Users",
        reports: "Reports",
        moderation: "Moderation",
        system: "System",
    };

    const categoryColors = {
        users: "var(--color-primary)",
        reports: "var(--color-danger)",
        moderation: "var(--color-success)",
        system: "var(--color-warning)",
    };

    // Filter notifications
    const filteredNotifications = useMemo(() => {
        return notifications.filter(notification => {
            const query = search.toLowerCase();

            const matchesSearch =
                notification.title.toLowerCase().includes(query) ||
                notification.message.toLowerCase().includes(query);

            const matchesRead =
                activeFilter === "all" ||
                (activeFilter === "unread" && !notification.read) ||
                (activeFilter === "read" && notification.read);

            const matchesCategory =
                activeCategory === "all" ||
                notification.category === activeCategory;

            return matchesSearch && matchesRead && matchesCategory;
        });
    }, [notifications, search, activeFilter, activeCategory]);

    // Mark one notification as read
    const markAsRead = id => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );

        setSelectedNotification(prev =>
            prev?.id === id ? { ...prev, read: true } : prev
        );
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                read: true,
            }))
        );

        setSelectedNotification(prev =>
            prev ? { ...prev, read: true } : prev
        );
    };

    // Delete notification
    const deleteNotification = id => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
        );

        setSelectedNotification(prev =>
            prev?.id === id ? null : prev
        );
    };

    const openNotification = notification => {
        setSelectedNotification(notification);
        markAsRead(notification.id);
    };

    const clearReadNotifications = () => {
        setNotifications(prev => prev.filter(n => !n.read));
        setSelectedNotification(null);
    };

    const resetFilters = () => {
        setSearch("");
        setActiveFilter("all");
        setActiveCategory("all");
    };

    return (
        <div className="container-fluid px-0">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h4 className="fw-bold mb-1"
                        style={{ color: "var(--color-text-primary)" }}>
                        Notifications
                    </h4>
                    <p className="mb-0"
                        style={{ color: "var(--color-text-secondary)" }}>
                        Stay updated with important platform activities.
                    </p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        className="btn"
                        disabled={unreadCount === 0}
                        onClick={markAllAsRead}
                        style={{
                            background: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                        }}>
                        <i className="bi bi-check2-all me-2"></i>
                        Mark All Read
                    </button>

                    <button
                        className="btn btn-outline-danger"
                        disabled={readCount === 0}
                        onClick={clearReadNotifications}>
                        <i className="bi bi-trash me-2"></i>
                        Clear Read
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
                {[
                    {
                        title: "Total Notifications",
                        value: notifications.length,
                        icon: "bi-bell",
                        color: "var(--color-primary)",
                    },
                    {
                        title: "Unread",
                        value: unreadCount,
                        icon: "bi-bell-fill",
                        color: "var(--color-warning)",
                    },
                    {
                        title: "Read",
                        value: readCount,
                        icon: "bi-check-circle",
                        color: "var(--color-success)",
                    },
                ].map((stat, index) => (
                    <div className="col-12 col-sm-6 col-xl-4" key={index}>
                        <div className="card border-0 h-100"
                            style={{
                                background: "var(--color-surface)",
                                boxShadow: "var(--shadow-sm)",
                                borderRadius: "var(--radius-lg)",
                            }}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="small mb-2"
                                        style={{ color: "var(--color-text-secondary)" }}>
                                        {stat.title}
                                    </p>
                                    <h3 className="fw-bold mb-0"
                                        style={{ color: "var(--color-text-primary)" }}>
                                        {stat.value}
                                    </h3>
                                </div>

                                <div className="rounded-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        background: "var(--color-surface-secondary)",
                                        color: stat.color,
                                        fontSize: 22,
                                    }}>
                                    <i className={`bi ${stat.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notification Content */}
            <div className="card border-0"
                style={{
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                    borderRadius: "var(--radius-lg)",
                }}>

                {/* Filters Header */}
                <div className="card-body border-bottom"
                    style={{ borderColor: "var(--color-border)" }}>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                        <div>
                            <h6 className="fw-bold mb-1"
                                style={{ color: "var(--color-text-primary)" }}>
                                All Notifications
                            </h6>
                            <small style={{ color: "var(--color-text-secondary)" }}>
                                {filteredNotifications.length} notifications found
                            </small>
                        </div>

                        <div className="d-flex gap-2">
                            {[
                                { id: "all", label: "All" },
                                { id: "unread", label: "Unread" },
                                { id: "read", label: "Read" },
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    className="btn btn-sm rounded-pill px-3"
                                    onClick={() => setActiveFilter(filter.id)}
                                    style={{
                                        background: activeFilter === filter.id
                                            ? "var(--color-primary)"
                                            : "var(--color-surface-secondary)",
                                        color: activeFilter === filter.id
                                            ? "white"
                                            : "var(--color-text-secondary)",
                                        border: "1px solid var(--color-border)",
                                    }}>
                                    {filter.label}
                                    {filter.id === "unread" && unreadCount > 0 && (
                                        <span className="ms-2">{unreadCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-12 col-lg-7">
                            <div className="input-group">
                                <span className="input-group-text border-end-0"
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-secondary)",
                                    }}>
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search notifications..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-8 col-lg-3">
                            <select
                                className="form-select"
                                value={activeCategory}
                                onChange={e => setActiveCategory(e.target.value)}
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-text-primary)",
                                }}>
                                <option value="all">All Categories</option>
                                <option value="users">Users</option>
                                <option value="reports">Reports</option>
                                <option value="moderation">Moderation</option>
                                <option value="system">System</option>
                            </select>
                        </div>

                        <div className="col-4 col-lg-2">
                            <button
                                className="btn w-100"
                                onClick={resetFilters}
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    border: "1px solid var(--color-border)",
                                }}>
                                <i className="bi bi-arrow-counterclockwise me-1"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification List */}
                <div>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className="d-flex align-items-start gap-3 p-3"
                                style={{
                                    borderBottom: "1px solid var(--color-border)",
                                    background: notification.read
                                        ? "transparent"
                                        : "var(--color-surface-secondary)",
                                }}>

                                {/* Icon */}
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: 44,
                                        height: 44,
                                        background: "var(--color-surface)",
                                        color: categoryColors[notification.category],
                                        fontSize: 19,
                                        border: "1px solid var(--color-border)",
                                    }}>
                                    <i className={`bi ${notification.icon}`}></i>
                                </div>

                                {/* Content */}
                                <div
                                    className="flex-grow-1"
                                    style={{ minWidth: 0, cursor: "pointer" }}
                                    onClick={() => openNotification(notification)}>

                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                        <span className="fw-semibold"
                                            style={{ color: "var(--color-text-primary)" }}>
                                            {notification.title}
                                        </span>

                                        {!notification.read && (
                                            <span
                                                className="rounded-circle"
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    background: "var(--color-primary)",
                                                }}>
                                            </span>
                                        )}
                                    </div>

                                    <p className="small mb-2"
                                        style={{ color: "var(--color-text-secondary)" }}>
                                        {notification.message}
                                    </p>

                                    <div className="d-flex flex-wrap align-items-center gap-2">
                                        <span className="badge rounded-pill"
                                            style={{
                                                background: "var(--color-surface)",
                                                color: categoryColors[notification.category],
                                                border: "1px solid var(--color-border)",
                                            }}>
                                            {categoryLabels[notification.category]}
                                        </span>

                                        <small style={{ color: "var(--color-text-muted)" }}>
                                            <i className="bi bi-clock me-1"></i>
                                            {notification.time}
                                        </small>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="d-flex align-items-center gap-1 flex-shrink-0">
                                    {!notification.read && (
                                        <button
                                            className="btn btn-sm"
                                            title="Mark as read"
                                            onClick={() => markAsRead(notification.id)}
                                            style={{
                                                color: "var(--color-success)",
                                                background: "var(--color-surface)",
                                            }}>
                                            <i className="bi bi-check2"></i>
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm"
                                        title="Delete notification"
                                        onClick={() => deleteNotification(notification.id)}
                                        style={{
                                            color: "var(--color-danger)",
                                            background: "var(--color-surface)",
                                        }}>
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-bell-slash fs-1 d-block mb-3"
                                style={{ color: "var(--color-text-muted)" }}></i>
                            <h6 className="fw-bold"
                                style={{ color: "var(--color-text-primary)" }}>
                                No notifications found
                            </h6>
                            <p className="small mb-0"
                                style={{ color: "var(--color-text-secondary)" }}>
                                There are no notifications matching your filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Details Modal */}
            {selectedNotification && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 2100,
                    }}
                    onClick={() => setSelectedNotification(null)}>

                    <div className="modal-dialog modal-dialog-centered"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0"
                            style={{
                                background: "var(--color-surface)",
                                color: "var(--color-text-primary)",
                                borderRadius: "var(--radius-lg)",
                            }}>

                            <div className="modal-header"
                                style={{ borderColor: "var(--color-border)" }}>
                                <h5 className="modal-title fw-bold">
                                    Notification Details
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedNotification(null)}>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            background: "var(--color-surface-secondary)",
                                            color: categoryColors[selectedNotification.category],
                                            fontSize: 22,
                                        }}>
                                        <i className={`bi ${selectedNotification.icon}`}></i>
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            {selectedNotification.title}
                                        </h6>
                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                            {selectedNotification.time}
                                        </small>
                                    </div>
                                </div>

                                <p style={{ color: "var(--color-text-secondary)" }}>
                                    {selectedNotification.details}
                                </p>

                                <div className="p-3 rounded-3"
                                    style={{ background: "var(--color-surface-secondary)" }}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                            Category
                                        </small>
                                        <span className="small fw-semibold">
                                            {categoryLabels[selectedNotification.category]}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                            Date
                                        </small>
                                        <span className="small fw-semibold">
                                            {selectedNotification.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer"
                                style={{ borderColor: "var(--color-border)" }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedNotification(null)}>
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;
