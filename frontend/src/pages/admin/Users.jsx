
// import React, { useMemo, useState } from "react";
// import adminUsers from "../../data/adminData";

// const initialForm = {
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     role: "user",
//     verified: false,
// };


// function Users() {
//     const [users, setUsers] = useState(adminUsers);
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("all");

//     const [showForm, setShowForm] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [viewingUser, setViewingUser] = useState(null);

//     const [confirmAction, setConfirmAction] = useState(null);
//     const [form, setForm] = useState(initialForm);

//     const [currentPage, setCurrentPage] = useState(1);
//     const pageSize = 5;

//     // ================= STATISTICS =================

//     const stats = [
//         {
//             label: "Total Users",
//             value: users.length,
//             icon: "bi-people",
//             color: "var(--color-primary)",
//             bg: "var(--color-primary-light)",
//         },
//         {
//             label: "Active Users",
//             value: users.filter((u) => u.status === "active").length,
//             icon: "bi-person-check",
//             color: "var(--color-success)",
//             bg: "var(--color-success-light)",
//         },
//         {
//             label: "Blocked Users",
//             value: users.filter((u) => u.status === "blocked").length,
//             icon: "bi-person-x",
//             color: "var(--color-danger)",
//             bg: "var(--color-danger-light)",
//         },
//         {
//             label: "Suspended Users",
//             value: users.filter((u) => u.status === "suspended").length,
//             icon: "bi-person-lock",
//             color: "var(--color-warning)",
//             bg: "var(--color-warning-light)",
//         },
//     ];

//     // ================= FILTER USERS =================

//     const filteredUsers = useMemo(() => {
//         return users.filter((user) => {
//             const matchesSearch = [
//                 user.name,
//                 user.username,
//                 user.email,
//             ].some((value) =>
//                 value.toLowerCase().includes(search.toLowerCase())
//             );

//             const matchesFilter =
//                 filter === "all" || user.status === filter;

//             return matchesSearch && matchesFilter;
//         });
//     }, [users, search, filter]);

//     const totalPages = Math.max(
//         1,
//         Math.ceil(filteredUsers.length / pageSize)
//     );

//     const paginatedUsers = filteredUsers.slice(
//         (currentPage - 1) * pageSize,
//         currentPage * pageSize
//     );

//     // ================= CREATE / EDIT =================

//     const openCreateDialog = () => {
//         setEditingUser(null);
//         setForm(initialForm);
//         setShowForm(true);
//     };

//     const openEditDialog = (user) => {
//         setEditingUser(user);
//         setForm({
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             phone: user.phone,
//             role: user.role,
//             verified: user.verified,
//         });
//         setShowForm(true);
//     };

//     const handleFormChange = (event) => {
//         const { name, value, type, checked } = event.target;

//         setForm((previous) => ({
//             ...previous,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleSaveUser = (event) => {
//         event.preventDefault();

//         if (editingUser) {
//             setUsers((previous) =>
//                 previous.map((user) =>
//                     user.id === editingUser.id
//                         ? { ...user, ...form }
//                         : user
//                 )
//             );
//         } else {
//             const newUser = {
//                 ...form,
//                 id: Date.now(),
//                 avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
//                 status: "active",
//                 joined: new Date().toISOString().slice(0, 10),
//                 posts: 0,
//                 followers: 0,
//             };

//             setUsers((previous) => [newUser, ...previous]);
//             setCurrentPage(1);
//             setFilter("all");
//             setSearch("");
//         }

//         setShowForm(false);
//         setEditingUser(null);
//     };

//     // ================= CONFIRM ACTIONS =================

//     const openConfirmation = (user, action) => {
//         setConfirmAction({ user, action });
//     };

//     const executeAction = () => {
//         if (!confirmAction) return;

//         const { user, action } = confirmAction;

//         if (action === "delete") {
//             setUsers((previous) =>
//                 previous.filter((item) => item.id !== user.id)
//             );
//         }

