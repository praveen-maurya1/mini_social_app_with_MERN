
// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import adminPosts from "../../data/adminPosts";

// const PAGE_SIZE = 5;

// const Posts = () => {
//     const [posts, setPosts] = useState(adminPosts);
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("all");
//     const [currentPage, setCurrentPage] = useState(1);

//     const [showLikesDialog, setShowLikesDialog] = useState(false);
//     const [showCommentsDialog, setShowCommentsDialog] = useState(false);
//     const [selectedInteractionUser, setSelectedInteractionUser] = useState(null);

//     const [selectedPost, setSelectedPost] = useState(null);
//     const [confirmAction, setConfirmAction] = useState(null);
//     const [activeDropdown, setActiveDropdown] = useState(null);

//     const dropdownRef = useRef(null);
//     const [dropdownPosition, setDropdownPosition] = useState(null);


//     const handleUpdatePostStatus = (post, newStatus) => {
//         setPosts(prev =>
//             prev.map(item =>
//                 item.id === post.id
//                     ? { ...item, status: newStatus }
//                     : item
//             )
//         );

//         // Update selected post if its details dialog is open
//         setSelectedPost(prev =>
//             prev?.id === post.id
//                 ? { ...prev, status: newStatus }
//                 : prev
//         );

//         setActiveDropdown(null);
//     };
//     const stats = useMemo(() => ({
//         total: posts.length,
//         published: posts.filter(post => post.status === "published").length,
//         hidden: posts.filter(post => post.status === "hidden").length,
//         reported: posts.filter(post => post.reports > 0).length,
//     }), [posts]);

//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const [editCommentText, setEditCommentText] = useState("");

//     // Update comments in both posts list and selected post
//     const updatePostComments = (updatedComments) => {
//         setPosts(prev =>
//             prev.map(post =>
//                 post.id === selectedPost.id
//                     ? {
//                         ...post,
//                         commentsList: updatedComments,
//                         comments: updatedComments.length,
//                     }
//                     : post
//             )
//         );

//         setSelectedPost(prev => ({
//             ...prev,
//             commentsList: updatedComments,
//             comments: updatedComments.length,
//         }));
//     };

//     // Start editing
//     const handleEditComment = (comment) => {
//         setEditingCommentId(comment.id);
//         setEditCommentText(comment.text);
//     };

//     // Save edited comment
//     const handleSaveComment = (commentId) => {
//         const trimmedText = editCommentText.trim();

//         if (!trimmedText) return;

//         const updatedComments = selectedPost.commentsList.map(comment =>
//             comment.id === commentId
//                 ? { ...comment, text: trimmedText }
//                 : comment
//         );

//         updatePostComments(updatedComments);

//         setEditingCommentId(null);
//         setEditCommentText("");
//     };

//     // Delete comment
//     const handleDeleteComment = (commentId) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this comment?"
//         );

//         if (!confirmed) return;

//         const updatedComments = selectedPost.commentsList.filter(
//             comment => comment.id !== commentId
//         );

//         updatePostComments(updatedComments);
//     };

//     const filteredPosts = useMemo(() => {
//         return posts.filter(post => {
//             const query = search.toLowerCase();

//             const matchesSearch =
//                 post.author.toLowerCase().includes(query) ||
//                 post.username.toLowerCase().includes(query) ||
//                 post.content.toLowerCase().includes(query);

//             const matchesFilter =
//                 filter === "all" ||
//                 (filter === "reported" && post.reports > 0) ||
//                 post.status === filter;

//             return matchesSearch && matchesFilter;
//         });
//     }, [posts, search, filter]);

//     const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));

//     const paginatedPosts = filteredPosts.slice(
//         (currentPage - 1) * PAGE_SIZE,
//         currentPage * PAGE_SIZE
//     );

//     const getStatusStyle = (status) => {
//         const styles = {
//             published: {
//                 background: "var(--color-success-light)",
//                 color: "var(--color-success)",
//             },
//             hidden: {
//                 background: "var(--color-danger-light)",
//                 color: "var(--color-danger)",
//             },
//             reported: {
//                 background: "var(--color-warning-light)",
//                 color: "var(--color-warning)",
//             },
//         };

//         return styles[status] || styles.published;
//     };

//     const openConfirmation = (post, action) => {
//         setConfirmAction({ post, action });
//         setActiveDropdown(null);
//     };

//     const executeAction = () => {
//         if (!confirmAction) return;

//         const { post, action } = confirmAction;

//         if (action === "delete") {
//             setPosts(previous =>
//                 previous.filter(item => item.id !== post.id)
//             );

