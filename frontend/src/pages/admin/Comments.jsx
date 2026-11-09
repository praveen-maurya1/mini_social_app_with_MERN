
// import React, { useMemo, useRef, useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import adminComments from "../../data/adminComments";

// const PAGE_SIZE = 5;

// const Comments = () => {
//     const [comments, setComments] = useState(adminComments);
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("all");
//     const [currentPage, setCurrentPage] = useState(1);

//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [dropdownPosition, setDropdownPosition] = useState(null);
//     const dropdownRef = useRef(null);

//     const [selectedComment, setSelectedComment] = useState(null);
//     const [editingComment, setEditingComment] = useState(null);
//     const [editText, setEditText] = useState("");
//     const [confirmAction, setConfirmAction] = useState(null);

//     // Statistics
//     const stats = useMemo(() => ({
//         total: comments.length,
//         published: comments.filter(c => c.status === "published").length,
//         hidden: comments.filter(c => c.status === "hidden").length,
//         reported: comments.filter(c => c.status === "reported").length,
//     }), [comments]);

//     // Search and filters
//     const filteredComments = useMemo(() => {
//         const query = search.toLowerCase();

//         return comments.filter(comment => {
//             const matchesSearch =
//                 comment.text.toLowerCase().includes(query) ||
//                 comment.author.toLowerCase().includes(query) ||
//                 comment.username.toLowerCase().includes(query) ||
//                 comment.postContent.toLowerCase().includes(query);

//             const matchesFilter =
//                 filter === "all" || comment.status === filter;

//             return matchesSearch && matchesFilter;
//         });
//     }, [comments, search, filter]);

//     const totalPages = Math.max(
//         1,
//         Math.ceil(filteredComments.length / PAGE_SIZE)
//     );

//     const paginatedComments = filteredComments.slice(
//         (currentPage - 1) * PAGE_SIZE,
//         currentPage * PAGE_SIZE
//     );

//     // Status styling
//     const getStatusStyle = status => {
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

//     // Dropdown positioning
//     const openDropdown = (event, commentId) => {
//         if (activeDropdown === commentId) {
//             setActiveDropdown(null);
//             setDropdownPosition(null);
//             return;
//         }

//         const rect = event.currentTarget.getBoundingClientRect();
//         const menuHeight = 230;
//         const menuWidth = 190;

//         const top = Math.min(
//             Math.max(8, rect.bottom - menuHeight),
//             window.innerHeight - menuHeight - 8
//         );

//         const left = Math.max(
//             8,
//             Math.min(rect.left - menuWidth - 8, window.innerWidth - menuWidth - 8)
//         );

//         setDropdownPosition({ top, left });
//         setActiveDropdown(commentId);
//     };

//     useEffect(() => {
//         if (!activeDropdown) return;

//         const handleOutsideClick = event => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setActiveDropdown(null);
//                 setDropdownPosition(null);
//             }
//         };

//         const handleEscape = event => {
//             if (event.key === "Escape") {
//                 setActiveDropdown(null);
//                 setDropdownPosition(null);
//             }
//         };

//         const handleScroll = () => {
//             setActiveDropdown(null);
//             setDropdownPosition(null);
//         };

//         document.addEventListener("mousedown", handleOutsideClick);
//         document.addEventListener("keydown", handleEscape);
//         window.addEventListener("scroll", handleScroll, true);

//         return () => {
//             document.removeEventListener("mousedown", handleOutsideClick);
//             document.removeEventListener("keydown", handleEscape);
//             window.removeEventListener("scroll", handleScroll, true);
//         };
//     }, [activeDropdown]);

//     // Confirmation
//     const openConfirmation = (comment, action) => {
//         setConfirmAction({ comment, action });
//         setActiveDropdown(null);
//         setDropdownPosition(null);
//     };

//     const confirmationDetails = {
//         publish: {
//             title: "Publish Comment",
//             message: "Are you sure you want to publish this comment?",
//             button: "Publish Comment",
//             color: "var(--color-success)",
//         },
//         hide: {
//             title: "Hide Comment",
//             message: "Are you sure you want to hide this comment?",
//             button: "Hide Comment",
//             color: "var(--color-warning)",
//         },
//         reported: {
//             title: "Mark as Reported",
//             message: "Are you sure you want to mark this comment as reported?",
//             button: "Mark as Reported",
//             color: "var(--color-warning)",
//         },
//         delete: {
//             title: "Delete Comment",
//             message: "This action cannot be undone. Are you sure?",
//             button: "Delete Comment",
//             color: "var(--color-danger)",
//         },
//     };

