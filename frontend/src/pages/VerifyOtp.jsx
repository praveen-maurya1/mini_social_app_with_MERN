// import { useState } from "react";
// import { useLocation, useNavigate, Navigate } from "react-router-dom";
// import API from "../services/api";

// function VerifyOtp() {
//     const [otp, setOtp] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const email =
//         location.state?.email ||
//         sessionStorage.getItem("otpEmail");

//     if (!email) {
//         return <Navigate to="/signup" replace />;
//     }
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);
//             await API.post("/auth/verify-email", {
//                 email,
//                 otp,
//             });

//             sessionStorage.removeItem("otpEmail");

//             alert("Email Verified");

//             navigate("/");
//         } catch (error) {
//             alert(
//                 error.response?.data?.message
//             );
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <div
//                 className="card p-4 mx-auto"
//                 style={{ maxWidth: "400px" }}
//             >
//                 <h3>Verify OTP</h3>

//                 <p>
//                     OTP sent to:
//                     <br />
//                     <strong>{email}</strong>
//                 </p>

//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         maxLength={6}
//                         className="form-control mb-3"
//                         placeholder="Enter 6 digit OTP"
//                         value={otp}
//                         onChange={(e) =>
//                             setOtp(e.target.value)
//                         }
//                     />

//                     <button
//                         className="btn btn-primary w-100"
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading
//                             ? "Verifying..."
//                             : "Verify"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default VerifyOtp;





import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const email =
        location.state?.email ||
        sessionStorage.getItem("otpEmail");

    if (!email) {
        return <Navigate to="/signup" replace />;
    }

    useEffect(() => {
        showToast(
            "Otp sent successfully to your email",
            "success"
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await API.post("/auth/verify-email", {
                email,
                otp,
            });

            sessionStorage.removeItem("otpEmail");

            showToast(
                res.data.message || "Email Verified",
                "success"
            );

            navigate("/");
        } catch (error) {
            // alert(
            //     error.response?.data?.message ||
            //     "OTP Verification Failed"
            // );
            showToast(
                error.response?.data?.message || "OTP Verification Failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3"
            style={{
                background: "var(--color-background)",
                color: "var(--color-text-primary)",
            }}
        >
            <div
                className="card border-0 shadow-lg w-100"
                style={{
                    maxWidth: "440px",
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-lg)",
                }}
            >
                <div className="card-body p-4 p-md-5">

                    {/* Brand */}
                    <div className="text-center mb-4">
                        <div
                            className="d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "var(--radius-lg)",
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-white)",
                                fontSize: "30px",
                            }}
                        >
                            C
                        </div>

                        <h2
                            className="fw-bold mb-2"
                            style={{
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Caché
                        </h2>

                        <p
                            className="mb-0"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            Connect, share and discover.
                        </p>
                    </div>

                    {/* Verification Heading */}
                    <div className="text-center mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{
                                width: "54px",
                                height: "54px",
                                background: "var(--color-surface-secondary)",
                                color: "var(--color-primary)",
                                fontSize: "23px",
                            }}
                        >
                            <i className="bi bi-envelope-check" />
                        </div>

                        <h4
                            className="fw-bold mb-2"
                            style={{
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Verify your email
                        </h4>

                        <p
                            className="mb-2"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            We've sent a verification code to:
                        </p>

                        <p
                            className="fw-semibold mb-0 text-break"
                            style={{
                                color: "var(--color-primary)",
                                fontSize: "14px",
                            }}
                        >
                            {email}
                        </p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label
                                className="form-label fw-semibold"
                                style={{ fontSize: "14px" }}
                            >
                                Enter 6-digit OTP
                            </label>

                            <input
                                type="text"
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                className="form-control text-center py-3 fw-bold"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ""))
                                }
                                required
                                autoComplete="one-time-code"
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                    fontSize: "22px",
                                    letterSpacing: "10px",
                                }}
                            />
                        </div>

                        <button
                            className="btn w-100 py-2 fw-semibold"
                            type="submit"
                            disabled={loading}
                            style={{
                                background: "var(--color-primary)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "10px",
                            }}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        aria-hidden="true"
                                    />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Email"
                            )}
                        </button>

                    </form>

                    <p
                        className="text-center mt-4 mb-0"
                        style={{
                            color: "var(--color-text-muted)",
                            fontSize: "13px",
                        }}
                    >
                        Enter the verification code sent to your email.
                    </p>

                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;
