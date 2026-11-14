import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useLayoutEffect
} from "react";
import {
    savePendingMessage,
    getPendingMessages,
    updatePendingMessage,
    flushMessageOutbox
} from "../../services/messageOutbox";
import API from "../../services/api";

function ChatWindow({ chat, user, socket, onBack }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [sending, setSending] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [error, setError] = useState("");
    // Typing indicator
    const [isOtherTyping, setIsOtherTyping] = useState(false);

    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const messagesContainerRef = useRef(null);
    const bottomRef = useRef(null);
    const preserveScrollRef = useRef(null);
    const loadingOlderRef = useRef(false);
    const messageInputRef = useRef(null);
    const pendingSendsRef = useRef(0);
    const readInFlightRef = useRef(false);
    const readAgainRef = useRef(false);
    const conversationId = chat?._id;
    // Stop typing indicator
    const stopTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTypingRef.current) {
            socket?.emit("typing:stop", {
                conversationId
            });

            isTypingRef.current = false;
        }
    }, [socket, conversationId]);

    // Handle message input changes
    const handleMessageChange = (value) => {
        setMessage(value);

        if (!conversationId || !socket?.connected) return;

        if (!value.trim()) {
            stopTyping();
            return;
        }

        // Emit typing:start only once
        if (!isTypingRef.current) {
            socket.emit("typing:start", {
                conversationId
            });

            isTypingRef.current = true;
        }

        // Reset inactivity timer
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 2000);
    };
    // Get the logged-in user's ID
    const currentUserId = user?._id || user?.id;

    // Format message time
    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatLastSeen = (date) => {
        if (!date) return "Offline";

        const lastSeenDate = new Date(date);

        if (Number.isNaN(lastSeenDate.getTime())) {
            return "Offline";
        }

        const now = new Date();

        const isToday =
            lastSeenDate.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        const isYesterday =
            lastSeenDate.toDateString() === yesterday.toDateString();

        const time = lastSeenDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (isToday) {
            return `Last seen today at ${time}`;
        }

        if (isYesterday) {
            return `Last seen yesterday at ${time}`;
        }

        const dateText = lastSeenDate.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: lastSeenDate.getFullYear() !== now.getFullYear()
                ? "numeric"
                : undefined,
        });

        return `Last seen ${dateText} at ${time}`;
    };

    // Extract sender ID

    const getSenderId = (sender) => {
        if (!sender) return "";

        // Populated Mongoose document
        if (typeof sender === "object" && sender._id) {
            return sender._id.toString();
        }

        // Object with id property
        if (typeof sender === "object" && sender.id) {
            return sender.id.toString();
        }

        // MongoDB ObjectId or string
        return sender.toString();
    };


    // Normalize API message


    const formatMessage = (msg) => {
        return {
            ...msg,
            id: msg._id || msg.id,
            senderId: getSenderId(msg.sender),
            text: msg.text || "",
            time: formatTime(msg.createdAt || msg.updatedAt),

            status: msg.readAt
                ? "read"
                : msg.deliveredAt
                    ? "delivered"
                    : msg.status || "sent",

            deliveredAt: msg.deliveredAt || null,
            readAt: msg.readAt || null
        };
    };


    const formatPendingMessage = (item) => {
        return {
            ...item,
            id: item.clientMessageId,
            _id: item.clientMessageId,
            clientMessageId: item.clientMessageId,
            senderId: currentUserId.toString(),
            text: item.text,
            time: formatTime(item.createdAt),
            status: item.status === "failed" ? "failed" : "sending"
        };
    };


    // Add message without duplicates
    const addMessage = (newMessage) => {
        const formatted = formatMessage(newMessage);

        setMessages(previous => {
            const existingIndex = previous.findIndex(item =>
                (formatted._id && item._id === formatted._id) ||
                (formatted.clientMessageId &&
                    item.clientMessageId === formatted.clientMessageId)
            );

            if (existingIndex !== -1) {
                return previous.map((item, index) =>
                    index === existingIndex
                        ? { ...item, ...formatted }
                        : item
                );
            }

            return [...previous, formatted];
        });
    };
    // Acknowledge received messages
    const markMessagesRead = useCallback(async () => {
        if (!conversationId) return;

        // Avoid overlapping read requests
        if (readInFlightRef.current) {
            readAgainRef.current = true;
            return;
        }

        readInFlightRef.current = true;

        try {
            const response = await API.patch(
                `/messages/${conversationId}/read`
            );

            const readAt = response.data.readAt;

            if (response.data.messageIds?.length) {
                const readIds = new Set(
                    response.data.messageIds.map(id => id.toString())
                );

                setMessages(previous =>
                    previous.map(msg => {
                        const messageId = (msg._id || msg.id)?.toString();

                        if (!readIds.has(messageId)) return msg;

                        return {
                            ...msg,
                            status: "read",
                            readAt,
                            deliveredAt: msg.deliveredAt || readAt
                        };
                    })
                );
            }

        } catch (error) {
            console.error(
                "Read acknowledgement failed:",
                error.response?.data || error.message
            );

        } finally {
            readInFlightRef.current = false;

            // If another message arrived during the request,
            // run one more acknowledgement.
            if (readAgainRef.current) {
                readAgainRef.current = false;
                markMessagesRead();
            }
        }
    }, [conversationId]);




    // Scroll to bottom
    const scrollToBottom = (behavior = "smooth") => {
        const container = messagesContainerRef.current;

        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior
        });
    };

    // Fetch latest messages
    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;

        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/messages/${conversationId}`,
                {
                    params: {
                        limit: 30
                    }
                }
            );

            const data = response.data;

            const messageList = data.messages || [];

            const formattedMessages = messageList
                .map(formatMessage)
                .reverse();

            // Restore locally saved messages
            const pendingMessages = await getPendingMessages(
                currentUserId.toString(),
                conversationId.toString()
            );

            const formattedPendingMessages = pendingMessages.map(
                formatPendingMessage
            );

            // Merge server messages and local pending messages
            const mergedMessages = [
                ...formattedMessages,
                ...formattedPendingMessages
            ];

            // Remove duplicates using clientMessageId / MongoDB ID
            const uniqueMessages = new Map();

            mergedMessages.forEach(item => {
                const key = item.clientMessageId || item._id || item.id;
                uniqueMessages.set(key.toString(), item);
            });

            // Maintain chronological order
            const finalMessages = [...uniqueMessages.values()].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );

            setMessages(finalMessages);



            // Opening the conversation marks incoming messages as read
            await markMessagesRead();

        
            setHasMore(
                data.pagination?.hasMore ??
                data.hasMore ??
                false
            );

            setNextCursor(
                data.pagination?.nextCursor ??
                data.nextCursor ??
                null
            );

        } catch (err) {
            console.error("Fetch messages error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load messages."
            );
        } finally {
            setLoading(false);
        }
    }, [conversationId, currentUserId, markMessagesRead]);

    // Load messages whenever conversation changes
    useEffect(() => {
        setMessages([]);
        setNextCursor(null);
        setHasMore(false);

        fetchMessages();
    }, [fetchMessages]);

    // Scroll to bottom after initial loading
    useEffect(() => {
        if (!loading) {
            scrollToBottom("auto");
        }
    }, [loading]);

    // Maintain scroll position when older messages are added
    useLayoutEffect(() => {
        if (preserveScrollRef.current && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const previous = preserveScrollRef.current;

            container.scrollTop =
                container.scrollHeight -
                previous.scrollHeight +
                previous.scrollTop;

            preserveScrollRef.current = null;
        }
    }, [messages]);

    // Load older messages
    const loadOlderMessages = async () => {
        if (
            !conversationId ||
            !hasMore ||
            !nextCursor ||
            loadingOlderRef.current
        ) {
            return;
        }

        const container = messagesContainerRef.current;

        if (!container) return;

        loadingOlderRef.current = true;
        setLoadingOlder(true);

        preserveScrollRef.current = {
            scrollHeight: container.scrollHeight,
            scrollTop: container.scrollTop
        };

        try {
            const response = await API.get(
                `/messages/${conversationId}`,
                {
                    params: {
                        limit: 30,
                        cursor: typeof nextCursor === "object"
                            ? JSON.stringify(nextCursor)
                            : nextCursor
                    }
                }
            );

            const data = response.data;
            // const olderMessages = (data.messages || []).map(formatMessage);
            const olderMessages = (data.messages || [])
                .map(formatMessage)
                .reverse();

            setMessages((previous) => {
                const existingIds = new Set(
                    previous.map((item) => item._id || item.id)
                );

                const uniqueOlder = olderMessages.filter(
                    (item) => !existingIds.has(item._id || item.id)
                );

                return [...uniqueOlder, ...previous];
            });

            setHasMore(
                data.pagination?.hasMore ??
                data.hasMore ??
                false
            );

            setNextCursor(
                data.pagination?.nextCursor ??
                data.nextCursor ??
                null
            );

        } catch (err) {
            console.error("Load older messages error:", err);
            preserveScrollRef.current = null;

            setError(
                err.response?.data?.message ||
                "Unable to load older messages."
            );
        } finally {
            loadingOlderRef.current = false;
            setLoadingOlder(false);
        }
    };

    // Detect scroll near the top
    const handleMessagesScroll = () => {
        const container = messagesContainerRef.current;

        if (!container) return;

        if (
            container.scrollTop <= 50 &&
            hasMore &&
            !loadingOlderRef.current
        ) {
            loadOlderMessages();
        }
    };

    // Listen for incoming real-time messages
    useEffect(() => {
        if (!socket || !conversationId) return;


        const handleNewMessage = (data) => {
            if (
                data.conversationId?.toString() !==
                conversationId.toString()
            ) {
                return;
            }

            if (!data.message) return;

            addMessage(data.message);

            // This ChatWindow is open, so mark incoming message as read
            if (
                getSenderId(data.message.sender) !== currentUserId?.toString()
            ) {
                markMessagesRead();
            }

            setTimeout(() => scrollToBottom(), 100);
        };
        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [socket, currentUserId, conversationId, markMessagesRead]);

    // Listen for typing events
    useEffect(() => {
        if (!socket || !conversationId) return;

        const handleTypingStart = (data) => {
            if (
                data.conversationId?.toString() !==
                conversationId.toString()
            ) {
                return;
            }

            if (data.userId?.toString() === currentUserId?.toString()) {
                return;
            }

            setIsOtherTyping(true);
        };

        const handleTypingStop = (data) => {
            if (
                data.conversationId?.toString() !==
                conversationId.toString()
            ) {
                return;
            }

            if (data.userId?.toString() === currentUserId?.toString()) {
                return;
            }

            setIsOtherTyping(false);
        };

        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);

        return () => {
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);

            setIsOtherTyping(false);
        };
    }, [socket, conversationId, currentUserId]);


    // Cleanup typing timer and notify server
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            if (isTypingRef.current) {
                socket?.emit("typing:stop", {
                    conversationId
                });

                isTypingRef.current = false;
            }
        };
    }, [socket, conversationId]);

    useEffect(() => {

        const handleOutboxSent = (event) => {
            const { clientMessageId, message: savedMessage } = event.detail || {};

            if (!clientMessageId || !savedMessage) return;

            const formatted = formatMessage(savedMessage);

            setMessages(previous => {
                const existingIndex = previous.findIndex(item =>
                    item.clientMessageId === clientMessageId ||
                    item._id === formatted._id
                );

                if (existingIndex !== -1) {
                    return previous.map((item, index) =>
                        index === existingIndex
                            ? { ...item, ...formatted }
                            : item
                    );
                }

                return [...previous, formatted].sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
            });
        };


        const handleOutboxFailed = (event) => {
            const { clientMessageId } = event.detail || {};

            if (!clientMessageId) return;

            setMessages(previous =>
                previous.map(item =>
                    item.clientMessageId === clientMessageId
                        ? { ...item, status: "failed" }
                        : item
                )
            );
        };

        window.addEventListener("outbox:sent", handleOutboxSent);
        window.addEventListener("outbox:failed", handleOutboxFailed);

        return () => {
            window.removeEventListener("outbox:sent", handleOutboxSent);
            window.removeEventListener("outbox:failed", handleOutboxFailed);
        };
    }, []);

    useEffect(() => {
        if (!socket || !conversationId) return;

        const handleMessageDelivered = (data) => {
            console.log("📬 message:delivered received:", data);

            if (
                data.conversationId?.toString() !==
                conversationId.toString()
            ) {
                console.log("❌ Conversation ID mismatch");
                return;
            }

            const deliveredIds = new Set(
                (data.messageIds || []).map(id => id.toString())
            );

            console.log("Delivered IDs:", [...deliveredIds]);

            setMessages(prev =>
                prev.map(msg => {
                    const messageId = (msg._id || msg.id)?.toString();

                    if (!deliveredIds.has(messageId)) return msg;

                    console.log("✅ Updating message:", messageId);

                    // Never downgrade a message that is already read
                    if (msg.status === "read" || msg.readAt) {
                        return msg;
                    }

                    return {
                        ...msg,
                        status: "delivered",
                        deliveredAt: data.deliveredAt
                    };
                })
            );
        };

        socket.on("message:delivered", handleMessageDelivered);

        return () => {
            socket.off("message:delivered", handleMessageDelivered);
        };
    }, [socket, conversationId]);



    useEffect(() => {
        if (!socket || !conversationId) return;

        // const handleMessageRead = (data) => {
        //     if (
        //         data.conversationId?.toString() !==
        //         conversationId.toString()
        //     ) {
        //         return;
        //     }

        //     const readIds = new Set(
        //         (data.messageIds || []).map(id => id.toString())
        //     );

        //     if (readIds.size === 0) return;

        //     setMessages(previous =>
        //         previous.map(msg => {
        //             const messageId = (msg._id || msg.id)?.toString();

        //             if (!readIds.has(messageId)) return msg;

        //             return {
        //                 ...msg,
        //                 status: "read",
        //                 readAt: data.readAt,
        //                 deliveredAt: msg.deliveredAt || data.readAt
        //             };
        //         })
        //     );
        // };


        const handleMessageRead = (data) => {
            console.log("🔵 MESSAGE READ EVENT RECEIVED:", data);

            if (
                data.conversationId?.toString() !==
                conversationId.toString()
            ) {
                console.log("❌ Read conversation mismatch");
                return;
            }

            const readIds = new Set(
                (data.messageIds || []).map(id => id.toString())
            );

            console.log("🔵 Read IDs:", [...readIds]);

            setMessages(previous =>
                previous.map(msg => {
                    const messageId = (msg._id || msg.id)?.toString();

                    if (!readIds.has(messageId)) return msg;

                    console.log("✅ Updating message to READ:", messageId);

                    return {
                        ...msg,
                        status: "read",
                        readAt: data.readAt,
                        deliveredAt: msg.deliveredAt || data.readAt
                    };
                })
            );
        };


        socket.on("message:read", handleMessageRead);

        return () => {
            socket.off("message:read", handleMessageRead);
        };
    }, [socket, conversationId]);



    // Send message to backend
    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || !conversationId || !currentUserId) return;

        const clientMessageId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const optimisticMessage = {
            id: clientMessageId,
            _id: clientMessageId,
            clientMessageId,
            senderId: currentUserId.toString(),
            text: trimmedMessage,
            createdAt,
            time: formatTime(createdAt),
            status: "sending"
        };

        const pendingMessage = {
            clientMessageId,
            userId: currentUserId.toString(),
            conversationId: conversationId.toString(),
            text: trimmedMessage,
            createdAt,
            status: "queued",
            attempts: 0
        };

        try {
            // Persist first. Never send before this succeeds.
            await savePendingMessage(pendingMessage);

            setMessages(previous => [...previous, optimisticMessage]);
            setMessage("");
            setError("");
            stopTyping();

            setTimeout(() => scrollToBottom(), 50);

            // API sending continues independently of the input
            flushMessageOutbox(currentUserId.toString());

        } catch (err) {
            console.error("Unable to save message locally:", err);

            setError(
                "Message could not be saved on this device. Please try again."
            );
        }
    };

    const retryMessage = async (failedMessage) => {
        const clientMessageId = failedMessage.clientMessageId;

        if (!clientMessageId) return;

        try {
            await updatePendingMessage(clientMessageId, {
                status: "queued",
                lastError: ""
            });

            setMessages(previous =>
                previous.map(item =>
                    item.clientMessageId === clientMessageId
                        ? { ...item, status: "sending" }
                        : item
                )
            );

            flushMessageOutbox(currentUserId.toString());

        } catch (error) {
            console.error("Retry failed:", error);
            setError("Unable to retry this message.");
        }
    };



    return (
        <div
            className="d-flex flex-column overflow-hidden w-100"
            style={{
                backgroundColor: "var(--color-background)",
                height: "100%",
                minHeight: 0,
                flex: 1,
            }}
        >
            {/* Chat Header */}
            <div
                className="d-flex align-items-center gap-3 px-3"
                style={{
                    height: "72px",
                    flexShrink: 0,
                    minWidth: 0,
                    backgroundColor: "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border-light)"
                }}
            >
                <button
                    type="button"
                    onClick={onBack}
                    className="btn border-0 p-0 d-lg-none"
                    style={{
                        color: "var(--color-text-primary)"
                    }}
                >
                    <i className="bi bi-arrow-left fs-5" />
                </button>

                {chat.avatar ? (
                    <img
                        src={chat.avatar}
                        alt={chat.name}
                        width="42"
                        height="42"
                        className="rounded-circle"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                        style={{
                            width: "42px",
                            height: "42px",
                            backgroundColor: "var(--color-primary-light)",
                            color: "var(--color-primary)"
                        }}
                    >
                        {chat.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}

                <div className="flex-grow-1">
                    <div
                        className="fw-semibold"
                        style={{
                            color: "var(--color-text-primary)",
                            fontSize: "14px"
                        }}
                    >
                        {chat.name}
                    </div>

                    <small
                        style={{
                            color: isOtherTyping
                                ? "var(--color-primary)"
                                : chat.online
                                    ? "var(--color-success)"
                                    : "var(--color-text-muted)"
                        }}
                    >
                        {isOtherTyping
                            ? "Typing..."
                            : chat.online
                                ? "Online"
                                : formatLastSeen(chat.lastSeen)}
                    </small>

                </div>

                <button
                    type="button"
                    className="btn border-0 p-2"
                    style={{
                        color: "var(--color-text-secondary)"
                    }}
                >
                    <i className="bi bi-three-dots-vertical fs-5" />
                </button>
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                className="flex-grow-1 overflow-auto p-3"
                style={{
                    minHeight: 0,
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <div className="d-flex flex-column gap-3">

                    {/* Loading older messages */}
                    {loadingOlder && (
                        <div className="text-center py-2">
                            <div
                                className="spinner-border spinner-border-sm"
                                style={{ color: "var(--color-primary)" }}
                            />
                        </div>
                    )}

                    {/* Initial loading */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                style={{ color: "var(--color-primary)" }}
                            />
                            <div
                                className="small mt-2"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Loading messages...
                            </div>
                        </div>

                    ) : messages.length === 0 ? (
                        <div className="text-center py-5">
                            <i
                                className="bi bi-chat-dots fs-1"
                                style={{ color: "var(--color-text-muted)" }}
                            />

                            <p
                                className="mt-2 mb-0"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                No messages yet. Start a conversation!
                            </p>
                        </div>

                    ) : (
                        messages.map((msg, index) => {
                            const isMine =
                                msg.senderId?.toString() === currentUserId?.toString();

                            return (
                                <div
                                    key={msg._id || msg.id || `message-${index}`}
                                    className={`d-flex ${isMine
                                        ? "justify-content-end"
                                        : "justify-content-start"
                                        }`}
                                    style={{
                                        width: "100%",
                                        minWidth: 0
                                    }}
                                >
                                    {/* Message Bubble */}
                                    <div
                                        style={{
                                            width: "fit-content",
                                            maxWidth: "min(75%, 520px)",
                                            minWidth: "80px",
                                            boxSizing: "border-box",
                                            padding: "10px 14px",
                                            backgroundColor: isMine
                                                ? "var(--color-primary)"
                                                : "var(--color-surface)",
                                            color: isMine
                                                ? "var(--color-white)"
                                                : "var(--color-text-primary)",
                                            borderRadius: "var(--radius-lg)",
                                            boxShadow: "var(--shadow-sm)",
                                            overflowWrap: "anywhere",
                                            whiteSpace: "pre-wrap"
                                        }}
                                    >
                                        {/* Message Text */}
                                        <div style={{ fontSize: "14px" }}>
                                            {msg.text}
                                        </div>

                                        {/* Message Time & Status */}
                                        <div
                                            className="d-flex align-items-center justify-content-end gap-1 mt-1"
                                            style={{
                                                fontSize: "10px",
                                                opacity: 0.75
                                            }}
                                        >
                                            <span>{msg.time}</span>

                                            {isMine && (
                                                <>
                                                    {msg.status === "sending" && (
                                                        <i className="bi bi-clock" />
                                                    )}

                                                    {msg.status === "sent" && (
                                                        <i
                                                            className="bi bi-check2"
                                                            style={{ color: "var(--color-text-muted)" }}
                                                        />
                                                    )}

                                                    {msg.status === "delivered" && (
                                                        <i
                                                            className="bi bi-check2-all"
                                                            style={{ color: "var(--color-text-muted)" }}
                                                        />
                                                    )}

                                                    {msg.status === "read" && (
                                                        <i
                                                            className="bi bi-check2-all"
                                                            style={{ color: "var(--color-info)" }}
                                                        />
                                                    )}

                                                    {msg.status === "failed" && (
                                                        <i className="bi bi-exclamation-circle" />
                                                    )}
                                                </>
                                            )}

                                        </div>

                                        {/* Retry Failed Message */}
                                        {msg.status === "failed" && (
                                            <button
                                                type="button"
                                                onClick={() => retryMessage(msg)}
                                                className="btn btn-sm border-0 p-0 mt-1"
                                                style={{
                                                    color: "var(--color-danger)",
                                                    fontSize: "11px"
                                                }}
                                            >
                                                Retry sending
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div ref={bottomRef} />

                </div>
            </div>


            {/* Error Message */}
            {error && (
                <div
                    className="px-3 py-2 small"
                    style={{
                        color: "var(--color-danger)",
                        backgroundColor: "var(--color-surface)"
                    }}
                >
                    {error}
                    <button
                        type="button"
                        onClick={() => setError("")}
                        className="btn btn-sm border-0 p-0 ms-2"
                        style={{ color: "var(--color-danger)" }}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Message Composer */}
            <div
                className="p-3 flex-shrink-0"
                style={{
                    backgroundColor: "var(--color-surface)",
                    borderTop: "1px solid var(--color-border-light)",
                    paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                }}
            >
                <div className="d-flex align-items-center gap-2">

                    <button
                        type="button"
                        className="btn border-0 p-2"
                        style={{
                            color: "var(--color-text-secondary)"
                        }}
                    >
                        <i className="bi bi-paperclip fs-5" />
                    </button>

                    <input
                        ref={messageInputRef}
                        type="text"
                        value={message}
                        // onChange={(e) => setMessage(e.target.value)}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        onBlur={stopTyping}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        maxLength={5000}
                        className="form-control border-0 shadow-none"
                        style={{
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-primary)",
                            borderRadius: "var(--radius-pill)",
                            fontSize: "14px"
                        }}
                    />
                    <button
                        type="button"
                        onPointerDown={(e) => e.preventDefault()}
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        className="btn rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "42px",
                            height: "42px",
                            flexShrink: 0,
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            opacity: !message.trim() ? 0.6 : 1
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
