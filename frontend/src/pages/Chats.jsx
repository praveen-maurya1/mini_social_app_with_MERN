import React, { useState, useEffect, useCallback, useRef } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import MobileNav from "../components/layout/MobileNav";

import ChatList from "../components/chats/ChatList";
import ChatWindow from "../components/chats/ChatWindow";

import API from "../services/api";

import { getSocket } from "../services/socket";

const getUserId = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
        return (value._id || value.id || "").toString();
    }

    return value.toString();
};
// Convert backend conversation into frontend display format
const formatConversation = (conversation) => {
    const otherUser = conversation.otherUser;

    const lastMessage = conversation.lastMessage;
    const lastMessageTime =
        conversation.lastMessageAt || conversation.createdAt;

    return {
        ...conversation,

        id: conversation._id,

        // Other user's details
        otherUserId: otherUser?._id?.toString(),
        name:
            otherUser?.displayName ||
            otherUser?.username ||
            "Unknown User",
        username: otherUser?.username || "",
        avatar: otherUser?.image || "",

        // Presence
        online: otherUser?.isOnline || false,
        lastSeen: otherUser?.lastSeen || null,

        lastMessage: lastMessage?.text || "",
        lastMessageId: lastMessage?._id?.toString() || "",
        lastMessageSenderId: getUserId(lastMessage?.sender),
        lastMessageStatus: lastMessage?.readAt
            ? "read"
            : lastMessage?.deliveredAt
                ? "delivered"
                : lastMessage
                    ? "sent"
                    : "",
        lastMessageDeliveredAt: lastMessage?.deliveredAt || null,
        lastMessageReadAt: lastMessage?.readAt || null,
        time: lastMessageTime
            ? new Date(lastMessageTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
            : "",

        unread: conversation.unreadCount || 0,
        messages: [],
    };


};

function Chats() {

    const [viewportHeight, setViewportHeight] = useState(
        () => window.visualViewport?.height || window.innerHeight
    );
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const selectedChatRef = useRef(null);
    const processedMessageIdsRef = useRef(new Set());

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);
    const [socket, setSocket] = useState(null);

    // Fetch logged-in user
    const fetchMe = async () => {
        try {
            const res = await API.get("/auth/get-me");
            setUser(res.data.user);
        } catch (error) {
            console.error("Fetch user error:", error);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);
    // Track visible viewport height when mobile keyboard opens/closes
    useEffect(() => {
        const viewport = window.visualViewport;

        const updateViewportHeight = () => {
            const height = viewport?.height || window.innerHeight;

            setViewportHeight((previous) =>
                Math.abs(previous - height) > 1 ? height : previous
            );
        };

        updateViewportHeight();

        window.addEventListener("resize", updateViewportHeight);
        viewport?.addEventListener("resize", updateViewportHeight);

        return () => {
            window.removeEventListener("resize", updateViewportHeight);
            viewport?.removeEventListener("resize", updateViewportHeight);
        };
    }, []);
    // Fetch first batch of conversations
    const fetchConversations = useCallback(async () => {
        try {
            setLoading(true);

            const res = await API.get("/conversations", {
                params: { limit: 15 },
            });

            const formattedConversations = (
                res.data.conversations || []
            ).map(formatConversation);

            setConversations(formattedConversations);

            setHasMore(res.data.pagination?.hasMore || false);
            setNextCursor(res.data.pagination?.nextCursor || null);

        } catch (error) {
            console.error("Fetch conversations error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load older conversations
    const loadMoreConversations = useCallback(async () => {
        if (!hasMore || !nextCursor || loadingMore) return;

        try {
            setLoadingMore(true);

            const res = await API.get("/conversations", {
                params: {
                    limit: 15,
                    cursor: nextCursor,
                },
            });

            const newConversations = (
                res.data.conversations || []
            ).map(formatConversation);

            setConversations((prev) => {
                const existingIds = new Set(
                    prev.map((chat) => chat._id.toString())
                );

                const uniqueConversations = newConversations.filter(
                    (chat) => !existingIds.has(chat._id.toString())
                );

                return [...prev, ...uniqueConversations];
            });

            setHasMore(res.data.pagination?.hasMore || false);
            setNextCursor(res.data.pagination?.nextCursor || null);

        } catch (error) {
            console.error("Load more conversations error:", error);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, nextCursor, loadingMore]);

    // Use the existing global Socket.IO connection
    useEffect(() => {
        if (!user) return;

        fetchConversations();

        const existingSocket = getSocket();

        if (!existingSocket) {
            console.error("Global socket is not connected!");
            return;
        }

        // Reuse the existing connection
        setSocket(existingSocket);

        console.log("Using global socket:", existingSocket.id);

        // Get user ID from presence event
        const getPresenceUserId = (payload) => {
            if (typeof payload === "string") return payload;

            return (
                payload?.userId ||
                payload?.user?._id ||
                payload?._id ||
                payload?.id ||
                ""
            ).toString();
        };

        // Update user presence
        const updateUserPresence = (payload, isOnline) => {
            const userId = getPresenceUserId(payload);

            if (!userId) return;

            const lastSeen = isOnline
                ? null
                : payload?.lastSeen || new Date().toISOString();

            setConversations((prev) =>
                prev.map((chat) =>
                    chat.otherUserId === userId
                        ? { ...chat, online: isOnline, lastSeen }
                        : chat
                )
            );

            setSelectedChat((prev) => {
                if (!prev || prev.otherUserId !== userId) return prev;

                return {
                    ...prev,
                    online: isOnline,
                    lastSeen,
                };
            });
        };

        const handleUserOnline = (payload) => {
            updateUserPresence(payload, true);
        };

        const handleUserOffline = (payload) => {
            updateUserPresence(payload, false);
        };

        // Update latest message receipt in conversation previews
        const updateConversationReceipt = (
            conversationId,
            messageIds,
            status,
            timestamp
        ) => {
            const receiptIds = new Set(
                (messageIds || []).map((id) => id.toString())
            );

            if (receiptIds.size === 0) return;

            const updateChat = (chat) => {
                if (chat._id?.toString() !== conversationId?.toString()) {
                    return chat;
                }

                if (!receiptIds.has(chat.lastMessageId?.toString())) {
                    return chat;
                }

                // Never downgrade read status
                if (chat.lastMessageStatus === "read") {
                    return chat;
                }

                return {
                    ...chat,
                    lastMessageStatus: status,
                    lastMessageDeliveredAt:
                        status === "delivered"
                            ? timestamp
                            : chat.lastMessageDeliveredAt,
                    lastMessageReadAt:
                        status === "read"
                            ? timestamp
                            : chat.lastMessageReadAt,
                };
            };

            setConversations((prev) => prev.map(updateChat));

            setSelectedChat((prev) =>
                prev ? updateChat(prev) : prev
            );
        };

        // Message delivered: double grey ticks
        const handleMessageDelivered = (data) => {
            updateConversationReceipt(
                data.conversationId,
                data.messageIds,
                "delivered",
                data.deliveredAt
            );
        };

        // Message read: double blue ticks
        const handleMessageRead = (data) => {
            updateConversationReceipt(
                data.conversationId,
                data.messageIds,
                "read",
                data.readAt
            );
        };

        // Incoming message: update conversation preview

        const handleNewMessage = ({ message, conversationId }) => {
            if (!message || !conversationId) return;

            const messageId = message._id?.toString();
            const senderId = getUserId(message.sender);
            const currentUserId = getUserId(user?._id || user?.id);

            // Prevent duplicate unread increments
            if (messageId && processedMessageIdsRef.current.has(messageId)) {
                return;
            }

            if (messageId) {
                processedMessageIdsRef.current.add(messageId);
            }

            // Keep the deduplication set bounded
            if (processedMessageIdsRef.current.size > 1000) {
                const firstId = processedMessageIdsRef.current.values().next().value;
                processedMessageIdsRef.current.delete(firstId);
            }

            const isIncoming = senderId !== currentUserId;

            const isCurrentlyOpen =
                selectedChatRef.current?._id?.toString() ===
                conversationId.toString();

            const shouldIncrementUnread =
                isIncoming && !isCurrentlyOpen;

            const messageData = {
                lastMessage: message.text || "",
                lastMessageId: messageId || "",
                lastMessageSenderId: senderId,
                lastMessageStatus: message.readAt
                    ? "read"
                    : message.deliveredAt
                        ? "delivered"
                        : "sent",
                lastMessageDeliveredAt: message.deliveredAt || null,
                lastMessageReadAt: message.readAt || null,
                lastMessageAt: message.createdAt,
                time: message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                    : ""
            };

            setConversations((prev) => {
                const updated = prev.map((chat) => {
                    if (chat._id.toString() !== conversationId.toString()) {
                        return chat;
                    }

                    return {
                        ...chat,
                        ...messageData,
                        unread: shouldIncrementUnread
                            ? (chat.unread || 0) + 1
                            : chat.unread || 0
                    };
                });

                const index = updated.findIndex(
                    (chat) => chat._id.toString() === conversationId.toString()
                );

                if (index > 0) {
                    const [updatedChat] = updated.splice(index, 1);
                    updated.unshift(updatedChat);
                }

                return updated;
            });

            setSelectedChat((prev) => {
                if (
                    !prev ||
                    prev._id?.toString() !== conversationId.toString()
                ) {
                    return prev;
                }

                return {
                    ...prev,
                    ...messageData
                };
            });
        };


        // Register listeners on the existing global socket
        existingSocket.on("user:online", handleUserOnline);
        existingSocket.on("user:offline", handleUserOffline);
        existingSocket.on("message:new", handleNewMessage);
        existingSocket.on("message:delivered", handleMessageDelivered);
        existingSocket.on("message:read", handleMessageRead);

        // Remove only this component's listeners
        // Do NOT disconnect the global socket
        return () => {
            existingSocket.off("user:online", handleUserOnline);
            existingSocket.off("user:offline", handleUserOffline);
            existingSocket.off("message:new", handleNewMessage);
            existingSocket.off("message:delivered", handleMessageDelivered);
            existingSocket.off("message:read", handleMessageRead);

            setSocket(null);
        };

    }, [user, fetchConversations]);

    const handleSelectChat = (chat) => {
        const conversationId = chat._id.toString();

        selectedChatRef.current = chat;

        setConversations((prev) =>
            prev.map((item) =>
                item._id.toString() === conversationId
                    ? { ...item, unread: 0 }
                    : item
            )
        );

        setSelectedChat({
            ...chat,
            unread: 0
        });
    };

    const handleBack = () => {
        setSelectedChat(null);
    };

    return (
        <div
            style={{
                height: `${viewportHeight}px`,
                minHeight: 0,
                overflow: "hidden",
                backgroundColor: "var(--color-background)",
                color: "var(--color-text-primary)",
            }}
        >
            <div
                className="d-flex h-100"
                style={{ minHeight: 0 }}
            >

                {/* Desktop Sidebar */}
                <div className="d-none d-lg-block flex-shrink-0">
                    <Sidebar user={user} />
                </div>

                {/* Main Area */}
                <div
                    className="flex-grow-1 min-vw-0 d-flex flex-column h-100"
                    style={{ minHeight: 0 }}
                >
                    <Topbar user={user} />

                    <div
                        className="container-fluid flex-grow-1 p-0 overflow-hidden"
                        style={{ minHeight: 0 }}
                    >
                        <div
                            className="row h-100 g-0"
                            style={{ minHeight: 0 }}
                        >
                            {/* Chat Window */}
                            <main
                                className={`col-12 col-lg-8 col-xl-8 h-100 ${selectedChat
                                    ? "d-flex"
                                    : "d-none d-lg-flex"
                                    }`}
                                style={{ minHeight: 0 }}
                            >
                                {selectedChat ? (
                                    <div
                                        className="w-100 h-100"
                                        style={{
                                            minHeight: 0,
                                            display: "flex"
                                        }}
                                    >
                                        <ChatWindow
                                            key={selectedChat._id}
                                            chat={selectedChat}
                                            user={user}
                                            socket={socket}
                                            onBack={handleBack}
                                        />
                                    </div>
                                ) : (
                                    <div className="d-none d-lg-flex flex-column align-items-center justify-content-center w-100 h-100">
                                        <i
                                            className="bi bi-chat-square-text"
                                            style={{
                                                fontSize: "56px",
                                                color: "var(--color-text-muted)",
                                            }}
                                        />

                                        <h5 className="mt-3 fw-semibold">
                                            Your messages
                                        </h5>

                                        <p
                                            className="small"
                                            style={{
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            Select a conversation to start chatting.
                                        </p>
                                    </div>
                                )}
                            </main>

                            {/* Chat List */}
                            <aside
                                className={`col-12 col-lg-4 col-xl-4 h-100 ${selectedChat
                                    ? "d-none d-lg-block"
                                    : "d-block"
                                    }`}
                            >
                                <ChatList
                                    conversations={conversations}
                                    selectedChat={selectedChat}
                                    onSelectChat={handleSelectChat}
                                    loading={loading}
                                    loadingMore={loadingMore}
                                    hasMore={hasMore}
                                    onLoadMore={loadMoreConversations}
                                    currentUserId={user?._id || user?.id}
                                />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {!selectedChat && <MobileNav />}
        </div>
    );
}

export default Chats;