//         if (action === "block") {
//             setUsers((previous) =>
//                 previous.map((item) =>
//                     item.id === user.id
//                         ? { ...item, status: "blocked" }
//                         : item
//                 )
//             );
//         }

//         if (action === "suspend") {
//             setUsers((previous) =>
//                 previous.map((item) =>
//                     item.id === user.id
//                         ? { ...item, status: "suspended" }
//                         : item
//                 )
//             );
//         }

//         if (action === "unblock" || action === "activate") {
//             setUsers((previous) =>
//                 previous.map((item) =>
//                     item.id === user.id
//                         ? { ...item, status: "active" }
//                         : item
//                 )
//             );
//         }

//         // Give Verification Badge
//         if (action === "verify") {
//             setUsers((previous) =>
//                 previous.map((item) =>
//                     item.id === user.id
//                         ? { ...item, verified: true }
//                         : item
//                 )
//             );
//         }

//         // Remove Verification Badge
//         if (action === "unverify") {
//             setUsers((previous) =>
//                 previous.map((item) =>
//                     item.id === user.id
//                         ? { ...item, verified: false }
//                         : item
//                 )
//             );
//         }

//         setConfirmAction(null);
//         setViewingUser(null);
//     };

//     // ================= STATUS BADGE =================

//     const statusStyle = (status) => {
//         const styles = {
//             active: {
//                 color: "var(--color-success)",
//                 backgroundColor: "var(--color-success-light)",
//             },
//             blocked: {
//                 color: "var(--color-danger)",
//                 backgroundColor: "var(--color-danger-light)",
//             },
//             suspended: {
//                 color: "var(--color-warning)",
//                 backgroundColor: "var(--color-warning-light)",
//             },
//         };

//         return styles[status] || styles.active;
//     };

//     const confirmationDetails = {
//         block: {
//             title: "Block User?",
//             description:
//                 "This user will no longer be able to access their Caché account. You can unblock them later.",
//             button: "Yes, Block User",
//             icon: "bi-person-x",
//             color: "var(--color-danger)",
//             bg: "var(--color-danger-light)",
//         },

//         unblock: {
//             title: "Unblock User?",
//             description:
//                 "This will restore the user's account access.",
//             button: "Yes, Unblock",
//             icon: "bi-person-check",
//             color: "var(--color-success)",
//             bg: "var(--color-success-light)",
//         },

//         suspend: {
//             title: "Suspend Account?",
//             description:
//                 "This account will be temporarily suspended and the user will not be able to access their account until reactivated.",
//             button: "Yes, Suspend",
//             icon: "bi-person-lock",
//             color: "var(--color-warning)",
//             bg: "var(--color-warning-light)",
//         },

//         activate: {
//             title: "Activate Account?",
//             description:
//                 "This will reactivate the user's suspended account.",
//             button: "Yes, Activate",
//             icon: "bi-person-check",
//             color: "var(--color-success)",
//             bg: "var(--color-success-light)",
//         },

//         verify: {
//             title: "Verify User?",
//             description:
//                 "This user will receive a verified badge on their Caché profile. Confirm that this account is eligible for verification.",
//             button: "Yes, Verify User",
//             icon: "bi-patch-check-fill",
//             color: "var(--color-primary)",
//             bg: "var(--color-primary-light)",
//         },

//         unverify: {
//             title: "Remove Verification?",
//             description:
//                 "The verified badge will be removed from this user's Caché profile.",
//             button: "Yes, Remove Badge",
//             icon: "bi-patch-minus",
//             color: "var(--color-warning)",
//             bg: "var(--color-warning-light)",
//         },

//         delete: {
//             title: "Delete User Permanently?",
//             description:
//                 "This user will be permanently removed from the current users list. This action cannot be undone.",
//             button: "Yes, Delete User",
//             icon: "bi-trash",
//             color: "var(--color-danger)",
//             bg: "var(--color-danger-light)",
//         },
//     };
//     const currentConfirmation = confirmAction
//         ? confirmationDetails[confirmAction.action]
//         : null;