//             setSelectedPost(prev =>
//                 prev?.id === post.id ? null : prev
//             );
//         }

//         const statusMap = {
//             publish: "published",
//             restore: "published",
//             hide: "hidden",
//             reported: "reported",
//         };

//         if (statusMap[action]) {
//             const newStatus = statusMap[action];

//             setPosts(previous =>
//                 previous.map(item =>
//                     item.id === post.id
//                         ? { ...item, status: newStatus }
//                         : item
//                 )
//             );

//             setSelectedPost(prev =>
//                 prev?.id === post.id
//                     ? { ...prev, status: newStatus }
//                     : prev
//             );
//         }

//         setConfirmAction(null);
//     };

//     const confirmationDetails = {
//         hide: {
//             title: "Hide Post",
//             message: "Are you sure you want to hide this post?",
//             button: "Hide Post",
//             color: "var(--color-warning)",
//         },
//         restore: {
//             title: "Restore Post",
//             message: "This post will become visible to users again.",
//             button: "Restore Post",
//             color: "var(--color-success)",
//         },
//         delete: {
//             title: "Delete Post",
//             message: "This action cannot be undone. Are you sure?",
//             button: "Delete Post",
//             color: "var(--color-danger)",
//         },
//         publish: {
//             title: "Publish Post",
//             message: "Are you sure you want to publish this post?",
//             button: "Publish Post",
//             color: "var(--color-success)",
//         },

//         reported: {
//             title: "Mark as Reported",
//             message: "Are you sure you want to mark this post as reported?",
//             button: "Mark as Reported",
//             color: "var(--color-warning)",
//         },
//     };

//     const getConfirmation = () => {
//         if (!confirmAction) return null;
//         return confirmationDetails[confirmAction.action];
//     };

//     const resetPage = () => setCurrentPage(1);

//     return (
//         <div className="container-fluid p-3 p-md-4">

//             {/* Header */}
//             <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//                 <div>
//                     <h4 className="fw-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
//                         Posts Management
//                     </h4>
//                     <p className="mb-0 small" style={{ color: "var(--color-text-secondary)" }}>
//                         Manage, review and moderate platform posts.
//                     </p>
//                 </div>
//             </div>

//             {/* Statistics */}
//             <div className="row g-3 mb-4">
//                 {[
//                     { label: "Total Posts", value: stats.total, icon: "bi-grid", color: "var(--color-primary)" },
//                     { label: "Published", value: stats.published, icon: "bi-check-circle", color: "var(--color-success)" },
//                     { label: "Hidden", value: stats.hidden, icon: "bi-eye-slash", color: "var(--color-danger)" },
//                     { label: "Reported", value: stats.reported, icon: "bi-flag", color: "var(--color-warning)" },
//                 ].map((item, index) => (
//                     <div className="col-6 col-xl-3" key={index}>
//                         <div
//                             className="card h-100 border-0 rounded-3"
//                             style={{
//                                 background: "var(--color-surface)",
//                                 boxShadow: "var(--shadow-sm)",
//                             }}
//                         >
//                             <div className="card-body d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <p className="small mb-2" style={{ color: "var(--color-text-secondary)" }}>
//                                         {item.label}
//                                     </p>
//                                     <h4 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)" }}>
//                                         {item.value.toLocaleString()}
//                                     </h4>
//                                 </div>
//                                 <div
//                                     className="rounded-3 d-flex align-items-center justify-content-center"
//                                     style={{
//                                         width: 44,
//                                         height: 44,
//                                         background: "var(--color-surface-secondary)",
//                                         color: item.color,
//                                     }}
//                                 >
//                                     <i className={`bi ${item.icon} fs-5`} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Posts Table */}
//             <div
//                 className="card border-0 rounded-3"
//                 style={{
//                     background: "var(--color-surface)",
//                     boxShadow: "var(--shadow-sm)",
//                 }}
//             >
//                 <div className="card-body border-bottom" style={{ borderColor: "var(--color-border)" }}>
//                     <div className="row g-3 align-items-center">
//                         <div className="col-12 col-lg-5">
//                             <div className="input-group">
//                                 <span
//                                     className="input-group-text border-end-0"
//                                     style={{
//                                         background: "var(--color-surface-secondary)",
//                                         color: "var(--color-text-secondary)",
//                                         borderColor: "var(--color-border)",
//                                     }}
//                                 >
//                                     <i className="bi bi-search" />
//                                 </span>
//                                 <input
//                                     type="text"
//                                     className="form-control border-start-0 shadow-none"
//                                     placeholder="Search posts, authors..."
//                                     value={search}
//                                     onChange={event => {
//                                         setSearch(event.target.value);
//                                         resetPage();
//                                     }}
//                                     style={{
//                                         background: "var(--color-surface-secondary)",
//                                         color: "var(--color-text-primary)",
//                                         borderColor: "var(--color-border)",
//                                     }}
//                                 />
//                             </div>
//                         </div>

