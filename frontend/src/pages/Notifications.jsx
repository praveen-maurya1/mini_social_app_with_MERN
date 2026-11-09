
// import React, { useState } from "react";

// import Sidebar from "../components/layout/Sidebar";
// import Topbar from "../components/layout/Topbar";
// import MobileNav from "../components/layout/MobileNav";

// import NotificationItem from "../components/notifications/NotificationItem";
// import notificationsData from "../data/notifications";

// function Notifications() {
//     const [notifications, setNotifications] = useState(notificationsData);
//     const [activeFilter, setActiveFilter] = useState("All");

//     const markAsRead = (id) => {
//         setNotifications((prev) =>
//             prev.map((item) =>
//                 item.id === id ? { ...item, read: true } : item
//             )
//         );
//     };

//     const markAllAsRead = () => {
//         setNotifications((prev) =>
//             prev.map((item) => ({ ...item, read: true }))
//         );
//     };

//     const filteredNotifications = notifications.filter((item) => {
//         if (activeFilter === "Unread") return !item.read;
//         if (activeFilter === "Mentions") return item.type === "mention";
//         return true;
//     });

//     const groupedNotifications = ["Today", "Yesterday", "Earlier"]
//         .map((date) => ({
//             date,
//             items: filteredNotifications.filter(
//                 (item) => item.date === date
//             ),
//         }))
//         .filter((group) => group.items.length > 0);

//     const filters = ["All", "Unread", "Mentions"];

//     return (
//         <div
//             style={{
//                 height: "100vh",
//                 overflow: "hidden",
//                 backgroundColor: "var(--color-background)",
//                 color: "var(--color-text-primary)",
//             }}
//         >
//             <div className="d-flex h-100">

//                 {/* Desktop Sidebar */}
//                 <div className="d-none d-lg-block flex-shrink-0">
//                     <Sidebar />
//                 </div>

//                 {/* Main Area */}
//                 <div className="flex-grow-1 min-vw-0 d-flex flex-column h-100">
//                     <Topbar />

//                     <div
//                         className="container-fluid flex-grow-1 p-0"
//                         style={{ overflow: "hidden" }}
//                     >
//                         <div className="row h-100 g-0">

//                             {/* Notifications Content */}
//                             <main
//                                 className="col-12 col-lg-8 col-xl-8 main-feed-scroll"
//                                 style={{
//                                     height: "100%",
//                                     overflowY: "auto",
//                                     overflowX: "hidden",
//                                 }}
//                             >
//                                 <div className="container py-lg-4 mb-lg-0 mb-5">

//                                     {/* Header */}
//                                     <div className="d-flex align-items-center justify-content-between pt-3 pb-3">
//                                         <div>
//                                             <h4 className="fw-bold mb-1">
//                                                 Notifications
//                                             </h4>

//                                             <p
//                                                 className="mb-0"
//                                                 style={{
//                                                     color: "var(--color-text-muted)",
//                                                     fontSize: "13px",
//                                                 }}
//                                             >
//                                                 Stay updated with your activity.
//                                             </p>
//                                         </div>

//                                         <button
//                                             type="button"
//                                             onClick={markAllAsRead}
//                                             className="btn btn-sm border-0"
//                                             style={{
//                                                 color: "var(--color-primary)",
//                                                 fontWeight: 600,
//                                             }}
//                                         >
//                                             Mark all as read
//                                         </button>
//                                     </div>

//                                     {/* Filters */}
//                                     <div className="d-flex gap-2 mb-3">
//                                         {filters.map((filter) => (
//                                             <button
//                                                 key={filter}
//                                                 type="button"
//                                                 onClick={() => setActiveFilter(filter)}
//                                                 className="btn btn-sm px-3"
//                                                 style={{
//                                                     borderRadius: "var(--radius-pill)",
//                                                     backgroundColor:
//                                                         activeFilter === filter
//                                                             ? "var(--color-primary)"
//                                                             : "var(--color-surface)",
//                                                     color:
//                                                         activeFilter === filter
//                                                             ? "var(--color-white)"
//                                                             : "var(--color-text-secondary)",
//                                                     border:
//                                                         activeFilter === filter
//                                                             ? "1px solid var(--color-primary)"
//                                                             : "1px solid var(--color-border)",
//                                                 }}
//                                             >
//                                                 {filter}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {/* Notification Groups */}
//                                     {groupedNotifications.length > 0 ? (
//                                         groupedNotifications.map((group) => (
//                                             <section
//                                                 key={group.date}
//                                                 className="mb-4"
//                                             >
//                                                 <h6
//                                                     className="fw-bold mb-2"
//                                                     style={{
//                                                         color: "var(--color-text-primary)",
//                                                     }}
//                                                 >
//                                                     {group.date}
//                                                 </h6>

//                                                 <div
//                                                     className="overflow-hidden"
//                                                     style={{
//                                                         backgroundColor: "var(--color-surface)",
//                                                         border: "1px solid var(--color-border)",
//                                                         borderRadius: "var(--radius-lg)",
//                                                     }}
//                                                 >
//                                                     {group.items.map((item, index) => (
//                                                         <React.Fragment key={item.id}>
//                                                             <NotificationItem
//                                                                 notification={item}
//                                                                 onRead={markAsRead}
//                                                             />

//                                                             {index !== group.items.length - 1 && (
//                                                                 <div
//                                                                     style={{
//                                                                         borderTop: "1px solid var(--color-border-light)",
//                                                                     }}
//                                                                 />
//                                                             )}
//                                                         </React.Fragment>
//                                                     ))}
//                                                 </div>
//                                             </section>
//                                         ))
//                                     ) : (
//                                         <div className="text-center py-5">
//                                             <i
//                                                 className="bi bi-bell-slash"
//                                                 style={{
//                                                     fontSize: "42px",
//                                                     color: "var(--color-text-muted)",
//                                                 }}
//                                             />

//                                             <h6 className="fw-semibold mt-3">
//                                                 No notifications found
//                                             </h6>

//                                             <p
//                                                 className="small"
//                                                 style={{
//                                                     color: "var(--color-text-muted)",
//                                                 }}
//                                             >
//                                                 You're all caught up!
//                                             </p>
//                                         </div>
//                                     )}

//                                 </div>
//                             </main>

//                             {/* Desktop Right Sidebar */}
//                             <aside
//                                 className="d-none d-lg-block col-lg-4 col-xl-4"
//                                 style={{
//                                     height: "100%",
//                                     overflowY: "auto",
//                                     overflowX: "hidden",
//                                 }}
//                             >
//                                 <div className="py-4 pe-3">
//                                     <div
//                                         className="p-4"
//                                         style={{
//                                             backgroundColor: "var(--color-surface)",
//                                             border: "1px solid var(--color-border)",
//                                             borderRadius: "var(--radius-lg)",
//                                             boxShadow: "var(--shadow-sm)",
//                                         }}
//                                     >
//                                         <h6 className="fw-bold mb-2">
//                                             Your activity
//                                         </h6>

//                                         <p
//                                             className="small mb-0"
//                                             style={{
//                                                 color: "var(--color-text-muted)",
//                                             }}
//                                         >
//                                             Notifications help you stay connected
//                                             with your community.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </aside>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <MobileNav />
//         </div>
//     );
// }

// export default Notifications;






import ComingSoon from "../components/commonModule/CommingSoon";

function Search() {
    return <ComingSoon title="Search" />;
}

export default Search;