//     // ================= RENDER =================

//     return (
//         <div>
//             {/* Page Header */}
//             <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//                 <div>
//                     <h4
//                         className="fw-bold mb-1"
//                         style={{ color: "var(--color-text-primary)" }}
//                     >
//                         User Management
//                     </h4>

//                     <p
//                         className="small mb-0"
//                         style={{ color: "var(--color-text-muted)" }}
//                     >
//                         Manage, monitor and control your platform users.
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     className="btn d-flex align-items-center gap-2 px-3"
//                     onClick={openCreateDialog}
//                     style={{
//                         backgroundColor: "var(--color-primary)",
//                         color: "var(--color-white)",
//                         borderRadius: "var(--radius-md)",
//                     }}
//                 >
//                     <i className="bi bi-plus-lg" />
//                     Add New User
//                 </button>
//             </div>

//             {/* Statistics */}
//             <div className="row g-3 mb-4">
//                 {stats.map((stat) => (
//                     <div className="col-6 col-xl-3" key={stat.label}>
//                         <div
//                             className="p-3 h-100"
//                             style={{
//                                 backgroundColor: "var(--color-surface)",
//                                 border: "1px solid var(--color-border)",
//                                 borderRadius: "var(--radius-lg)",
//                                 boxShadow: "var(--shadow-sm)",
//                             }}
//                         >
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <span
//                                     className="small"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                 >
//                                     {stat.label}
//                                 </span>

//                                 <div
//                                     className="d-flex align-items-center justify-content-center rounded-3"
//                                     style={{
//                                         width: "38px",
//                                         height: "38px",
//                                         color: stat.color,
//                                         backgroundColor: stat.bg,
//                                     }}
//                                 >
//                                     <i className={`bi ${stat.icon} fs-5`} />
//                                 </div>
//                             </div>

//                             <h3
//                                 className="fw-bold mb-0"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 {stat.value}
//                             </h3>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Users Table */}
//             <div
//                 className="p-3 p-md-4"
//                 style={{
//                     backgroundColor: "var(--color-surface)",
//                     border: "1px solid var(--color-border)",
//                     borderRadius: "var(--radius-lg)",
//                 }}
//             >
//                 {/* Search and Filters */}
//                 <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
//                     <div
//                         className="d-flex align-items-center gap-2 px-3"
//                         style={{
//                             maxWidth: "380px",
//                             width: "100%",
//                             height: "42px",
//                             backgroundColor: "var(--color-surface-secondary)",
//                             borderRadius: "var(--radius-md)",
//                         }}
//                     >
//                         <i
//                             className="bi bi-search"
//                             style={{ color: "var(--color-text-muted)" }}
//                         />

//                         <input
//                             type="text"
//                             className="form-control border-0 shadow-none p-0"
//                             placeholder="Search name, username or email..."
//                             value={search}
//                             onChange={(event) => {
//                                 setSearch(event.target.value);
//                                 setCurrentPage(1);
//                             }}
//                             style={{
//                                 backgroundColor: "transparent",
//                                 color: "var(--color-text-primary)",
//                                 fontSize: "13px",
//                             }}
//                         />
//                     </div>