//                         <div className="col-12 col-lg-3 ms-lg-auto">
//                             <select
//                                 className="form-select shadow-none"
//                                 value={filter}
//                                 onChange={event => {
//                                     setFilter(event.target.value);
//                                     resetPage();
//                                 }}
//                                 style={{
//                                     background: "var(--color-surface-secondary)",
//                                     color: "var(--color-text-primary)",
//                                     borderColor: "var(--color-border)",
//                                 }}
//                             >
//                                 <option value="all">All Posts</option>
//                                 <option value="published">Published</option>
//                                 <option value="hidden">Hidden</option>
//                                 <option value="reported">Reported</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="table-responsive">
//                     <table className="table align-middle mb-0">
//                         <thead>
//                             <tr style={{
//                                 background: "var(--color-surface-secondary)",
//                                 color: "var(--color-text-secondary)",
//                             }}>
//                                 {["Post", "Author", "Engagement", "Reports", "Status", "Date", "Actions"].map(heading => (
//                                     <th
//                                         key={heading}
//                                         className="small fw-semibold text-nowrap px-3 py-3"
//                                         style={{ color: "var(--color-text-secondary)" }}
//                                     >
//                                         {heading}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {paginatedPosts.map(post => (
//                                 <tr key={post.id}>
//                                     <td className="px-3 py-3" style={{ minWidth: 240 }}>
//                                         <div className="d-flex align-items-center gap-3">
//                                             {post.image ? (
//                                                 <img
//                                                     src={post.image}
//                                                     alt="Post"
//                                                     className="rounded-3"
//                                                     style={{
//                                                         width: 52,
//                                                         height: 52,
//                                                         objectFit: "cover",
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <div
//                                                     className="rounded-3 d-flex align-items-center justify-content-center"
//                                                     style={{
//                                                         width: 52,
//                                                         height: 52,
//                                                         background: "var(--color-surface-secondary)",
//                                                         color: "var(--color-text-muted)",
//                                                     }}
//                                                 >
//                                                     <i className="bi bi-file-text fs-4" />
//                                                 </div>
//                                             )}

//                                             <div style={{ maxWidth: 190 }}>
//                                                 <div
//                                                     className="small fw-semibold text-truncate"
//                                                     style={{ color: "var(--color-text-primary)" }}
//                                                 >
//                                                     {post.content}
//                                                 </div>
//                                                 <button
//                                                     className="btn btn-link p-0 small text-decoration-none"
//                                                     style={{ color: "var(--color-primary)" }}
//                                                     onClick={() => setSelectedPost(post)}
//                                                 >
//                                                     View post
//                                                 </button>

//                                             </div>
//                                         </div>
//                                     </td>

//                                     <td className="px-3 py-3 text-nowrap">
//                                         <div className="d-flex align-items-center gap-2">
//                                             <img
//                                                 src={post.avatar}
//                                                 alt={post.author}
//                                                 className="rounded-circle"
//                                                 style={{ width: 34, height: 34, objectFit: "cover" }}
//                                             />
//                                             <div>
//                                                 <div className="small fw-semibold" style={{ color: "var(--color-text-primary)" }}>
//                                                     {post.author}
//                                                 </div>
//                                                 <div className="small" style={{ color: "var(--color-text-muted)" }}>
//                                                     @{post.username}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>

//                                     <td className="px-3 py-3 text-nowrap">
//                                         <div className="small" style={{ color: "var(--color-text-secondary)" }}>
//                                             <span className="me-2">
//                                                 <i className="bi bi-heart me-1" />
//                                                 {post.likes}
//                                             </span>
//                                             <span>
//                                                 <i className="bi bi-chat me-1" />
//                                                 {post.comments}
//                                             </span>
//                                         </div>
//                                     </td>

//                                     <td className="px-3 py-3">
//                                         <span
//                                             className="small fw-semibold"
//                                             style={{
//                                                 color: post.reports > 0
//                                                     ? "var(--color-danger)"
//                                                     : "var(--color-text-secondary)",
//                                             }}
//                                         >
//                                             {post.reports}
//                                         </span>
//                                     </td>

//                                     <td className="px-3 py-3">
//                                         <span
//                                             className="badge rounded-pill px-3 py-2"
//                                             style={getStatusStyle(post.status)}
//                                         >
//                                             {post.status}
//                                         </span>
//                                     </td>

