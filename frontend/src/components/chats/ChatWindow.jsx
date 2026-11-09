
import React, { useState } from "react";

function ChatWindow({ chat, onBack }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(chat.messages || []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "me",
            text: message.trim(),
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    return (
        <div
            className="d-flex flex-column h-100"
            style={{
                backgroundColor: "var(--color-background)",
            }}
        >
            {/* Chat Header */}
            <div
                className="d-flex align-items-center gap-3 px-3"
                style={{
                    height: "72px",
                    flexShrink: 0,
                    backgroundColor: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border-light)",
                }}
            >
                <button
                    type="button"
                    onClick={onBack}
                    className="btn border-0 p-0 d-lg-none"
                    style={{
                        color: "var(--color-text-primary)",
                    }}
                >
                    <i className="bi bi-arrow-left fs-5" />
                </button>

                <img
                    src={chat.avatar}
                    alt={chat.name}
                    width="42"
                    height="42"
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                />

                <div className="flex-grow-1">
                    <div
                        className="fw-semibold"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "14px",
                        }}
                    >
                        {chat.name}
                    </div>

                    <small
                        style={{
                            color: chat.online
                                ? "var(--color-success)"
                                : "var(--color-text-muted)",
                        }}
                    >
                        {chat.online ? "Active now" : "Offline"}
                    </small>
                </div>

                <button
                    type="button"
                    className="btn border-0 p-2"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    <i className="bi bi-three-dots-vertical fs-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow-1 overflow-auto p-3">
                <div className="d-flex flex-column gap-3">
                    {messages.map((msg) => {
                        const isMine = msg.sender === "me";

                        return (
                            <div
                                key={msg.id}
                                className={`d-flex ${isMine ? "justify-content-end" : "justify-content-start"}`}
                            >
                                <div
                                    style={{
                                        maxWidth: "75%",
                                        padding: "10px 14px",
                                        backgroundColor: isMine
                                            ? "var(--color-primary)"
                                            : "var(--color-surface)",
                                        color: isMine
                                            ? "var(--color-white)"
                                            : "var(--color-text-primary)",
                                        borderRadius: "var(--radius-lg)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}
                                >
                                    <div style={{ fontSize: "14px" }}>
                                        {msg.text}
                                    </div>

                                    <div
                                        className="text-end mt-1"
                                        style={{
                                            fontSize: "10px",
                                            opacity: 0.7,
                                        }}
                                    >
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Message Composer */}
            <div
                className="p-3"
                style={{
                    backgroundColor: "var(--color-surface)",
                    borderTop: "1px solid var(--color-border-light)",
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="btn border-0 p-2"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        <i className="bi bi-paperclip fs-5" />
                    </button>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        placeholder="Type a message..."
                        className="form-control border-0 shadow-none"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            borderRadius: "var(--radius-pill)",
                            fontSize: "14px",
                        }}
                    />

                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        className="btn rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "42px",
                            height: "42px",
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                        }}
                    >
                        <i className="bi bi-send-fill" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