//                     <div className="d-flex gap-2 flex-wrap">
//                         {[
//                             { label: "All", value: "all" },
//                             { label: "Active", value: "active" },
//                             { label: "Blocked", value: "blocked" },
//                             { label: "Suspended", value: "suspended" },
//                         ].map((item) => (
//                             <button
//                                 key={item.value}
//                                 type="button"
//                                 className="btn btn-sm px-3"
//                                 onClick={() => {
//                                     setFilter(item.value);
//                                     setCurrentPage(1);
//                                 }}
//                                 style={{
//                                     backgroundColor:
//                                         filter === item.value
//                                             ? "var(--color-primary)"
//                                             : "var(--color-surface-secondary)",
//                                     color:
//                                         filter === item.value
//                                             ? "var(--color-white)"
//                                             : "var(--color-text-secondary)",
//                                     borderRadius: "var(--radius-pill)",
//                                 }}
//                             >
//                                 {item.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Responsive Table */}
//                 <div className="table-responsive">
//                     <table
//                         className="table align-middle mb-0"
//                         style={{
//                             minWidth: "850px",
//                             color: "var(--color-text-primary)",
//                         }}
//                     >
//                         <thead>
//                             <tr
//                                 style={{
//                                     backgroundColor: "var(--color-surface-secondary)",
//                                     fontSize: "12px",
//                                     color: "var(--color-text-muted)",
//                                 }}
//                             >
//                                 <th className="py-3 px-3 border-0">USER</th>
//                                 <th className="py-3 border-0">ROLE</th>
//                                 <th className="py-3 border-0">STATUS</th>
//                                 <th className="py-3 border-0">VERIFICATION</th>
//                                 <th className="py-3 border-0">JOINED</th>
//                                 <th className="py-3 border-0 text-end px-3">ACTIONS</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {paginatedUsers.map((user, index) => (
//                                 <tr key={user.id}>
//                                     <td className="py-3 px-3">
//                                         <div className="d-flex align-items-center gap-2">
//                                             <img
//                                                 src={user.avatar}
//                                                 alt={user.name}
//                                                 width="40"
//                                                 height="40"
//                                                 className="rounded-circle"
//                                                 style={{ objectFit: "cover" }}
//                                             />

//                                             <div>
//                                                 <div
//                                                     className="small fw-semibold"
//                                                     style={{ color: "var(--color-text-primary)" }}
//                                                 >
//                                                     {user.name}
//                                                 </div>

//                                                 <small
//                                                     style={{ color: "var(--color-text-muted)" }}
//                                                 >
//                                                     @{user.username}
//                                                 </small>
//                                             </div>
//                                         </div>
//                                     </td>

//                                     <td>
//                                         <span
//                                             className="small text-capitalize"
//                                             style={{ color: "var(--color-text-secondary)" }}
//                                         >
//                                             {user.role}
//                                         </span>
//                                     </td>

//                                     <td>
//                                         <span
//                                             className="badge rounded-pill px-2 py-2 text-capitalize"
//                                             style={statusStyle(user.status)}
//                                         >
//                                             {user.status}
//                                         </span>
//                                     </td>

//                                     <td>
//                                         {user.verified ? (
//                                             <span
//                                                 className="small"
//                                                 style={{ color: "var(--color-success)" }}
//                                             >
//                                                 <i className="bi bi-patch-check-fill me-1" />
//                                                 Verified
//                                             </span>
//                                         ) : (
//                                             <span
//                                                 className="small"
//                                                 style={{ color: "var(--color-text-muted)" }}
//                                             >
//                                                 Unverified
//                                             </span>
//                                         )}
//                                     </td>

//                                     <td>
//                                         <small style={{ color: "var(--color-text-secondary)" }}>
//                                             {user.joined}
//                                         </small>
//                                     </td>

//                                     {/* Action Dropdown */}
//                                     <td className="text-end px-3">
//                                         <div
//                                             className="position-relative d-inline-block"
//                                             style={{ zIndex: activeDropdown === user.id ? 100 : 1 }}
//                                         >
//                                             {/* <button
//                                                 type="button"
//                                                 className="btn btn-sm admin-action-btn"
//                                                 onClick={() =>
//                                                     setActiveDropdown(
//                                                         activeDropdown === user.id ? null : user.id
//                                                     )
//                                                 }
//                                             >
//                                                 <i className="bi bi-three-dots"></i>
//                                             </button> */}
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-sm border-0"
//                                                 style={{
//                                                     color: "var(--color-text-secondary)",
//                                                     backgroundColor: "var(--color-surface-secondary)",
//                                                 }}
//                                                 onClick={() =>
//                                                     setActiveDropdown(
//                                                         activeDropdown === user.id ? null : user.id
//                                                     )
//                                                 }
//                                             >
//                                                 <i className="bi bi-three-dots" />
//                                             </button>