//                                     <td className="px-3 py-3 small text-nowrap" style={{ color: "var(--color-text-secondary)" }}>
//                                         {post.createdAt}
//                                     </td>

//                                     <td className="px-3 py-3 text-end">

//                                         <div className="position-relative d-inline-block">
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-sm border-0"
//                                                 style={{
//                                                     color: "var(--color-text-secondary)",
//                                                     background: "var(--color-surface-secondary)",
//                                                 }}
//                                                 onClick={(e) => {
//                                                     if (activeDropdown === post.id) {
//                                                         setActiveDropdown(null);
//                                                         setDropdownPosition(null);
//                                                         return;
//                                                     }

//                                                     const rect = e.currentTarget.getBoundingClientRect();

//                                                     setDropdownPosition({
//                                                         top: Math.max(8, rect.top - 180),
//                                                         left: rect.left - 188,
//                                                     });

//                                                     setActiveDropdown(post.id);
//                                                 }}
//                                             >
//                                                 <i className="bi bi-three-dots-vertical" />
//                                             </button>

//                                             {/* {activeDropdown === post.id && dropdownPosition &&
//                                                 createPortal(
//                                                     <div
//                                                         ref={dropdownRef}
//                                                         className="dropdown-menu show p-2"
//                                                         style={{
//                                                             position: "fixed",
//                                                             top: dropdownPosition.top,
//                                                             left: Math.max(8, dropdownPosition.left),
//                                                             zIndex: 2000,
//                                                             minWidth: "180px",
//                                                             background: "var(--color-surface)",
//                                                             borderColor: "var(--color-border)",
//                                                             boxShadow: "var(--shadow-md)",
//                                                         }}
//                                                     >
//                                                         <button
//                                                             className="dropdown-item rounded-2 small"
//                                                             onClick={() => {
//                                                                 setSelectedPost(post);
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-eye me-2" />
//                                                             View Post
//                                                         </button>
//                                                         <div className="dropdown-divider my-2" />

//                                                         <div className="px-3 py-1">
//                                                             <small
//                                                                 className="fw-semibold"
//                                                                 style={{ color: "var(--color-text-muted)" }}
//                                                             >
//                                                                 UPDATE STATUS
//                                                             </small>
//                                                         </div>

//                                                         {[
//                                                             { value: "published", label: "Published", icon: "bi-check-circle" },
//                                                             { value: "hidden", label: "Hidden", icon: "bi-eye-slash" },
//                                                             { value: "reported", label: "Reported", icon: "bi-flag" },
//                                                         ].map(status => (
//                                                             <button
//                                                                 key={status.value}
//                                                                 className="dropdown-item rounded-2 small d-flex align-items-center justify-content-between"
//                                                                 disabled={post.status === status.value}
//                                                                 onClick={() => handleUpdatePostStatus(post, status.value)}
//                                                             >
//                                                                 <span>
//                                                                     <i className={`bi ${status.icon} me-2`} />
//                                                                     {status.label}
//                                                                 </span>

//                                                                 {post.status === status.value && (
//                                                                     <i className="bi bi-check2 ms-2" />
//                                                                 )}
//                                                             </button>
//                                                         ))}
//                                                         {post.status === "hidden" ? (
//                                                             <button
//                                                                 className="dropdown-item rounded-2 small"
//                                                                 onClick={() => openConfirmation(post, "restore")}
//                                                             >
//                                                                 <i className="bi bi-eye me-2" />
//                                                                 Restore Post
//                                                             </button>
//                                                         ) : (
//                                                             <button
//                                                                 className="dropdown-item rounded-2 small"
//                                                                 onClick={() => openConfirmation(post, "hide")}
//                                                             >
//                                                                 <i className="bi bi-eye-slash me-2" />
//                                                                 Hide Post
//                                                             </button>
//                                                         )}

//                                                         <hr className="dropdown-divider" />

//                                                         <button
//                                                             className="dropdown-item rounded-2 small"
//                                                             style={{ color: "var(--color-danger)" }}
//                                                             onClick={() => openConfirmation(post, "delete")}
//                                                         >
//                                                             <i className="bi bi-trash me-2" />
//                                                             Delete Post
//                                                         </button>

