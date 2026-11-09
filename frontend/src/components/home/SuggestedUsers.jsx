// import React from "react";
// import users from "../../data/users";

// function SuggestedUsers() {
//     const suggestedUsers = users.slice(0, 4);

//     return (
//         <section
//             className="p-3"
//             style={{
//                 backgroundColor: "var(--color-surface)",
//                 border: "1px solid var(--color-border)",
//                 borderRadius: "var(--radius-lg)",
//                 boxShadow: "var(--shadow-sm)",
//             }}
//         >
//             {/* Header */}
//             <div className="d-flex align-items-center justify-content-between mb-3">
//                 <h6
//                     className="mb-0 fw-bold"
//                     style={{
//                         color: "var(--color-text-primary)",
//                     }}
//                 >
//                     Suggested for You
//                 </h6>

//                 <button
//                     type="button"
//                     className="btn btn-sm border-0 p-0"
//                     style={{
//                         color: "var(--color-primary)",
//                     }}
//                 >
//                     See all
//                 </button>
//             </div>

//             {/* Users */}
//             <div className="d-flex flex-column gap-3">
//                 {suggestedUsers.map((user) => (
//                     <div
//                         key={user.id || user._id}
//                         className="d-flex align-items-center gap-2"
//                     >
//                         {/* Avatar */}
//                         <img
//                             src={user.avatar}
//                             alt={user.name}
//                             width="42"
//                             height="42"
//                             className="rounded-circle flex-shrink-0"
//                             style={{
//                                 objectFit: "cover",
//                             }}
//                         />

//                         {/* User Info */}
//                         <div className="flex-grow-1 overflow-hidden">
//                             <div
//                                 className="fw-semibold text-truncate"
//                                 style={{
//                                     color: "var(--color-text-primary)",
//                                     fontSize: "14px",
//                                 }}
//                             >
//                                 {user.name}
//                             </div>

//                             <div
//                                 className="text-truncate"
//                                 style={{
//                                     color: "var(--color-text-muted)",
//                                     fontSize: "12px",
//                                 }}
//                             >
//                                 @{user.username}
//                             </div>
//                         </div>

//                         {/* Follow */}
//                         <button
//                             type="button"
//                             className="btn btn-sm px-3"
//                             style={{
//                                 color: "var(--color-primary)",
//                                 backgroundColor: "var(--color-primary-light)",
//                                 borderRadius: "var(--radius-pill)",
//                                 fontSize: "12px",
//                                 fontWeight: 600,
//                             }}
//                         >
//                             Follow
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }

// export default SuggestedUsers;




import ComingSoon from "../commonModule/CommingSoon";

function SuggestedUsers() {
    return <ComingSoon title="SuggestedUsers" />;
}

export default SuggestedUsers;