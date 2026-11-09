
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../context/ThemeContext";

// function AdminTopbar({ onMenuClick }) {
//     const { activeMode, setMode } = useTheme();
//     const navigate = useNavigate();

//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const profileRef = useRef(null);

//     const toggleTheme = () => {
//         setMode(activeMode === "dark" ? "light" : "dark");
//     };

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 profileRef.current &&
//                 !profileRef.current.contains(event.target)
//             ) {
//                 setShowProfileMenu(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleSettings = () => {
//         setShowProfileMenu(false);
//         navigate("/admin/settings");
//     };

//     const handleLogout = () => {
//         setShowProfileMenu(false);

//         // Connect your logout logic here later
//         navigate("/login");
//     };

//     return (
//         <header
//             className="d-flex align-items-center justify-content-between px-3 px-md-4"
//             style={{
//                 height: "72px",
//                 minHeight: "72px",
//                 backgroundColor: "var(--color-surface)",
//                 borderBottom: "1px solid var(--color-border)",
//             }}
//         >
//             {/* Left */}
//             <div className="d-flex align-items-center gap-3">
//                 <button
//                     type="button"
//                     className="btn border-0 p-1 d-lg-none"
//                     onClick={onMenuClick}
//                     style={{ color: "var(--color-text-primary)" }}
//                 >
//                     <i className="bi bi-list fs-3" />
//                 </button>

//                 <div>
//                     <h6
//                         className="mb-0 fw-semibold"
//                         style={{ color: "var(--color-text-primary)" }}
//                     >
//                         Admin Dashboard
//                     </h6>

//                     <small style={{ color: "var(--color-text-muted)" }}>
//                         Manage your Caché platform
//                     </small>
//                 </div>
//             </div>

//             {/* Right */}
//             <div className="d-flex align-items-center gap-2 gap-md-3">
//                 {/* Theme Toggle */}
//                 <button
//                     type="button"
//                     className="btn border-0 p-2"
//                     onClick={toggleTheme}
//                     title="Toggle theme"
//                     style={{
//                         color: "var(--color-text-secondary)",
//                         backgroundColor: "var(--color-surface-secondary)",
//                         borderRadius: "var(--radius-md)",
//                     }}
//                 >
//                     <i
//                         className={`bi ${activeMode === "dark"
//                             ? "bi-moon-stars-fill"
//                             : "bi-sun"
//                             }`}
//                     />
//                 </button>

//                 {/* Notifications */}
//                 <button
//                     onClick={() => navigate("/admin/notifications")}
//                     type="button"
//                     className="btn border-0 p-2 position-relative"
//                     style={{ color: "var(--color-text-secondary)" }}
//                     title="Notifications"
//                 >
//                     <i className="bi bi-bell fs-5" />

//                     <span
//                         className="position-absolute top-0 end-0 rounded-circle"
//                         style={{
//                             width: "8px",
//                             height: "8px",
//                             backgroundColor: "var(--color-danger)",
//                         }}
//                     />
//                 </button>

//                 {/* Admin Profile Dropdown */}
//                 <div className="position-relative" ref={profileRef}>
//                     <button
//                         type="button"
//                         onClick={() => setShowProfileMenu(!showProfileMenu)}
//                         className="btn border-0 d-flex align-items-center gap-2 p-1"
//                         style={{
//                             backgroundColor: "transparent",
//                         }}
//                     >
//                         <div
//                             className="d-flex align-items-center justify-content-center rounded-circle fw-semibold"
//                             style={{
//                                 width: "38px",
//                                 height: "38px",
//                                 backgroundColor: "var(--color-primary-light)",
//                                 color: "var(--color-primary)",
//                             }}
//                         >
//                             A
//                         </div>

//                         <div className="d-none d-md-block text-start">
//                             <div
//                                 className="small fw-semibold"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 Admin
//                             </div>

//                             <div
//                                 style={{
//                                     fontSize: "11px",
//                                     color: "var(--color-text-muted)",
//                                 }}
//                             >
//                                 Administrator
//                             </div>
//                         </div>

//                         <i
//                             className={`bi ${showProfileMenu
//                                 ? "bi-chevron-up"
//                                 : "bi-chevron-down"
//                                 } d-none d-md-inline`}
//                             style={{
//                                 fontSize: "11px",
//                                 color: "var(--color-text-muted)",
//                             }}
//                         />
//                     </button>

//                     {/* Dropdown */}
//                     {showProfileMenu && (
//                         <div
//                             className="position-absolute end-0 mt-2 p-2"
//                             style={{
//                                 width: "230px",
//                                 zIndex: 1100,
//                                 backgroundColor: "var(--color-surface)",
//                                 border: "1px solid var(--color-border)",
//                                 borderRadius: "var(--radius-lg)",
//                                 boxShadow: "var(--shadow-lg)",
//                             }}
//                         >
//                             {/* Profile Info */}
//                             <div className="px-2 py-2 mb-2">
//                                 <div
//                                     className="fw-semibold small"
//                                     style={{
//                                         color: "var(--color-text-primary)",
//                                     }}
//                                 >
//                                     Admin
//                                 </div>

//                                 <small
//                                     style={{
//                                         color: "var(--color-text-muted)",
//                                     }}
//                                 >
//                                     Administrator
//                                 </small>
//                             </div>

//                             <div
//                                 style={{
//                                     borderTop: "1px solid var(--color-border-light)",
//                                 }}
//                             />

//                             {/* Settings */}
//                             <button
//                                 type="button"
//                                 onClick={handleSettings}
//                                 className="btn w-100 border-0 d-flex align-items-center gap-3 text-start mt-2"
//                                 style={{
//                                     color: "var(--color-text-secondary)",
//                                     backgroundColor: "transparent",
//                                     fontSize: "14px",
//                                 }}
//                             >
//                                 <i className="bi bi-gear fs-5" />
//                                 Settings
//                             </button>

//                             {/* Logout */}
//                             <button
//                                 type="button"
//                                 onClick={handleLogout}
//                                 className="btn w-100 border-0 d-flex align-items-center gap-3 text-start mt-1"
//                                 style={{
//                                     color: "var(--color-danger)",
//                                     backgroundColor: "transparent",
//                                     fontSize: "14px",
//                                 }}
//                             >
//                                 <i className="bi bi-box-arrow-right fs-5" />
//                                 Logout
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default AdminTopbar;
