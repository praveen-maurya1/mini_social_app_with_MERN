
import React, { useState } from "react";

function ChatList({ conversations, selectedChat, onSelectChat }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredChats = conversations.filter((chat) => {
        const matchesSearch =
            `${chat.name} ${chat.username}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesFilter =
            activeFilter === "All" ||
            (activeFilter === "Unread" && chat.unread > 0) ||
            (activeFilter === "Online" && chat.online);

        return matchesSearch && matchesFilter;
    });

    return (
        <section
            className="d-flex flex-column h-100"
            style={{
                backgroundColor: "var(--color-surface)",
                borderLeft: "1px solid var(--color-border-light)",
            }}
        >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between p-3">
                <h5
                    className="fw-bold mb-0"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    Messages
                </h5>

                <button
                    type="button"
                    className="btn border-0 p-2"
                    style={{
                        color: "var(--color-text-secondary)",
                    }}
                    aria-label="New message"
                >
                    <i className="bi bi-pencil-square fs-5" />
                </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-3">
                <div
                    className="d-flex align-items-center gap-2 px-3"
                    style={{
                        height: "42px",
                        backgroundColor: "var(--color-surface-secondary)",
                        borderRadius: "var(--radius-pill)",
                    }}
                >
                    <i
                        className="bi bi-search"
                        style={{
                            color: "var(--color-text-muted)",
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control border-0 shadow-none p-0"
                        style={{
                            backgroundColor: "transparent",
                            color: "var(--color-text-primary)",
                            fontSize: "13px",
                        }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="d-flex gap-2 px-3 pb-3">
                {["All", "Unread", "Online"].map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className="btn btn-sm px-3"
                        onClick={() => setActiveFilter(filter)}
                        style={{
                            borderRadius: "var(--radius-pill)",
                            backgroundColor:
                                activeFilter === filter
                                    ? "var(--color-primary-light)"
                                    : "var(--color-surface)",
                            color:
                                activeFilter === filter
                                    ? "var(--color-primary)"
                                    : "var(--color-text-secondary)",
                            border:
                                activeFilter === filter
                                    ? "1px solid var(--color-primary-light)"
                                    : "1px solid var(--color-border)",
                            fontWeight: activeFilter === filter ? 600 : 400,
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Conversation List */}
            <div
                className="flex-grow-1 overflow-auto mr-5"
            >
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => {
                        const isSelected = selectedChat?.id === chat.id;

                        return (
                            <button
                                key={chat.id}
                                type="button"
                                onClick={() => onSelectChat(chat)}
                                className="btn w-100 border-0 rounded-0 text-start px-3 py-3"
                                style={{
                                    backgroundColor: isSelected
                                        ? "var(--color-primary-light)"
                                        : "transparent",
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    {/* Avatar */}
                                    <div className="position-relative flex-shrink-0">
                                        <img
                                            src={chat.avatar}
                                            alt={chat.name}
                                            width="48"
                                            height="48"
                                            className="rounded-circle"
                                            style={{ objectFit: "cover" }}
                                        />

                                        {chat.online && (
                                            <span
                                                className="position-absolute bottom-0 end-0 rounded-circle"
                                                style={{
                                                    width: "11px",
                                                    height: "11px",
                                                    backgroundColor: "var(--color-success)",
                                                    border: "2px solid var(--color-surface)",
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Conversation Details */}
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex align-items-center justify-content-between gap-2">
                                            <span
                                                className="fw-semibold text-truncate"
                                                style={{
                                                    color: "var(--color-text-primary)",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {chat.name}
                                            </span>

                                            <small
                                                className="flex-shrink-0"
                                                style={{
                                                    color: "var(--color-text-muted)",
                                                    fontSize: "11px",
                                                }}
                                            >
                                                {chat.time}
                                            </small>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
                                            <span
                                                className="text-truncate"
                                                style={{
                                                    color: "var(--color-text-muted)",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {chat.lastMessage}
                                            </span>

                                            {chat.unread > 0 && (
                                                <span
                                                    className="badge rounded-pill"
                                                    style={{
                                                        backgroundColor: "var(--color-primary)",
                                                        color: "var(--color-white)",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {chat.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div
                        className="text-center py-5 px-3"
                        style={{
                            color: "var(--color-text-muted)",
                        }}
                    >
                        <i className="bi bi-chat-dots fs-2" />
                        <p className="mt-2 mb-0 small">
                            No conversations found.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ChatList;
