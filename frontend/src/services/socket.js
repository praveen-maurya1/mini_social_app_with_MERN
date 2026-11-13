import { io } from "socket.io-client";
import API from "./api";

let socket = null;

export const connectSocket = (token) => {
    if (!token) return null;

    // Reuse existing socket, including while connecting
    if (socket) {
        return socket;
    }

    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
    });

    socket.on("message:new", async ({ message, conversationId }) => {
        if (!message?._id || !conversationId) return;

        try {
            await API.patch(
                `/messages/${conversationId}/delivered`,
                { messageIds: [message._id] }
            );

            console.log("Message delivered:", message._id);
        } catch (error) {
            console.error(
                "Delivery acknowledgement failed:",
                error.response?.data || error.message
            );
        }
    });

    socket.on("connect", () => {
        console.log("Global socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("Global socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    return socket;
};

export const setSocket = (newSocket) => {
    socket = newSocket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Global socket disconnected");
    }
};