//                                             {/* {activeDropdown === user.id && (
//                                                 <div
//                                                     className="admin-user-dropdown shadow"
//                                                     style={{
//                                                         position: "absolute",

//                                                         top: index >= paginatedUsers.length - 2 ? "auto" : "100%",
//                                                         bottom: index >= paginatedUsers.length - 2 ? "100%" : "auto",

//                                                         right: 0,

//                                                         marginTop: index >= paginatedUsers.length - 2 ? "0" : "6px",
//                                                         marginBottom: index >= paginatedUsers.length - 2 ? "6px" : "0",

//                                                         minWidth: "210px",
//                                                         zIndex: 1050,

//                                                         backgroundColor: "var(--color-surface)",
//                                                         border: "1px solid var(--color-border)",
//                                                         borderRadius: "var(--radius-lg)",
//                                                         padding: "6px",
//                                                         textAlign: "left",
//                                                     }}
//                                                 >
//                                                     <button
//                                                         className="dropdown-item"
//                                                         onClick={() => {
//                                                             setViewingUser(user);
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-eye me-2"></i>
//                                                         View Details
//                                                     </button>

//                                                     <button
//                                                         className="dropdown-item"
//                                                         onClick={() => {
//                                                             openEditDialog(user);
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-pencil me-2"></i>
//                                                         Edit User
//                                                     </button>

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item"
//                                                         onClick={() => {
//                                                             openConfirmation(
//                                                                 user,
//                                                                 user.verified ? "unverify" : "verify"
//                                                             );
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i
//                                                             className={`bi ${user.verified
//                                                                 ? "bi-patch-minus"
//                                                                 : "bi-patch-check"
//                                                                 } me-2`}
//                                                         ></i>
//                                                         {user.verified
//                                                             ? "Remove Verification"
//                                                             : "Give Verification"}
//                                                     </button>

//                                                     <hr className="dropdown-divider" />

//                                                     {user.status === "blocked" ? (
//                                                         <button
//                                                             className="dropdown-item"
//                                                             onClick={() => {
//                                                                 openConfirmation(user, "unblock");
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-unlock me-2"></i>
//                                                             Unblock User
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             className="dropdown-item"
//                                                             onClick={() => {
//                                                                 openConfirmation(user, "block");
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-slash-circle me-2"></i>
//                                                             Block User
//                                                         </button>
//                                                     )}

