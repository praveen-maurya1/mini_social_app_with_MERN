
// import React from "react";

// const stats = [
//     {
//         title: "Total Users",
//         value: "12,840",
//         change: "+12.8%",
//         icon: "bi-people",
//         color: "var(--color-primary)",
//         bg: "var(--color-primary-light)",
//     },
//     {
//         title: "Active Users",
//         value: "8,426",
//         change: "+8.2%",
//         icon: "bi-person-check",
//         color: "var(--color-success)",
//         bg: "var(--color-success-light)",
//     },
//     {
//         title: "Total Posts",
//         value: "24,568",
//         change: "+18.5%",
//         icon: "bi-file-post",
//         color: "var(--color-info)",
//         bg: "var(--color-info-light)",
//     },
//     {
//         title: "Pending Reports",
//         value: "38",
//         change: "Needs attention",
//         icon: "bi-flag",
//         color: "var(--color-danger)",
//         bg: "var(--color-danger-light)",
//     },
// ];

// const recentActivities = [
//     {
//         user: "Rahul Sharma",
//         action: "created a new post",
//         time: "2 minutes ago",
//         icon: "bi-file-post",
//     },
//     {
//         user: "Ananya Singh",
//         action: "joined Caché",
//         time: "15 minutes ago",
//         icon: "bi-person-plus",
//     },
//     {
//         user: "Amit Verma",
//         action: "reported a post",
//         time: "32 minutes ago",
//         icon: "bi-flag",
//     },
//     {
//         user: "Priya Gupta",
//         action: "commented on a post",
//         time: "1 hour ago",
//         icon: "bi-chat-left-text",
//     },
//     {
//         user: "Karan Mehta",
//         action: "updated profile",
//         time: "2 hours ago",
//         icon: "bi-person",
//     },
// ];

// const topPosts = [
//     {
//         user: "Rahul Sharma",
//         content: "Beautiful evening at the mountains! 🌄",
//         likes: "2,450",
//         comments: "328",
//     },
//     {
//         user: "Priya Gupta",
//         content: "A little progress every day adds up.",
//         likes: "1,820",
//         comments: "214",
//     },
//     {
//         user: "Aman Verma",
//         content: "Sharing some moments from my recent trip.",
//         likes: "1,540",
//         comments: "186",
//     },
// ];

// function AdminDashboard() {
//     return (
//         <div>
//             {/* Page Heading */}
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
//                 <div>
//                     <h4
//                         className="fw-bold mb-1"
//                         style={{ color: "var(--color-text-primary)" }}
//                     >
//                         Dashboard Overview
//                     </h4>
//                     <p
//                         className="mb-0 small"
//                         style={{ color: "var(--color-text-muted)" }}
//                     >
//                         Here's what's happening on your platform today.
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     className="btn btn-sm d-flex align-items-center gap-2 px-3"
//                     style={{
//                         color: "var(--color-primary)",
//                         backgroundColor: "var(--color-primary-light)",
//                         borderRadius: "var(--radius-md)",
//                     }}
//                 >
//                     <i className="bi bi-download" />
//                     Export Report
//                 </button>
//             </div>

//             {/* Statistics */}
//             <div className="row g-3 mb-4">
//                 {stats.map((stat) => (
//                     <div className="col-12 col-sm-6 col-xl-3" key={stat.title}>
//                         <div
//                             className="p-3 h-100"
//                             style={{
//                                 backgroundColor: "var(--color-surface)",
//                                 border: "1px solid var(--color-border)",
//                                 borderRadius: "var(--radius-lg)",
//                                 boxShadow: "var(--shadow-sm)",
//                             }}
//                         >
//                             <div className="d-flex align-items-center justify-content-between mb-3">
//                                 <span
//                                     className="small fw-medium"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                 >
//                                     {stat.title}
//                                 </span>

//                                 <div
//                                     className="d-flex align-items-center justify-content-center rounded-3"
//                                     style={{
//                                         width: "42px",
//                                         height: "42px",
//                                         backgroundColor: stat.bg,
//                                         color: stat.color,
//                                     }}
//                                 >
//                                     <i className={`bi ${stat.icon} fs-5`} />
//                                 </div>
//                             </div>

//                             <h3
//                                 className="fw-bold mb-2"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 {stat.value}
//                             </h3>

//                             <small
//                                 style={{
//                                     color:
//                                         stat.title === "Pending Reports"
//                                             ? "var(--color-danger)"
//                                             : "var(--color-success)",
//                                 }}
//                             >
//                                 {stat.title === "Pending Reports"
//                                     ? stat.change
//                                     : `${stat.change} from last month`}
//                             </small>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Main Dashboard Sections */}
//             <div className="row g-3">
//                 {/* Activity */}
//                 <div className="col-12 col-xl-7">
//                     <div
//                         className="p-3 p-md-4 h-100"
//                         style={{
//                             backgroundColor: "var(--color-surface)",
//                             border: "1px solid var(--color-border)",
//                             borderRadius: "var(--radius-lg)",
//                         }}
//                     >
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <div>
//                                 <h6
//                                     className="fw-semibold mb-1"
//                                     style={{ color: "var(--color-text-primary)" }}
//                                 >
//                                     Recent Activity
//                                 </h6>
//                                 <small style={{ color: "var(--color-text-muted)" }}>
//                                     Latest platform activities
//                                 </small>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="btn btn-sm"
//                                 style={{ color: "var(--color-primary)" }}
//                             >
//                                 View all
//                             </button>
//                         </div>

