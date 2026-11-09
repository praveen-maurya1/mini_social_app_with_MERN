
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";

// import AdminSidebar from "../../components/admin/AdminSidebar";
// import AdminTopbar from "../../components/admin/AdminTopbar";

// function AdminLayout() {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     return (
//         <div
//             className="d-flex w-100"
//             style={{
//                 height: "100dvh",
//                 overflow: "hidden",
//                 backgroundColor: "var(--color-background)",
//             }}
//         >
//             <AdminSidebar
//                 open={sidebarOpen}
//                 onClose={() => setSidebarOpen(false)}
//             />

//             <div
//                 className="d-flex flex-column flex-grow-1"
//                 style={{
//                     minWidth: 0,
//                     height: "100dvh",
//                 }}
//             >
//                 <AdminTopbar
//                     onMenuClick={() => setSidebarOpen(true)}
//                 />

//                 <main
//                     className="flex-grow-1 overflow-auto"
//                     style={{
//                         minHeight: 0,
//                         backgroundColor: "var(--color-background)",
//                     }}
//                 >
//                     <div className="p-3 p-md-4">
//                         <Outlet />
//                     </div>
//                 </main>
//             </div>

//             <style>{`
//                 @media (max-width: 991.98px) {
//                     .admin-sidebar {
//                         position: fixed !important;
//                         top: 0;
//                         left: 0;
//                         height: 100dvh !important;
//                         transform: translateX(-100%);
//                         transition: transform 0.25s ease;
//                     }

//                     .admin-sidebar.admin-sidebar-open {
//                         transform: translateX(0);
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default AdminLayout;