//                                                     </div>,
//                                                     document.body
//                                                 )} */}
//                                             {activeDropdown === post.id && dropdownPosition &&
//                                                 createPortal(
//                                                     <div
//                                                         ref={dropdownRef}
//                                                         className="dropdown-menu show p-2"
//                                                         style={{
//                                                             position: "fixed",
//                                                             top: dropdownPosition.top,
//                                                             left: Math.max(8, dropdownPosition.left),
//                                                             zIndex: 2000,
//                                                             minWidth: "190px",
//                                                             background: "var(--color-surface)",
//                                                             borderColor: "var(--color-border)",
//                                                             boxShadow: "var(--shadow-md)",
//                                                         }}
//                                                     >
//                                                         {/* View Post */}
//                                                         <button
//                                                             className="dropdown-item rounded-2 small"
//                                                             onClick={() => {
//                                                                 setSelectedPost(post);
//                                                                 setActiveDropdown(null);
//                                                             }}
//                                                         >
//                                                             <i className="bi bi-eye me-2" />
//                                                             View Post
//                                                         </button>

//                                                         <div className="dropdown-divider my-2" />

//                                                         {/* Update Status */}
//                                                         <div className="px-3 py-1">
//                                                             <small
//                                                                 className="fw-semibold"
//                                                                 style={{ color: "var(--color-text-muted)" }}
//                                                             >
//                                                                 UPDATE STATUS
//                                                             </small>
//                                                         </div>

//                                                         {[
//                                                             {
//                                                                 value: "published",
//                                                                 label: "Published",
//                                                                 icon: "bi-check-circle",
//                                                             },
//                                                             {
//                                                                 value: "hidden",
//                                                                 label: "Hidden",
//                                                                 icon: "bi-eye-slash",
//                                                             },
//                                                             {
//                                                                 value: "reported",
//                                                                 label: "Reported",
//                                                                 icon: "bi-flag",
//                                                             },
//                                                         ].map(status => (
//                                                             <button
//                                                                 key={status.value}
//                                                                 className="dropdown-item rounded-2 small d-flex align-items-center justify-content-between"
//                                                                 disabled={post.status === status.value}
//                                                                 onClick={() => {
//                                                                     const actionMap = {
//                                                                         published: "publish",
//                                                                         hidden: "hide",
//                                                                         reported: "reported",
//                                                                     };

//                                                                     openConfirmation(post, actionMap[status.value]);
//                                                                 }}
//                                                             >
//                                                                 <span>
//                                                                     <i className={`bi ${status.icon} me-2`} />
//                                                                     {status.label}
//                                                                 </span>

//                                                                 {post.status === status.value && (
//                                                                     <i className="bi bi-check2 ms-2" />
//                                                                 )}
//                                                             </button>
//                                                         ))}

//                                                         <hr className="dropdown-divider" />

//                                                         {/* Delete Post */}
//                                                         <button
//                                                             className="dropdown-item rounded-2 small"
//                                                             style={{ color: "var(--color-danger)" }}
//                                                             onClick={() => openConfirmation(post, "delete")}
//                                                         >
//                                                             <i className="bi bi-trash3 me-2" />
//                                                             Delete Post
//                                                         </button>
//                                                     </div>,
//                                                     document.body
//                                                 )
//                                             }
//                                         </div>

//                                     </td>

//                                 </tr>
//                             ))}

//                             {paginatedPosts.length === 0 && (
//                                 <tr>
//                                     <td colSpan="7" className="text-center py-5">
//                                         <i
//                                             className="bi bi-inbox fs-1 d-block mb-2"
//                                             style={{ color: "var(--color-text-muted)" }}
//                                         />
//                                         <span style={{ color: "var(--color-text-secondary)" }}>
//                                             No posts found.
//                                         </span>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
//                     <small style={{ color: "var(--color-text-secondary)" }}>
//                         Showing {filteredPosts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
//                         {" - "}
//                         {Math.min(currentPage * PAGE_SIZE, filteredPosts.length)}
//                         {" of "}
//                         {filteredPosts.length} posts
//                     </small>

//                     <div className="d-flex align-items-center gap-2">
//                         <button
//                             className="btn btn-sm border"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage(page => page - 1)}
//                             style={{
//                                 color: "var(--color-text-primary)",
//                                 borderColor: "var(--color-border)",
//                             }}
//                         >
//                             <i className="bi bi-chevron-left" />
//                         </button>

//                         <span className="small" style={{ color: "var(--color-text-secondary)" }}>
//                             Page {currentPage} of {totalPages}
//                         </span>

