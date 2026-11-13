
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import API from "../services/api";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;
        const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
            auth: { token },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        const handleNewMessage = async ({ message, conversationId }) => {
            if (!message?._id || !conversationId) return;

            // Acknowledge delivery even when Chat page is not open.
            try {
                await API.patch(
                    `/messages/${conversationId}/delivered`,
                    { messageIds: [message._id] }
                );
            } catch (error) {
                console.error(
                    "Delivery acknowledgement failed:",
                    error.response?.data || error.message
                );
            }
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
}