//     const executeAction = () => {
//         if (!confirmAction) return;

//         const { comment, action } = confirmAction;

//         if (action === "delete") {
//             setComments(prev =>
//                 prev.filter(item => item.id !== comment.id)
//             );

//             setSelectedComment(prev =>
//                 prev?.id === comment.id ? null : prev
//             );
//         } else {
//             const statusMap = {
//                 publish: "published",
//                 hide: "hidden",
//                 reported: "reported",
//             };

//             const newStatus = statusMap[action];

//             setComments(prev =>
//                 prev.map(item =>
//                     item.id === comment.id
//                         ? { ...item, status: newStatus }
//                         : item
//                 )
//             );

//             setSelectedComment(prev =>
//                 prev?.id === comment.id
//                     ? { ...prev, status: newStatus }
//                     : prev
//             );
//         }

//         setConfirmAction(null);
//     };

//     // Edit comment
//     const openEditDialog = comment => {
//         setEditingComment(comment);
//         setEditText(comment.text);
//         setActiveDropdown(null);
//         setDropdownPosition(null);
//     };

//     const saveComment = () => {
//         const trimmedText = editText.trim();

//         if (!trimmedText || !editingComment) return;

//         setComments(prev =>
//             prev.map(comment =>
//                 comment.id === editingComment.id
//                     ? { ...comment, text: trimmedText }
//                     : comment
//             )
//         );

//         setSelectedComment(prev =>
//             prev?.id === editingComment.id
//                 ? { ...prev, text: trimmedText }
//                 : prev
//         );

//         setEditingComment(null);
//         setEditText("");
//     };

//     const getConfirmation = () =>
//         confirmAction ? confirmationDetails[confirmAction.action] : null;

//     return (
//         <div className="container-fluid p-3 p-md-4">

//             {/* Header */}
//             <div className="mb-4">
//                 <h4 className="fw-bold mb-1"
//                     style={{ color: "var(--color-text-primary)" }}>
//                     Comments Management
//                 </h4>
//                 <p className="mb-0 small"
//                     style={{ color: "var(--color-text-secondary)" }}>
//                     Manage, review and moderate platform comments.
//                 </p>
//             </div>

//             {/* Statistics */}
//             <div className="row g-3 mb-4">
//                 {[
//                     {
//                         label: "Total Comments",
//                         value: stats.total,
//                         icon: "bi-chat-square-text",
//                         color: "var(--color-primary)",
//                     },
//                     {
//                         label: "Published",
//                         value: stats.published,
//                         icon: "bi-check-circle",
//                         color: "var(--color-success)",
//                     },
//                     {
//                         label: "Hidden",
//                         value: stats.hidden,
//                         icon: "bi-eye-slash",
//                         color: "var(--color-danger)",
//                     },
//                     {
//                         label: "Reported",
//                         value: stats.reported,
//                         icon: "bi-flag",
//                         color: "var(--color-warning)",
//                     },
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
//                                     <p className="small mb-2"
//                                         style={{ color: "var(--color-text-secondary)" }}>
//                                         {item.label}
//                                     </p>
//                                     <h4 className="fw-bold mb-0"
//                                         style={{ color: "var(--color-text-primary)" }}>
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

