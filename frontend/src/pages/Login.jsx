import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.accessToken
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/feed");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div
                className="card shadow p-4 mx-auto mt-5"
                style={{ maxWidth: "450px" }}
            >
                <div>
                    <div className="d-flex gap-2 mb-3 align-items-center justify-content-center">
                        <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}><img src="/favicon.ico" alt="Logo" /></div>
                        <h2 className="text-center mb-2">
                            MySocialMedia
                        </h2>
                    </div>
                    <h3 className="text-center mb-4">
                        Login
                    </h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <p className="text-center mt-3 mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;