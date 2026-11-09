// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Signup() {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         password: "",
//     });


//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);
//             const res = await API.post("/auth/register", formData);

//             alert(res.data.message);
//             sessionStorage.setItem("otpEmail", formData.email);

//             navigate("/verify-otp", {
//                 state: {
//                     email: formData.email,
//                 },
//             });
//         } catch (error) {
//             alert(
//                 error.response?.data?.message ||
//                 "Signup Failed"
//             );
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
//                 <div className="d-flex gap-2 mb-3 align-items-center justify-content-center">
//                     <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}><img src="/favicon.ico" alt="Logo" /></div>
//                     <h2 className="text-center mb-2">
//                         MySocialMedia
//                     </h2>
//                 </div>
//                 <h2 className="text-center mb-4">Signup</h2>

//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         name="username"
//                         placeholder="Username"
//                         className="form-control mb-3"
//                         onChange={handleChange}
//                         maxLength={30}
//                         required
//                     />

//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         className="form-control mb-3"
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="password"
//                         name="password"
//                         placeholder="Password"
//                         className="form-control mb-3"
//                         onChange={handleChange}
//                         minLength={7}
//                         maxLength={30}
//                         required
//                     />

//                     <button
//                         type="submit"
//                         className="btn btn-primary w-100"
//                         disabled={loading}
//                     >
//                         {loading
//                             ? "Creating account..."
//                             : "Signup"}

//                     </button>
//                 </form>

//                 <p className="mt-3">
//                     Already have an account?{" "}
//                     <Link to="/">Login</Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Signup;





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Signup() {
    const navigate = useNavigate();
    const { showToast } = useToast();
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

            // alert(res.data.message);
            showToast(
                res.data.message || "Registration successful",
                "success"
            );
            sessionStorage.setItem("otpEmail", formData.email);

            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                },
            });

        } catch (error) {
            // alert(
            //     error.response?.data?.message ||
            //     "Signup Failed"
            // );
            showToast(
                error.response?.data?.message || "Login Failed",
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

                    {/* Heading */}
                    <div className="mb-4">
                        <h4
                            className="fw-bold mb-2"
                            style={{
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Create your account
                        </h4>

                        <p
                            className="mb-0"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            Join Caché and start connecting with people.
                        </p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                className="form-control py-2"
                                onChange={handleChange}
                                maxLength={30}
                                required
                                autoComplete="username"
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="form-control py-2"
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                className="form-control py-2"
                                onChange={handleChange}
                                minLength={7}
                                maxLength={30}
                                required
                                autoComplete="new-password"
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                }}
                            />

                            <small
                                className="d-block mt-2"
                                style={{
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Password must be between 7 and 30 characters.
                            </small>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 py-2 fw-semibold"
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
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                    </form>

                    {/* Login Link */}
                    <div
                        className="text-center mt-4 pt-3"
                        style={{
                            borderTop: "1px solid var(--color-border)",
                            fontSize: "14px",
                        }}
                    >
                        <span style={{
                            color: "var(--color-text-secondary)",
                        }}>
                            Already have an account?{" "}
                        </span>

                        <Link
                            to="/"
                            className="fw-semibold text-decoration-none"
                            style={{
                                color: "var(--color-primary)",
                            }}
                        >
                            Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Signup;