//                                                     {user.status === "suspended" ? (
//                                                         <button
//                                                             className="dropdown-item"
//                                                             onClick={() => {
//                                                                 openConfirmation(user, "activate");
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-check-circle me-2"></i>
//                                                             Activate Account
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             className="dropdown-item"
//                                                             onClick={() => {
//                                                                 openConfirmation(user, "suspend");
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-pause-circle me-2"></i>
//                                                             Suspend Account
//                                                         </button>
//                                                     )}

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item text-danger"
//                                                         onClick={() => {
//                                                             openConfirmation(user, "delete");
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-trash me-2"></i>
//                                                         Delete User
//                                                     </button>
//                                                 </div>
//                                             )} */}
//                                             {activeDropdown === user.id && (
//                                                 <div
//                                                     className="dropdown-menu show dropdown-menu-end p-2 shadow"
//                                                     style={{
//                                                         position: "absolute",
//                                                         top: index >= paginatedUsers.length - 2 ? "auto" : "100%",
//                                                         bottom: index >= paginatedUsers.length - 2 ? "100%" : "auto",
//                                                         right: 0,
//                                                         marginTop: index >= paginatedUsers.length - 2 ? 0 : "6px",
//                                                         marginBottom: index >= paginatedUsers.length - 2 ? "6px" : 0,
//                                                         minWidth: "210px",
//                                                         zIndex: 1050,
//                                                         backgroundColor: "var(--color-surface)",
//                                                         border: "1px solid var(--color-border)",
//                                                         borderRadius: "var(--radius-lg)",
//                                                     }}
//                                                 >
//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             setViewingUser(user);
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-eye me-2" />
//                                                         View Details
//                                                     </button>

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             openEditDialog(user);
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-pencil me-2" />
//                                                         Edit User
//                                                     </button>

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             openConfirmation(
//                                                                 user,
//                                                                 user.verified ? "unverify" : "verify"
//                                                             );
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i
//                                                             className={`bi ${user.verified
//                                                                 ? "bi-patch-minus"
//                                                                 : "bi-patch-check"
//                                                                 } me-2`}
//                                                         />
//                                                         {user.verified
//                                                             ? "Remove Verification"
//                                                             : "Give Verification"}
//                                                     </button>

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             openConfirmation(
//                                                                 user,
//                                                                 user.status === "blocked" ? "unblock" : "block"
//                                                             );
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-shield-lock me-2" />
//                                                         {user.status === "blocked" ? "Unblock User" : "Block User"}
//                                                     </button>

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             openConfirmation(
//                                                                 user,
//                                                                 user.status === "suspended" ? "activate" : "suspend"
//                                                             );
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-person-lock me-2" />
//                                                         {user.status === "suspended"
//                                                             ? "Activate Account"
//                                                             : "Suspend Account"}
//                                                     </button>

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         style={{ color: "var(--color-danger)" }}
//                                                         onClick={() => {
//                                                             openConfirmation(user, "delete");
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-trash me-2" />
//                                                         Delete User
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {filteredUsers.length === 0 && (
//                         <div className="text-center py-5">
//                             <i
//                                 className="bi bi-people fs-1"
//                                 style={{ color: "var(--color-text-muted)" }}
//                             />
//                             <p
//                                 className="mt-2 mb-0"
//                                 style={{ color: "var(--color-text-secondary)" }}
//                             >
//                                 No users found.
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Pagination */}
//                 {filteredUsers.length > 0 && (
//                     <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
//                         <small style={{ color: "var(--color-text-muted)" }}>
//                             Showing{" "}
//                             {(currentPage - 1) * pageSize + 1}–
//                             {Math.min(currentPage * pageSize, filteredUsers.length)}
//                             {" "}of {filteredUsers.length} users
//                         </small>

//                         <div className="d-flex gap-2">
//                             <button
//                                 type="button"
//                                 className="btn btn-sm"
//                                 disabled={currentPage === 1}
//                                 onClick={() => setCurrentPage((p) => p - 1)}
//                                 style={{
//                                     color: "var(--color-text-secondary)",
//                                     backgroundColor: "var(--color-surface-secondary)",
//                                 }}
//                             >
//                                 <i className="bi bi-chevron-left" />
//                             </button>

//                             <span
//                                 className="d-flex align-items-center px-2 small"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 {currentPage} / {totalPages}
//                             </span>

//                             <button
//                                 type="button"
//                                 className="btn btn-sm"
//                                 disabled={currentPage >= totalPages}
//                                 onClick={() => setCurrentPage((p) => p + 1)}
//                                 style={{
//                                     color: "var(--color-text-secondary)",
//                                     backgroundColor: "var(--color-surface-secondary)",
//                                 }}
//                             >
//                                 <i className="bi bi-chevron-right" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* ================= CREATE / EDIT DIALOG ================= */}

//             {showForm && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{
//                         zIndex: 2000,
//                         backgroundColor: "rgba(0,0,0,0.6)",
//                     }}
//                     onClick={() => setShowForm(false)}
//                 >
//                     <div
//                         className="w-100 p-4"
//                         style={{
//                             maxWidth: "500px",
//                             maxHeight: "90dvh",
//                             overflowY: "auto",
//                             backgroundColor: "var(--color-surface)",
//                             borderRadius: "var(--radius-lg)",
//                         }}
//                         onClick={(event) => event.stopPropagation()}
//                     >
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h5
//                                 className="fw-semibold mb-0"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 {editingUser ? "Edit User" : "Create New User"}
//                             </h5>

//                             <button
//                                 type="button"
//                                 className="btn border-0"
//                                 onClick={() => setShowForm(false)}
//                                 style={{ color: "var(--color-text-secondary)" }}
//                             >
//                                 <i className="bi bi-x-lg" />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSaveUser}>
//                             {[
//                                 { label: "Full Name", name: "name", type: "text" },
//                                 { label: "Username", name: "username", type: "text" },
//                                 { label: "Email Address", name: "email", type: "email" },
//                                 { label: "Phone Number", name: "phone", type: "tel" },
//                             ].map((field) => (
//                                 <div className="mb-3" key={field.name}>
//                                     <label
//                                         className="form-label small fw-medium"
//                                         style={{ color: "var(--color-text-secondary)" }}
//                                     >
//                                         {field.label}
//                                     </label>

//                                     <input
//                                         type={field.type}
//                                         name={field.name}
//                                         className="form-control shadow-none"
//                                         value={form[field.name]}
//                                         onChange={handleFormChange}
//                                         required
//                                         style={{
//                                             backgroundColor: "var(--color-surface-secondary)",
//                                             borderColor: "var(--color-border)",
//                                             color: "var(--color-text-primary)",
//                                             borderRadius: "var(--radius-md)",
//                                         }}
//                                     />
//                                 </div>
//                             ))}

//                             <div className="mb-3">
//                                 <label
//                                     className="form-label small fw-medium"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                 >
//                                     Role
//                                 </label>

//                                 <select
//                                     name="role"
//                                     className="form-select shadow-none"
//                                     value={form.role}
//                                     onChange={handleFormChange}
//                                     style={{
//                                         backgroundColor: "var(--color-surface-secondary)",
//                                         borderColor: "var(--color-border)",
//                                         color: "var(--color-text-primary)",
//                                     }}
//                                 >
//                                     <option value="user">User</option>
//                                     <option value="admin">Admin</option>
//                                 </select>
//                             </div>

//                             <div className="form-check mb-4">
//                                 <input
//                                     type="checkbox"
//                                     name="verified"
//                                     id="verified"
//                                     className="form-check-input"
//                                     checked={form.verified}
//                                     onChange={handleFormChange}
//                                 />

//                                 <label
//                                     htmlFor="verified"
//                                     className="form-check-label small"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                 >
//                                     Mark as verified
//                                 </label>
//                             </div>

//                             <div className="d-flex justify-content-end gap-2">
//                                 <button
//                                     type="button"
//                                     className="btn"
//                                     onClick={() => setShowForm(false)}
//                                     style={{
//                                         backgroundColor: "var(--color-surface-secondary)",
//                                         color: "var(--color-text-secondary)",
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     className="btn px-4"
//                                     style={{
//                                         backgroundColor: "var(--color-primary)",
//                                         color: "var(--color-white)",
//                                     }}
//                                 >
//                                     {editingUser ? "Save Changes" : "Create User"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* ================= USER DETAILS DIALOG ================= */}

//             {viewingUser && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{
//                         zIndex: 2000,
//                         backgroundColor: "rgba(0,0,0,0.6)",
//                     }}
//                     onClick={() => setViewingUser(null)}
//                 >
//                     <div
//                         className="w-100 p-4"
//                         style={{
//                             maxWidth: "450px",
//                             backgroundColor: "var(--color-surface)",
//                             borderRadius: "var(--radius-lg)",
//                         }}
//                         onClick={(event) => event.stopPropagation()}
//                     >
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h5
//                                 className="fw-semibold mb-0"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 User Details
//                             </h5>

//                             <button
//                                 type="button"
//                                 className="btn border-0"
//                                 onClick={() => setViewingUser(null)}
//                             >
//                                 <i className="bi bi-x-lg" />
//                             </button>
//                         </div>

//                         <div className="text-center mb-4">
//                             <img
//                                 src={viewingUser.avatar}
//                                 alt={viewingUser.name}
//                                 width="80"
//                                 height="80"
//                                 className="rounded-circle mb-2"
//                                 style={{ objectFit: "cover" }}
//                             />

//                             <h5
//                                 className="fw-semibold mb-1"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 {viewingUser.name}
//                             </h5>

//                             <div style={{ color: "var(--color-text-muted)" }}>
//                                 @{viewingUser.username}
//                             </div>

//                             <span
//                                 className="badge rounded-pill mt-2 text-capitalize"
//                                 style={statusStyle(viewingUser.status)}
//                             >
//                                 {viewingUser.status}
//                             </span>
//                         </div>

//                         {[
//                             ["Email", viewingUser.email],
//                             ["Phone", viewingUser.phone],
//                             ["Role", viewingUser.role],
//                             ["Joined", viewingUser.joined],
//                             ["Posts", viewingUser.posts],
//                             ["Followers", viewingUser.followers],
//                             ["Verified", viewingUser.verified ? "Yes" : "No"],
//                         ].map(([label, value]) => (
//                             <div
//                                 key={label}
//                                 className="d-flex justify-content-between gap-3 py-2"
//                                 style={{
//                                     borderBottom: "1px solid var(--color-border-light)",
//                                 }}
//                             >
//                                 <small style={{ color: "var(--color-text-muted)" }}>
//                                     {label}
//                                 </small>

//                                 <small
//                                     className="fw-medium text-end"
//                                     style={{ color: "var(--color-text-primary)" }}
//                                 >
//                                     {value}
//                                 </small>
//                             </div>
//                         ))}

//                         <button
//                             type="button"
//                             className="btn w-100 mt-4"
//                             onClick={() => {
//                                 setViewingUser(null);
//                                 openEditDialog(viewingUser);
//                             }}
//                             style={{
//                                 backgroundColor: "var(--color-primary)",
//                                 color: "var(--color-white)",
//                             }}
//                         >
//                             <i className="bi bi-pencil me-2" />
//                             Edit User
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ================= CONFIRMATION DIALOG ================= */}

//             {confirmAction && currentConfirmation && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{
//                         zIndex: 2100,
//                         backgroundColor: "rgba(0,0,0,0.6)",
//                     }}
//                     onClick={() => setConfirmAction(null)}
//                 >
//                     <div
//                         className="w-100 p-4 text-center"
//                         style={{
//                             maxWidth: "400px",
//                             backgroundColor: "var(--color-surface)",
//                             borderRadius: "var(--radius-lg)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={(event) => event.stopPropagation()}
//                     >
//                         <div
//                             className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
//                             style={{
//                                 width: "58px",
//                                 height: "58px",
//                                 color: currentConfirmation.color,
//                                 backgroundColor: currentConfirmation.bg,
//                             }}
//                         >
//                             <i className={`bi ${currentConfirmation.icon} fs-3`} />
//                         </div>

//                         <h5
//                             className="fw-bold mb-2"
//                             style={{ color: "var(--color-text-primary)" }}
//                         >
//                             {currentConfirmation.title}
//                         </h5>

//                         <p
//                             className="small mb-2"
//                             style={{ color: "var(--color-text-secondary)" }}
//                         >
//                             {currentConfirmation.description}
//                         </p>

//                         <div
//                             className="fw-semibold small mb-4"
//                             style={{ color: "var(--color-text-primary)" }}
//                         >
//                             {confirmAction.user.name}
//                         </div>

//                         <div className="d-flex gap-2">
//                             <button
//                                 type="button"
//                                 className="btn flex-grow-1"
//                                 onClick={() => setConfirmAction(null)}
//                                 style={{
//                                     backgroundColor: "var(--color-surface-secondary)",
//                                     color: "var(--color-text-secondary)",
//                                     borderRadius: "var(--radius-md)",
//                                 }}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 className="btn flex-grow-1"
//                                 onClick={executeAction}
//                                 style={{
//                                     backgroundColor: currentConfirmation.color,
//                                     color: "var(--color-white)",
//                                     borderRadius: "var(--radius-md)",
//                                 }}
//                             >
//                                 {currentConfirmation.button}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Users;