//                         <button
//                             className="btn btn-sm border"
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage(page => page + 1)}
//                             style={{
//                                 color: "var(--color-text-primary)",
//                                 borderColor: "var(--color-border)",
//                             }}
//                         >
//                             <i className="bi bi-chevron-right" />
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* View Post Modal */}
//             {selectedPost && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{
//                         background: "rgba(0,0,0,0.55)",
//                         zIndex: 1055,
//                     }}
//                     onClick={() => setSelectedPost(null)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100 main-feed-scroll"
//                         style={{
//                             maxWidth: 550,
//                             maxHeight: "90vh",
//                             overflowY: "auto",
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={event => event.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-4">
//                                 <h5 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)" }}>
//                                     Post Details
//                                 </h5>
//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setSelectedPost(null)}
//                                 />
//                             </div>

//                             <div className="d-flex align-items-center gap-3 mb-3">
//                                 <img
//                                     src={selectedPost.avatar}
//                                     alt={selectedPost.author}
//                                     className="rounded-circle"
//                                     style={{ width: 44, height: 44, objectFit: "cover" }}
//                                 />
//                                 <div>
//                                     <div className="fw-semibold" style={{ color: "var(--color-text-primary)" }}>
//                                         {selectedPost.author}
//                                     </div>
//                                     <small style={{ color: "var(--color-text-secondary)" }}>
//                                         @{selectedPost.username} · {selectedPost.createdAt}
//                                     </small>
//                                 </div>
//                             </div>

//                             <p style={{ color: "var(--color-text-primary)", whiteSpace: "pre-wrap" }}>
//                                 {selectedPost.content}
//                             </p>

//                             {selectedPost.image && (
//                                 <img
//                                     src={selectedPost.image}
//                                     alt="Post attachment"
//                                     className="img-fluid rounded-3 w-100 mb-3"
//                                 />
//                             )}

//                             <div
//                                 className="d-flex flex-wrap gap-4 py-3 border-top border-bottom mb-3"
//                                 style={{ borderColor: "var(--color-border)" }}
//                             >
//                                 <button
//                                     className="btn btn-link p-0 text-decoration-none small"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                     onClick={() => setShowLikesDialog(true)}
//                                 >
//                                     <i className="bi bi-heart me-1" />
//                                     {selectedPost.likedBy?.length || 0} Likes
//                                 </button>

//                                 <button
//                                     className="btn btn-link p-0 text-decoration-none small"
//                                     style={{ color: "var(--color-text-secondary)" }}
//                                     onClick={() => setShowCommentsDialog(true)}
//                                 >
//                                     <i className="bi bi-chat me-1" />
//                                     {selectedPost.commentsList?.length || 0} Comments
//                                 </button>

//                                 <span className="small" style={{ color: "var(--color-text-secondary)" }}>
//                                     <i className="bi bi-share me-1" />
//                                     {selectedPost.shares} Shares
//                                 </span>

//                                 <span className="small" style={{ color: "var(--color-danger)" }}>
//                                     <i className="bi bi-flag me-1" />
//                                     {selectedPost.reports} Reports
//                                 </span>
//                             </div>

//                             <div className="d-flex justify-content-between align-items-center">
//                                 <span
//                                     className="badge rounded-pill px-3 py-2"
//                                     style={getStatusStyle(selectedPost.status)}
//                                 >
//                                     {selectedPost.status}
//                                 </span>

//                                 <button
//                                     className="btn btn-sm btn-outline-secondary"
//                                     onClick={() => setSelectedPost(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Confirmation Modal */}
//             {confirmAction && getConfirmation() && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{
//                         background: "rgba(0,0,0,0.55)",
//                         zIndex: 1060,
//                     }}
//                     onClick={() => setConfirmAction(null)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 420,
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={event => event.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="text-center mb-3">
//                                 <div
//                                     className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
//                                     style={{
//                                         width: 52,
//                                         height: 52,
//                                         background: "var(--color-surface-secondary)",
//                                         color: getConfirmation().color,
//                                     }}
//                                 >
//                                     <i className="bi bi-exclamation-triangle fs-4" />
//                                 </div>

//                                 <h5 className="fw-bold" style={{ color: "var(--color-text-primary)" }}>
//                                     {getConfirmation().title}
//                                 </h5>

//                                 <p className="small mb-0" style={{ color: "var(--color-text-secondary)" }}>
//                                     {getConfirmation().message}
//                                 </p>
//                             </div>

//                             <div className="d-flex gap-2 mt-4">
//                                 <button
//                                     className="btn border flex-fill"
//                                     style={{
//                                         color: "var(--color-text-primary)",
//                                         borderColor: "var(--color-border)",
//                                     }}
//                                     onClick={() => setConfirmAction(null)}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     className="btn flex-fill text-white"
//                                     style={{ background: getConfirmation().color }}
//                                     onClick={executeAction}
//                                 >
//                                     {getConfirmation().button}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}


//             {/* Likes Dialog */}
//             {showLikesDialog && selectedPost && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.55)", zIndex: 1070 }}
//                     onClick={() => setShowLikesDialog(false)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 450,
//                             maxHeight: "80vh",
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h5 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)" }}>
//                                     <i className="bi bi-heart-fill me-2" style={{ color: "var(--color-danger)" }} />
//                                     Likes ({selectedPost.likedBy?.length || 0})
//                                 </h5>

//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setShowLikesDialog(false)}
//                                 />
//                             </div>

//                             <div className="overflow-auto" style={{ maxHeight: "55vh" }}>
//                                 {selectedPost.likedBy?.length > 0 ? (
//                                     selectedPost.likedBy.map(user => (
//                                         <button
//                                             key={user.id}
//                                             className="btn w-100 d-flex align-items-center gap-3 text-start border-0 rounded-3 p-2 mb-1"
//                                             style={{ background: "transparent" }}
//                                             onClick={() => setSelectedInteractionUser(user)}
//                                         >
//                                             <img
//                                                 src={user.avatar}
//                                                 alt={user.name}
//                                                 className="rounded-circle"
//                                                 width="42"
//                                                 height="42"
//                                                 style={{ objectFit: "cover" }}
//                                             />

//                                             <div className="flex-grow-1">
//                                                 <div className="small fw-semibold" style={{ color: "var(--color-text-primary)" }}>
//                                                     {user.name}
//                                                     {user.verified && (
//                                                         <i className="bi bi-patch-check-fill ms-1"
//                                                             style={{ color: "var(--color-primary)" }} />
//                                                     )}
//                                                 </div>
//                                                 <small style={{ color: "var(--color-text-muted)" }}>
//                                                     @{user.username}
//                                                 </small>
//                                             </div>

//                                             <i className="bi bi-chevron-right small"
//                                                 style={{ color: "var(--color-text-muted)" }} />
//                                         </button>
//                                     ))
//                                 ) : (
//                                     <p className="text-center py-4 mb-0" style={{ color: "var(--color-text-muted)" }}>
//                                         No likes found.
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Comments Dialog */}
//             {showCommentsDialog && selectedPost && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.55)", zIndex: 1070 }}
//                     onClick={() => setShowCommentsDialog(false)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 500,
//                             maxHeight: "80vh",
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h5 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)" }}>
//                                     <i className="bi bi-chat-fill me-2" style={{ color: "var(--color-primary)" }} />
//                                     Comments ({selectedPost.commentsList?.length || 0})
//                                 </h5>

