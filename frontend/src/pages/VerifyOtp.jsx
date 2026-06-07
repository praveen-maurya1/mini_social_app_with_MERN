import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        sessionStorage.getItem("otpEmail");

    if (!email) {
        return <Navigate to="/signup" replace />;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await API.post("/auth/verify-email", {
                email,
                otp,
            });

            sessionStorage.removeItem("otpEmail");

            alert("Email Verified");

            navigate("/");
        } catch (error) {
            alert(
                error.response?.data?.message
            );
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div
                className="card p-4 mx-auto"
                style={{ maxWidth: "400px" }}
            >
                <h3>Verify OTP</h3>

                <p>
                    OTP sent to:
                    <br />
                    <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        maxLength={6}
                        className="form-control mb-3"
                        placeholder="Enter 6 digit OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                    />

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;