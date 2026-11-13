
import { useEffect } from "react";
import { connectSocket } from "../services/socket";
import { flushMessageOutbox } from "../services/messageOutbox";

const getCurrentUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return (user._id || user.id)?.toString() || null;
    } catch {
        return null;
    }
};

const SocketInitializer = () => {
    useEffect(() => {
        let socket = null;

        const syncOutbox = () => {
            const token = localStorage.getItem("token");
            const userId = getCurrentUserId();

            if (token && userId && navigator.onLine) {
                flushMessageOutbox(userId);
            }
        };

        const initialize = () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            socket = connectSocket(token);

            if (socket) {
                socket.on("connect", syncOutbox);
            }

            syncOutbox();
        };

        const handleLogin = () => initialize();

        const handleOnline = () => syncOutbox();

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                syncOutbox();
            }
        };

        window.addEventListener("auth:login", handleLogin);
        window.addEventListener("online", handleOnline);
        window.addEventListener("focus", syncOutbox);
        document.addEventListener("visibilitychange", handleVisibility);

        initialize();

        return () => {
            window.removeEventListener("auth:login", handleLogin);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("focus", syncOutbox);
            document.removeEventListener("visibilitychange", handleVisibility);

            socket?.off("connect", syncOutbox);
        };
    }, []);

    return null;
};

export default SocketInitializer;