//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setShowCommentsDialog(false)}
//                                 />
//                             </div>

//                             <div className="overflow-auto" style={{ maxHeight: "55vh" }}>
//                                 {selectedPost.commentsList?.length > 0 ? (
//                                     selectedPost.commentsList.map(comment => (
//                                         <div
//                                             key={comment.id}
//                                             className="d-flex gap-3 py-3 border-bottom"
//                                             style={{ borderColor: "var(--color-border)" }}
//                                         >
//                                             {/* User Avatar */}
//                                             <button
//                                                 className="btn p-0 border-0 flex-shrink-0"
//                                                 onClick={() => setSelectedInteractionUser(comment.user)}
//                                             >
//                                                 <img
//                                                     src={comment.user.avatar}
//                                                     alt={comment.user.name}
//                                                     className="rounded-circle"
//                                                     width="42"
//                                                     height="42"
//                                                     style={{ objectFit: "cover" }}
//                                                 />
//                                             </button>

//                                             <div className="flex-grow-1 min-width-0">

//                                                 {/* User Information */}
//                                                 <div className="d-flex justify-content-between align-items-start gap-2">
//                                                     <div>
//                                                         <button
//                                                             className="btn p-0 border-0 text-start"
//                                                             onClick={() => setSelectedInteractionUser(comment.user)}
//                                                         >
//                                                             <span
//                                                                 className="small fw-semibold"
//                                                                 style={{ color: "var(--color-text-primary)" }}
//                                                             >
//                                                                 {comment.user.name}
//                                                             </span>

//                                                             {comment.user.verified && (
//                                                                 <i
//                                                                     className="bi bi-patch-check-fill ms-1"
//                                                                     style={{ color: "var(--color-primary)" }}
//                                                                 />
//                                                             )}

//                                                             <small
//                                                                 className="ms-2"
//                                                                 style={{ color: "var(--color-text-muted)" }}
//                                                             >
//                                                                 @{comment.user.username}
//                                                             </small>
//                                                         </button>
//                                                     </div>

