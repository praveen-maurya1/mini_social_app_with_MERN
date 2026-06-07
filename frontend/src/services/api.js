import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",//development
    baseURL: import.meta.env.VITE_API_URL, //production
    withCredentials: true,

});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default API;