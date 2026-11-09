
// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// const menuGroups = [
//     {
//         title: "OVERVIEW",
//         items: [
//             { label: "Dashboard", icon: "bi-grid-1x2", path: "/admin" },
//         ],
//     },
//     {
//         title: "MANAGEMENT",
//         items: [
//             { label: "Users", icon: "bi-people", path: "/admin/users" },
//             { label: "Posts", icon: "bi-file-post", path: "/admin/posts" },
//             { label: "Comments", icon: "bi-chat-left-text", path: "/admin/comments" },
//         ],
//     },
//     {
//         title: "MODERATION",
//         items: [
//             { label: "Reports", icon: "bi-flag", path: "/admin/reports" },
//             { label: "Moderation", icon: "bi-shield-check", path: "/admin/moderation" },
//         ],
//     },
//     {
//         title: "PREFERENCES",
//         items: [
//             { label: "Notifications", icon: "bi-bell", path: "/admin/notifications", },
//             { label: "Settings", icon: "bi-gear", path: "/admin/settings" },
//         ],
//     },
// ];

// function AdminSidebar({ open, onClose }) {
//     const navigate = useNavigate();

//     return (
//         <>
//             {/* Mobile overlay */}
//             {open && (
//                 <div
//                     className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
//                     style={{
//                         zIndex: 1040,
//                         backgroundColor: "rgba(0,0,0,0.45)",
//                     }}
//                     onClick={onClose}
//                 />
//             )}

//             <aside
//                 className={`admin-sidebar d-flex flex-column ${open ? "admin-sidebar-open" : ""
//                     }`}
//                 style={{
//                     width: "260px",
//                     minWidth: "260px",
//                     height: "100dvh",
//                     backgroundColor: "var(--color-surface)",
//                     borderRight: "1px solid var(--color-border)",
//                     position: "relative",
//                     zIndex: 1041,
//                 }}
//             >
//                 {/* Brand */}
//                 <div
//                     className="d-flex align-items-center gap-2 px-4"
//                     style={{
//                         height: "72px",
//                         borderBottom: "1px solid var(--color-border-light)",
//                     }}
//                 >
//                     <div
//                         className="d-flex align-items-center justify-content-center fw-bold"
//                         style={{
//                             width: "38px",
//                             height: "38px",
//                             borderRadius: "var(--radius-md)",
//                             backgroundColor: "var(--color-primary)",
//                             color: "var(--color-white)",
//                         }}
//                     >
//                         C
//                     </div>

//                     <div className="flex-grow-1">
//                         <div
//                             className="fw-bold"
//                             style={{
//                                 fontSize: "19px",
//                                 color: "var(--color-text-primary)",
//                             }}
//                         >
//                             Caché
//                         </div>
//                         <div
//                             style={{
//                                 fontSize: "11px",
//                                 color: "var(--color-text-muted)",
//                             }}
//                         >
//                             ADMIN PANEL
//                         </div>
//                     </div>

//                     <button
//                         type="button"
//                         className="btn border-0 p-1 d-lg-none"
//                         onClick={onClose}
//                         style={{ color: "var(--color-text-secondary)" }}
//                     >
//                         <i className="bi bi-x-lg" />
//                     </button>
//                 </div>

//                 {/* Navigation */}
//                 <div className="flex-grow-1 overflow-auto px-3 py-3">
//                     {menuGroups.map((group) => (
//                         <div key={group.title} className="mb-4">
//                             <div
//                                 className="px-2 mb-2 fw-semibold"
//                                 style={{
//                                     fontSize: "10px",
//                                     letterSpacing: "1px",
//                                     color: "var(--color-text-muted)",
//                                 }}
//                             >
//                                 {group.title}
//                             </div>

//                             {group.items.map((item) => (
//                                 <NavLink
//                                     key={item.path}
//                                     to={item.path}
//                                     end={item.path === "/admin"}
//                                     onClick={onClose}
//                                     className="admin-nav-link d-flex align-items-center gap-3 px-3 py-2 mb-1 text-decoration-none"
//                                     style={({ isActive }) => ({
//                                         color: isActive
//                                             ? "var(--color-primary)"
//                                             : "var(--color-text-secondary)",
//                                         backgroundColor: isActive
//                                             ? "var(--color-primary-light)"
//                                             : "transparent",
//                                         borderRadius: "var(--radius-md)",
//                                         fontSize: "14px",
//                                         fontWeight: isActive ? 600 : 500,
//                                     })}
//                                 >
//                                     <i className={`bi ${item.icon} fs-5`} />
//                                     <span>{item.label}</span>

//                                     {item.label === "Reports" && (
//                                         <span
//                                             className="ms-auto rounded-pill px-2"
//                                             style={{
//                                                 fontSize: "11px",
//                                                 backgroundColor: "var(--color-danger-light)",
//                                                 color: "var(--color-danger)",
//                                             }}
//                                         >
//                                             8
//                                         </span>
//                                     )}
//                                 </NavLink>
//                             ))}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bottom section */}
//                 <div
//                     className="p-3"
//                     style={{ borderTop: "1px solid var(--color-border-light)" }}
//                 >
//                     <button
//                         type="button"
//                         onClick={() => navigate("/home")}
//                         className="btn w-100 d-flex align-items-center gap-2"
//                         style={{
//                             color: "var(--color-text-secondary)",
//                             backgroundColor: "var(--color-surface-secondary)",
//                             borderRadius: "var(--radius-md)",
//                             fontSize: "13px",
//                         }}
//                     >
//                         <i className="bi bi-box-arrow-left" />
//                         Back to Caché
//                     </button>
//                 </div>
//             </aside>
//         </>
//     );
// }

// export default AdminSidebar;