//                                                     {/* Edit and Delete Actions */}
//                                                     {editingCommentId !== comment.id && (
//                                                         <div className="d-flex gap-1 flex-shrink-0">
//                                                             <button
//                                                                 className="btn btn-sm border-0"
//                                                                 title="Edit comment"
//                                                                 onClick={() => handleEditComment(comment)}
//                                                                 style={{ color: "var(--color-text-secondary)" }}
//                                                             >
//                                                                 <i className="bi bi-pencil-square" />
//                                                             </button>

//                                                             <button
//                                                                 className="btn btn-sm border-0"
//                                                                 title="Delete comment"
//                                                                 onClick={() => handleDeleteComment(comment.id)}
//                                                                 style={{ color: "var(--color-danger)" }}
//                                                             >
//                                                                 <i className="bi bi-trash3" />
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* Comment Text / Edit Mode */}
//                                                 {editingCommentId === comment.id ? (
//                                                     <div className="mt-2">
//                                                         <textarea
//                                                             className="form-control form-control-sm"
//                                                             rows="3"
//                                                             value={editCommentText}
//                                                             onChange={e => setEditCommentText(e.target.value)}
//                                                             style={{
//                                                                 background: "var(--color-surface-secondary)",
//                                                                 color: "var(--color-text-primary)",
//                                                                 borderColor: "var(--color-border)",
//                                                             }}
//                                                         />

//                                                         <div className="d-flex justify-content-end gap-2 mt-2">
//                                                             <button
//                                                                 className="btn btn-sm btn-outline-secondary"
//                                                                 onClick={() => {
//                                                                     setEditingCommentId(null);
//                                                                     setEditCommentText("");
//                                                                 }}
//                                                             >
//                                                                 Cancel
//                                                             </button>

//                                                             <button
//                                                                 className="btn btn-sm btn-primary"
//                                                                 disabled={!editCommentText.trim()}
//                                                                 onClick={() => handleSaveComment(comment.id)}
//                                                             >
//                                                                 <i className="bi bi-check2 me-1" />
//                                                                 Save Changes
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <p
//                                                         className="small my-2"
//                                                         style={{ color: "var(--color-text-primary)" }}
//                                                     >
//                                                         {comment.text}
//                                                     </p>
//                                                 )}

//                                                 {/* Comment Date */}
//                                                 <small style={{ color: "var(--color-text-muted)" }}>
//                                                     {comment.createdAt}
//                                                 </small>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className="text-center py-4 mb-0"
//                                         style={{ color: "var(--color-text-muted)" }}>
//                                         No comments found.
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Interaction User Details Dialog */}
//             {selectedInteractionUser && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.65)", zIndex: 1080 }}
//                     onClick={() => setSelectedInteractionUser(null)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 420,
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-4">
//                                 <h5 className="fw-bold mb-0"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     User Details
//                                 </h5>

//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setSelectedInteractionUser(null)}
//                                 />
//                             </div>

//                             <div className="text-center mb-4">
//                                 <img
//                                     src={selectedInteractionUser.avatar}
//                                     alt={selectedInteractionUser.name}
//                                     width="85"
//                                     height="85"
//                                     className="rounded-circle mb-3"
//                                     style={{ objectFit: "cover" }}
//                                 />

//                                 <h5 className="fw-bold mb-1"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     {selectedInteractionUser.name}
//                                     {selectedInteractionUser.verified && (
//                                         <i className="bi bi-patch-check-fill ms-2"
//                                             style={{ color: "var(--color-primary)" }} />
//                                     )}
//                                 </h5>

//                                 <div style={{ color: "var(--color-text-muted)" }}>
//                                     @{selectedInteractionUser.username}
//                                 </div>
//                             </div>

//                             {[
//                                 ["Email", selectedInteractionUser.email],
//                                 ["Role", selectedInteractionUser.role],
//                                 ["Status", selectedInteractionUser.status],
//                                 ["Joined", selectedInteractionUser.joined],
//                                 ["Posts", selectedInteractionUser.posts],
//                                 ["Followers", selectedInteractionUser.followers],
//                                 ["Verified", selectedInteractionUser.verified ? "Yes" : "No"],
//                             ].map(([label, value]) => (
//                                 <div
//                                     key={label}
//                                     className="d-flex justify-content-between gap-3 py-2 border-bottom"
//                                     style={{ borderColor: "var(--color-border)" }}
//                                 >
//                                     <small style={{ color: "var(--color-text-muted)" }}>
//                                         {label}
//                                     </small>

//                                     <small className="fw-semibold text-end"
//                                         style={{ color: "var(--color-text-primary)" }}>
//                                         {value ?? "N/A"}
//                                     </small>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}


//         </div>
//     );
// };

// export default Posts;
