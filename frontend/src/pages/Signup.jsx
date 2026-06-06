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
            setLoading(false);

            alert(res.data.message);


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
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                <h2 className="mb-4">Signup</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="form-control mb-3"
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        onChange={handleChange}
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