//             {/* Comments Table */}
//             <div
//                 className="card border-0 rounded-3"
//                 style={{
//                     background: "var(--color-surface)",
//                     boxShadow: "var(--shadow-sm)",
//                 }}
//             >
//                 {/* Search and Filter */}
//                 <div className="card-body border-bottom"
//                     style={{ borderColor: "var(--color-border)" }}>
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
//                                     placeholder="Search comments, authors, posts..."
//                                     value={search}
//                                     onChange={event => {
//                                         setSearch(event.target.value);
//                                         setCurrentPage(1);
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
//                                     setCurrentPage(1);
//                                 }}
//                                 style={{
//                                     background: "var(--color-surface-secondary)",
//                                     color: "var(--color-text-primary)",
//                                     borderColor: "var(--color-border)",
//                                 }}
//                             >
//                                 <option value="all">All Comments</option>
//                                 <option value="published">Published</option>
//                                 <option value="hidden">Hidden</option>
//                                 <option value="reported">Reported</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="table-responsive">
//                     <table className="table align-middle mb-0">
//                         <thead>
//                             <tr style={{
//                                 background: "var(--color-surface-secondary)",
//                             }}>
//                                 {[
//                                     "Comment",
//                                     "Author",
//                                     "Related Post",
//                                     "Likes",
//                                     "Reports",
//                                     "Status",
//                                     "Date",
//                                     "Actions",
//                                 ].map(heading => (
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
//                             {paginatedComments.map(comment => (
//                                 <tr key={comment.id}>
//                                     {/* Comment */}
//                                     <td className="px-3 py-3" style={{ minWidth: 230 }}>
//                                         <div
//                                             className="small text-truncate"
//                                             style={{
//                                                 maxWidth: 220,
//                                                 color: "var(--color-text-primary)",
//                                             }}
//                                         >
//                                             {comment.text}
//                                         </div>

//                                         <button
//                                             className="btn btn-link p-0 small text-decoration-none"
//                                             style={{ color: "var(--color-primary)" }}
//                                             onClick={() => setSelectedComment(comment)}
//                                         >
//                                             View comment
//                                         </button>
//                                     </td>

//                                     {/* Author */}
//                                     <td className="px-3 py-3 text-nowrap">
//                                         <div className="d-flex align-items-center gap-2">
//                                             <img
//                                                 src={comment.avatar}
//                                                 alt={comment.author}
//                                                 className="rounded-circle"
//                                                 style={{
//                                                     width: 34,
//                                                     height: 34,
//                                                     objectFit: "cover",
//                                                 }}
//                                             />

//                                             <div>
//                                                 <div className="small fw-semibold"
//                                                     style={{ color: "var(--color-text-primary)" }}>
//                                                     {comment.author}
//                                                 </div>
//                                                 <div className="small"
//                                                     style={{ color: "var(--color-text-muted)" }}>
//                                                     @{comment.username}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>

//                                     {/* Related Post */}
//                                     <td className="px-3 py-3" style={{ minWidth: 170 }}>
//                                         <div className="small text-truncate"
//                                             style={{
//                                                 maxWidth: 160,
//                                                 color: "var(--color-text-secondary)",
//                                             }}>
//                                             {comment.postContent}
//                                         </div>
//                                         <small style={{ color: "var(--color-text-muted)" }}>
//                                             Post #{comment.postId}
//                                         </small>
//                                     </td>

//                                     {/* Likes */}
//                                     <td className="px-3 py-3 text-nowrap">
//                                         <span className="small"
//                                             style={{ color: "var(--color-text-secondary)" }}>
//                                             <i className="bi bi-heart me-1" />
//                                             {comment.likes}
//                                         </span>
//                                     </td>

//                                     {/* Reports */}
//                                     <td className="px-3 py-3">
//                                         <span
//                                             className="small fw-semibold"
//                                             style={{
//                                                 color: comment.reports > 0
//                                                     ? "var(--color-danger)"
//                                                     : "var(--color-text-secondary)",
//                                             }}
//                                         >
//                                             {comment.reports}
//                                         </span>
//                                     </td>

//                                     {/* Status */}
//                                     <td className="px-3 py-3">
//                                         <span
//                                             className="badge rounded-pill px-3 py-2"
//                                             style={getStatusStyle(comment.status)}
//                                         >
//                                             {comment.status}
//                                         </span>
//                                     </td>

//                                     {/* Date */}
//                                     <td className="px-3 py-3 small text-nowrap"
//                                         style={{ color: "var(--color-text-secondary)" }}>
//                                         {comment.createdAt}
//                                     </td>

//                                     {/* Actions */}
//                                     <td className="px-3 py-3 text-end">
//                                         <button
//                                             type="button"
//                                             className="btn btn-sm border-0"
//                                             style={{
//                                                 color: "var(--color-text-secondary)",
//                                                 background: "var(--color-surface-secondary)",
//                                             }}
//                                             onClick={event => openDropdown(event, comment.id)}
//                                         >
//                                             <i className="bi bi-three-dots-vertical" />
//                                         </button>

