import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/verify-email", {
                email,
                otp,
            });

            alert("Email Verified");

            navigate("/");
        } catch (error) {
            alert(
                error.response?.data?.message
            );
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
                        placeholder="Enter 4 digit OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                    />

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;