import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await API.post("/auth/register", formData);

            alert(res.data.message);
            sessionStorage.setItem("otpEmail", formData.email);

            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                },
            });
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Signup Failed"
            );
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                <div className="d-flex gap-2 mb-3 align-items-center justify-content-center">
                    <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}><img src="/favicon.ico" alt="Logo" /></div>
                    <h2 className="text-center mb-2">
                        MySocialMedia
                    </h2>
                </div>
                <h2 className="text-center mb-4">Signup</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="form-control mb-3"
                        onChange={handleChange}
                        maxLength={30}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        onChange={handleChange}
                        minLength={7}
                        maxLength={30}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Signup"}

                    </button>
                </form>

                <p className="mt-3">
                    Already have an account?{" "}
                    <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;