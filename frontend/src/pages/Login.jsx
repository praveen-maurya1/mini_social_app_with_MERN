// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Login() {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);

//             const response = await API.post(
//                 "/auth/login",
//                 formData
//             );
//             // console.log(response.data);

//             localStorage.setItem(
//                 "token",
//                 response.data.accessToken
//             );

//             localStorage.setItem(
//                 "user",
//                 JSON.stringify(response.data.user)
//             );

//             navigate("/feed");
//         } catch (error) {
//             alert(
//                 error.response?.data?.message ||
//                 "Login Failed"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container">
//             <div
//                 className="card shadow p-4 mx-auto mt-5"
//                 style={{ maxWidth: "450px" }}
//             >
//                 <div>
//                     <div className="d-flex gap-2 mb-3 align-items-center justify-content-center">
//                         <div className="overflow-hidden rounded-circle" style={{ width: "63px", height: "63px" }}><img src="/favicon.ico" alt="Logo" /></div>
//                         <h2 className="text-center mb-2">
//                             MySocialMedia
//                         </h2>
//                     </div>
//                     <h3 className="text-center mb-4">
//                         Login
//                     </h3>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label">
//                             Email
//                         </label>

//                         <input
//                             type="email"
//                             name="email"
//                             className="form-control"
//                             placeholder="Enter Email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="form-label">
//                             Password
//                         </label>

//                         <input
//                             type="password"
//                             name="password"
//                             className="form-control"
//                             placeholder="Enter Password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="btn btn-primary w-100"
//                         disabled={loading}
//                     >
//                         {loading
//                             ? "Logging in..."
//                             : "Login"}
//                     </button>
//                 </form>

//                 <p className="text-center mt-3 mb-0">
//                     Don't have an account?{" "}
//                     <Link to="/signup">
//                         Signup
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Login;



import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Login() {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
            showToast(
                "Logged In successfully", "success"
            );
            navigate("/home");
        } catch (error) {
            // alert(
            //     error.response?.data?.message ||
            //     "Login Failed"
            // );
            showToast(
                error.response?.data?.message || "Login Failed",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };
    const healthCheckUp = (e) => {
        const response = API.get(
            "/auth/healthCheckUp",
            formData
        );
    }
    useEffect(() => {
        healthCheckUp();
    }, []);

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
                            Welcome back
                        </h4>

                        <p
                            className="mb-0"
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            Login to continue to your account.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label
                                className="form-label fw-semibold"
                                style={{ fontSize: "14px" }}
                            >
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control py-2"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className="form-label fw-semibold"
                                style={{ fontSize: "14px" }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control py-2"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    borderColor: "var(--color-border)",
                                }}
                            />
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
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </form>

                    {/* Signup Link */}
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
                            Don't have an account?{" "}
                        </span>

                        <Link
                            to="/signup"
                            className="fw-semibold text-decoration-none"
                            style={{
                                color: "var(--color-primary)",
                            }}
                        >
                            Create account
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