//                         {recentActivities.map((activity, index) => (
//                             <div
//                                 key={index}
//                                 className="d-flex align-items-center gap-3 py-3"
//                                 style={{
//                                     borderBottom:
//                                         index !== recentActivities.length - 1
//                                             ? "1px solid var(--color-border-light)"
//                                             : "none",
//                                 }}
//                             >
//                                 <div
//                                     className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
//                                     style={{
//                                         width: "40px",
//                                         height: "40px",
//                                         backgroundColor: "var(--color-primary-light)",
//                                         color: "var(--color-primary)",
//                                     }}
//                                 >
//                                     <i className={`bi ${activity.icon}`} />
//                                 </div>

//                                 <div className="flex-grow-1">
//                                     <div
//                                         className="small"
//                                         style={{ color: "var(--color-text-primary)" }}
//                                     >
//                                         <strong>{activity.user}</strong>{" "}
//                                         {activity.action}
//                                     </div>
//                                     <small style={{ color: "var(--color-text-muted)" }}>
//                                         {activity.time}
//                                     </small>
//                                 </div>

//                                 <i
//                                     className="bi bi-three-dots"
//                                     style={{ color: "var(--color-text-muted)" }}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Top Posts */}
//                 <div className="col-12 col-xl-5">
//                     <div
//                         className="p-3 p-md-4 h-100"
//                         style={{
//                             backgroundColor: "var(--color-surface)",
//                             border: "1px solid var(--color-border)",
//                             borderRadius: "var(--radius-lg)",
//                         }}
//                     >
//                         <div className="mb-3">
//                             <h6
//                                 className="fw-semibold mb-1"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 Top Performing Posts
//                             </h6>
//                             <small style={{ color: "var(--color-text-muted)" }}>
//                                 Popular posts on Caché
//                             </small>
//                         </div>

//                         {topPosts.map((post, index) => (
//                             <div
//                                 key={index}
//                                 className="py-3"
//                                 style={{
//                                     borderBottom:
//                                         index !== topPosts.length - 1
//                                             ? "1px solid var(--color-border-light)"
//                                             : "none",
//                                 }}
//                             >
//                                 <div className="d-flex align-items-center gap-2 mb-2">
//                                     <div
//                                         className="rounded-circle d-flex align-items-center justify-content-center"
//                                         style={{
//                                             width: "32px",
//                                             height: "32px",
//                                             backgroundColor: "var(--color-primary-light)",
//                                             color: "var(--color-primary)",
//                                             fontSize: "12px",
//                                             fontWeight: 600,
//                                         }}
//                                     >
//                                         {post.user.charAt(0)}
//                                     </div>

//                                     <span
//                                         className="small fw-semibold"
//                                         style={{ color: "var(--color-text-primary)" }}
//                                     >
//                                         {post.user}
//                                     </span>
//                                 </div>

//                                 <p
//                                     className="small mb-2"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                 >
//                                     {post.content}
//                                 </p>

//                                 <div
//                                     className="d-flex gap-3 small"
//                                     style={{ color: "var(--color-text-muted)" }}
//                                 >
//                                     <span>
//                                         <i className="bi bi-heart me-1" />
//                                         {post.likes}
//                                     </span>
//                                     <span>
//                                         <i className="bi bi-chat me-1" />
//                                         {post.comments}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Quick Overview */}
//             <div className="row g-3 mt-1">
//                 <div className="col-12">
//                     <div
//                         className="p-3 p-md-4"
//                         style={{
//                             backgroundColor: "var(--color-surface)",
//                             border: "1px solid var(--color-border)",
//                             borderRadius: "var(--radius-lg)",
//                         }}
//                     >
//                         <h6
//                             className="fw-semibold mb-3"
//                             style={{ color: "var(--color-text-primary)" }}
//                         >
//                             Platform Overview
//                         </h6>

//                         <div className="row g-3">
//                             {[
//                                 { label: "Pending User Reports", value: "24", icon: "bi-flag", color: "var(--color-danger)" },
//                                 { label: "Posts Under Review", value: "14", icon: "bi-eye", color: "var(--color-warning)" },
//                                 { label: "New Users Today", value: "186", icon: "bi-person-plus", color: "var(--color-success)" },
//                                 { label: "Comments Today", value: "1,245", icon: "bi-chat-left-text", color: "var(--color-info)" },
//                             ].map((item) => (
//                                 <div className="col-6 col-md-3" key={item.label}>
//                                     <div className="d-flex align-items-center gap-2">
//                                         <i
//                                             className={`bi ${item.icon} fs-4`}
//                                             style={{ color: item.color }}
//                                         />
//                                         <div>
//                                             <div
//                                                 className="fw-bold"
//                                                 style={{ color: "var(--color-text-primary)" }}
//                                             >
//                                                 {item.value}
//                                             </div>
//                                             <small
//                                                 style={{ color: "var(--color-text-muted)" }}
//                                             >
//                                                 {item.label}
//                                             </small>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminDashboard;