//                                         {activeDropdown === comment.id &&
//                                             dropdownPosition &&
//                                             createPortal(
//                                                 <div
//                                                     ref={dropdownRef}
//                                                     className="dropdown-menu show p-2"
//                                                     style={{
//                                                         position: "fixed",
//                                                         top: dropdownPosition.top,
//                                                         left: dropdownPosition.left,
//                                                         zIndex: 2000,
//                                                         minWidth: 190,
//                                                         background: "var(--color-surface)",
//                                                         borderColor: "var(--color-border)",
//                                                         boxShadow: "var(--shadow-md)",
//                                                     }}
//                                                 >
//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => {
//                                                             setSelectedComment(comment);
//                                                             setActiveDropdown(null);
//                                                         }}
//                                                     >
//                                                         <i className="bi bi-eye me-2" />
//                                                         View Comment
//                                                     </button>

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         onClick={() => openEditDialog(comment)}
//                                                     >
//                                                         <i className="bi bi-pencil-square me-2" />
//                                                         Edit Comment
//                                                     </button>

//                                                     <div className="dropdown-divider my-2" />

//                                                     <div className="px-3 py-1">
//                                                         <small className="fw-semibold"
//                                                             style={{ color: "var(--color-text-muted)" }}>
//                                                             UPDATE STATUS
//                                                         </small>
//                                                     </div>

//                                                     {[
//                                                         {
//                                                             value: "published",
//                                                             label: "Published",
//                                                             icon: "bi-check-circle",
//                                                             action: "publish",
//                                                         },
//                                                         {
//                                                             value: "hidden",
//                                                             label: "Hidden",
//                                                             icon: "bi-eye-slash",
//                                                             action: "hide",
//                                                         },
//                                                         {
//                                                             value: "reported",
//                                                             label: "Reported",
//                                                             icon: "bi-flag",
//                                                             action: "reported",
//                                                         },
//                                                     ].map(status => (
//                                                         <button
//                                                             key={status.value}
//                                                             className="dropdown-item rounded-2 small d-flex justify-content-between align-items-center"
//                                                             disabled={comment.status === status.value}
//                                                             onClick={() => openConfirmation(comment, status.action)}
//                                                         >
//                                                             <span>
//                                                                 <i className={`bi ${status.icon} me-2`} />
//                                                                 {status.label}
//                                                             </span>

//                                                             {comment.status === status.value && (
//                                                                 <i className="bi bi-check2" />
//                                                             )}
//                                                         </button>
//                                                     ))}

//                                                     <hr className="dropdown-divider" />

//                                                     <button
//                                                         className="dropdown-item rounded-2 small"
//                                                         style={{ color: "var(--color-danger)" }}
//                                                         onClick={() => openConfirmation(comment, "delete")}
//                                                     >
//                                                         <i className="bi bi-trash3 me-2" />
//                                                         Delete Comment
//                                                     </button>
//                                                 </div>,
//                                                 document.body
//                                             )}
//                                     </td>
//                                 </tr>
//                             ))}

//                             {paginatedComments.length === 0 && (
//                                 <tr>
//                                     <td colSpan="8" className="text-center py-5">
//                                         <i
//                                             className="bi bi-chat-square-text fs-1 d-block mb-2"
//                                             style={{ color: "var(--color-text-muted)" }}
//                                         />
//                                         <span style={{ color: "var(--color-text-secondary)" }}>
//                                             No comments found.
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
//                         Showing {filteredComments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
//                         {" - "}
//                         {Math.min(currentPage * PAGE_SIZE, filteredComments.length)}
//                         {" of "}
//                         {filteredComments.length} comments
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

//                         <span className="small"
//                             style={{ color: "var(--color-text-secondary)" }}>
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

//             {/* View Comment Dialog */}
//             {selectedComment && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.55)", zIndex: 1055 }}
//                     onClick={() => setSelectedComment(null)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 480,
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-4">
//                                 <h5 className="fw-bold mb-0"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     Comment Details
//                                 </h5>
//                                 <button className="btn-close"
//                                     onClick={() => setSelectedComment(null)} />
//                             </div>

