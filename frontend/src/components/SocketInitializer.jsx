
import { useEffect } from "react";
import { connectSocket } from "../services/socket";

const SocketInitializer = () => {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            connectSocket(token);
        }
    }, []);

    return null;
};

export default SocketInitializer;