//                             <div className="d-flex align-items-center gap-3 mb-3">
//                                 <img
//                                     src={selectedComment.avatar}
//                                     alt={selectedComment.author}
//                                     className="rounded-circle"
//                                     width="44"
//                                     height="44"
//                                 />
//                                 <div>
//                                     <div className="fw-semibold"
//                                         style={{ color: "var(--color-text-primary)" }}>
//                                         {selectedComment.author}
//                                     </div>
//                                     <small style={{ color: "var(--color-text-muted)" }}>
//                                         @{selectedComment.username}
//                                     </small>
//                                 </div>
//                             </div>

//                             <div className="rounded-3 p-3 mb-3"
//                                 style={{ background: "var(--color-surface-secondary)" }}>
//                                 <p className="mb-0"
//                                     style={{
//                                         color: "var(--color-text-primary)",
//                                         whiteSpace: "pre-wrap",
//                                     }}>
//                                     {selectedComment.text}
//                                 </p>
//                             </div>

//                             <div className="mb-3">
//                                 <small style={{ color: "var(--color-text-muted)" }}>
//                                     RELATED POST
//                                 </small>
//                                 <p className="small mt-1 mb-0"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     {selectedComment.postContent}
//                                 </p>
//                             </div>

//                             <div className="d-flex flex-wrap gap-3 mb-4 small"
//                                 style={{ color: "var(--color-text-secondary)" }}>
//                                 <span><i className="bi bi-heart me-1" />{selectedComment.likes} Likes</span>
//                                 <span><i className="bi bi-flag me-1" />{selectedComment.reports} Reports</span>
//                                 <span><i className="bi bi-calendar3 me-1" />{selectedComment.createdAt}</span>
//                             </div>

//                             <div className="d-flex justify-content-between align-items-center">
//                                 <span className="badge rounded-pill px-3 py-2"
//                                     style={getStatusStyle(selectedComment.status)}>
//                                     {selectedComment.status}
//                                 </span>

//                                 <button
//                                     className="btn btn-sm btn-outline-secondary"
//                                     onClick={() => setSelectedComment(null)}
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Comment Dialog */}
//             {editingComment && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.55)", zIndex: 1060 }}
//                     onClick={() => setEditingComment(null)}
//                 >
//                     <div
//                         className="card border-0 rounded-4 w-100"
//                         style={{
//                             maxWidth: 480,
//                             background: "var(--color-surface)",
//                             boxShadow: "var(--shadow-lg)",
//                         }}
//                         onClick={e => e.stopPropagation()}
//                     >
//                         <div className="card-body p-4">
//                             <div className="d-flex justify-content-between align-items-center mb-4">
//                                 <h5 className="fw-bold mb-0"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     Edit Comment
//                                 </h5>
//                                 <button className="btn-close"
//                                     onClick={() => setEditingComment(null)} />
//                             </div>

//                             <label className="form-label small fw-semibold"
//                                 style={{ color: "var(--color-text-secondary)" }}>
//                                 Comment
//                             </label>

//                             <textarea
//                                 className="form-control shadow-none"
//                                 rows="5"
//                                 value={editText}
//                                 onChange={e => setEditText(e.target.value)}
//                                 style={{
//                                     background: "var(--color-surface-secondary)",
//                                     color: "var(--color-text-primary)",
//                                     borderColor: "var(--color-border)",
//                                 }}
//                             />

//                             <div className="d-flex justify-content-end gap-2 mt-4">
//                                 <button
//                                     className="btn btn-sm btn-outline-secondary"
//                                     onClick={() => setEditingComment(null)}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     className="btn btn-sm btn-primary"
//                                     disabled={!editText.trim()}
//                                     onClick={saveComment}
//                                 >
//                                     <i className="bi bi-check2 me-1" />
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Confirmation Dialog */}
//             {confirmAction && getConfirmation() && (
//                 <div
//                     className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                     style={{ background: "rgba(0,0,0,0.55)", zIndex: 1070 }}
//                     onClick={() => setConfirmAction(null)}
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

//                                 <h5 className="fw-bold"
//                                     style={{ color: "var(--color-text-primary)" }}>
//                                     {getConfirmation().title}
//                                 </h5>

//                                 <p className="small mb-0"
//                                     style={{ color: "var(--color-text-secondary)" }}>
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
//         </div>
//     );
// };

// export default Comments;
