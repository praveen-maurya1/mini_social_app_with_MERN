
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import adminModeration from "../../data/adminModeration";

const Moderation = () => {
    const [items, setItems] = useState(adminModeration);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedItem, setSelectedItem] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const [modal, setModal] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const dropdownRef = useRef(null);
    const itemsPerPage = 5;

    // Statistics
    const stats = useMemo(() => ({
        total: items.length,
        hidden: items.filter(item => item.action === "hidden").length,
        removed: items.filter(item => item.action === "removed").length,
        reviewing: items.filter(item => item.action === "under_review").length,
    }), [items]);

    // Search and filters
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const query = search.toLowerCase();

            const matchesSearch =
                item.id.toLowerCase().includes(query) ||
                item.author.toLowerCase().includes(query) ||
                item.username.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                item.reason.toLowerCase().includes(query);

            const matchesAction =
                actionFilter === "all" || item.action === actionFilter;

            const matchesType =
                typeFilter === "all" || item.contentType === typeFilter;

            return matchesSearch && matchesAction && matchesType;
        });
    }, [items, search, actionFilter, typeFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, actionFilter, typeFilter]);

    // Dropdown close handlers
    useEffect(() => {
        const handleOutsideClick = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setActiveDropdown(null);
                setDropdownPosition(null);
            }
        };

        const handleEscape = event => {
            if (event.key === "Escape") {
                setActiveDropdown(null);
                setDropdownPosition(null);
            }
        };

        const handleScroll = () => {
            setActiveDropdown(null);
            setDropdownPosition(null);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const closeDropdown = () => {
        setActiveDropdown(null);
        setDropdownPosition(null);
    };

    const toggleDropdown = (event, itemId) => {
        event.stopPropagation();

        if (activeDropdown === itemId) {
            closeDropdown();
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const menuHeight = 230;
        const openUp = window.innerHeight - rect.bottom < menuHeight;

        setDropdownPosition({
            top: openUp ? rect.top - menuHeight : rect.bottom + 5,
            left: Math.max(8, rect.right - 190),
        });

        setActiveDropdown(itemId);
    };

    // Status helpers
    const getActionLabel = action => {
        const labels = {
            hidden: "Hidden",
            removed: "Removed",
            restored: "Restored",
            under_review: "Under Review",
        };

        return labels[action] || action;
    };

    const getActionClass = action => {
        const classes = {
            hidden: "warning",
            removed: "danger",
            restored: "success",
            under_review: "info",
        };

        return classes[action] || "secondary";
    };

    // Update moderation action
    const updateItemAction = (itemId, action) => {
        setItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, action }
                    : item
            )
        );

        setSelectedItem(prev =>
            prev?.id === itemId ? { ...prev, action } : prev
        );

        setModal("");
        setConfirmAction(null);
        closeDropdown();
    };

    // Delete moderation record
    const deleteRecord = itemId => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        setSelectedItem(null);
        setModal("");
        setConfirmAction(null);
        closeDropdown();
    };

    const openConfirmation = (item, action) => {
        setSelectedItem(item);
        setConfirmAction(action);
        setModal("confirm");
        closeDropdown();
    };

    const confirmationDetails = {
        hide: {
            title: "Hide Content?",
            message: "This content will be marked as hidden in this demo.",
            button: "Hide Content",
        },
        remove: {
            title: "Remove Content?",
            message: "This content will be marked as removed in this demo.",
            button: "Remove Content",
        },
        restore: {
            title: "Restore Content?",
            message: "This content will be marked as restored in this demo.",
            button: "Restore Content",
        },
        review: {
            title: "Move to Review?",
            message: "This item will be marked as under review.",
            button: "Move to Review",
        },
        delete: {
            title: "Delete Moderation Record?",
            message: "This will permanently remove the moderation record from this demo. It does not delete the original post or comment.",
            button: "Delete Record",
        },
    };

    const executeAction = () => {
        if (!selectedItem || !confirmAction) return;

        if (confirmAction === "delete") {
            deleteRecord(selectedItem.id);
            return;
        }

        const actionMap = {
            hide: "hidden",
            remove: "removed",
            restore: "restored",
            review: "under_review",
        };

        updateItemAction(
            selectedItem.id,
            actionMap[confirmAction]
        );
    };

    const openDetails = item => {
        setSelectedItem(item);
        setModal("details");
        closeDropdown();
    };

    const closeModal = () => {
        setModal("");
        setConfirmAction(null);
    };

    return (
        <div className="container-fluid px-0">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h4 className="fw-bold mb-1"
                        style={{ color: "var(--color-text-primary)" }}>
                        Moderation Management
                    </h4>
                    <p className="mb-0"
                        style={{ color: "var(--color-text-secondary)" }}>
                        Manage hidden, removed and flagged content.
                    </p>
                </div>

                <span className="badge rounded-pill px-3 py-2"
                    style={{
                        background: "var(--color-warning-light)",
                        color: "var(--color-warning)",
                    }}>
                    {stats.reviewing} Awaiting Review
                </span>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
                {[
                    {
                        title: "Total Moderated",
                        value: stats.total,
                        icon: "bi-shield-check",
                        color: "var(--color-primary)",
                    },
                    {
                        title: "Hidden Content",
                        value: stats.hidden,
                        icon: "bi-eye-slash",
                        color: "var(--color-warning)",
                    },
                    {
                        title: "Removed Content",
                        value: stats.removed,
                        icon: "bi-trash",
                        color: "var(--color-danger)",
                    },
                    {
                        title: "Under Review",
                        value: stats.reviewing,
                        icon: "bi-search",
                        color: "var(--color-info)",
                    },
                ].map((stat, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <div className="card h-100 border-0"
                            style={{
                                background: "var(--color-surface)",
                                boxShadow: "var(--shadow-sm)",
                                borderRadius: "var(--radius-lg)",
                            }}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="small mb-2"
                                        style={{ color: "var(--color-text-secondary)" }}>
                                        {stat.title}
                                    </p>
                                    <h3 className="fw-bold mb-0"
                                        style={{ color: "var(--color-text-primary)" }}>
                                        {stat.value}
                                    </h3>
                                </div>

                                <div className="rounded-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        background: "var(--color-surface-secondary)",
                                        color: stat.color,
                                        fontSize: 22,
                                    }}>
                                    <i className={`bi ${stat.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card border-0 mb-3"
                style={{
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                    borderRadius: "var(--radius-lg)",
                }}>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-lg-6">
                            <div className="input-group">
                                <span className="input-group-text border-end-0"
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-secondary)",
                                    }}>
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search ID, author, content or reason..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        borderColor: "var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-6 col-lg-3">
                            <select
                                className="form-select"
                                value={actionFilter}
                                onChange={e => setActionFilter(e.target.value)}
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-text-primary)",
                                }}>
                                <option value="all">All Actions</option>
                                <option value="hidden">Hidden</option>
                                <option value="removed">Removed</option>
                                <option value="restored">Restored</option>
                                <option value="under_review">Under Review</option>
                            </select>
                        </div>

                        <div className="col-6 col-lg-3">
                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-text-primary)",
                                }}>
                                <option value="all">All Content</option>
                                <option value="post">Posts</option>
                                <option value="comment">Comments</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Moderation Table */}
            <div className="card border-0"
                style={{
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                    borderRadius: "var(--radius-lg)",
                }}>
                <div className="card-body p-0">

                    <div className="p-3 border-bottom"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h6 className="fw-bold mb-1"
                            style={{ color: "var(--color-text-primary)" }}>
                            Moderation Records
                        </h6>
                        <small style={{ color: "var(--color-text-secondary)" }}>
                            {filteredItems.length} records found
                        </small>
                    </div>

                    <div className="table-responsive main-feed-scroll">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-secondary)",
                                }}>
                                    {[
                                        "Record",
                                        "Content Author",
                                        "Content Preview",
                                        "Reason",
                                        "Action",
                                        "Moderator",
                                        "Date",
                                        "Actions",
                                    ].map(heading => (
                                        <th key={heading}
                                            className="small fw-semibold text-nowrap px-3 py-3"
                                            style={{ borderColor: "var(--color-border)" }}>
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedItems.map(item => (
                                    <tr key={item.id}
                                        style={{ borderColor: "var(--color-border)" }}>

                                        <td className="px-3">
                                            <span className="small fw-semibold"
                                                style={{ color: "var(--color-primary)" }}>
                                                {item.id}
                                            </span>
                                            <div className="small text-capitalize mt-1"
                                                style={{ color: "var(--color-text-muted)" }}>
                                                <i className={`bi ${item.contentType === "post"
                                                    ? "bi-file-post"
                                                    : "bi-chat-left-text"} me-1`}></i>
                                                {item.contentType}
                                            </div>
                                        </td>

                                        <td className="px-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={item.avatar}
                                                    alt={item.author}
                                                    width="34"
                                                    height="34"
                                                    className="rounded-circle" />
                                                <div>
                                                    <div className="small fw-semibold text-nowrap"
                                                        style={{ color: "var(--color-text-primary)" }}>
                                                        {item.author}
                                                    </div>
                                                    <div className="small"
                                                        style={{ color: "var(--color-text-muted)" }}>
                                                        @{item.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-3"
                                            style={{ minWidth: 220, maxWidth: 280 }}>
                                            <p className="small mb-0"
                                                style={{
                                                    color: "var(--color-text-secondary)",
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}>
                                                {item.content}
                                            </p>
                                        </td>

                                        <td className="px-3">
                                            <span className="small fw-medium text-nowrap"
                                                style={{ color: "var(--color-text-primary)" }}>
                                                {item.reason}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className={`badge text-bg-${getActionClass(item.action)}`}>
                                                {getActionLabel(item.action)}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className="small"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                {item.moderator}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className="small text-nowrap"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                {item.createdAt}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm"
                                                    title="View Details"
                                                    onClick={() => openDetails(item)}
                                                    style={{
                                                        background: "var(--color-surface-secondary)",
                                                        color: "var(--color-text-primary)",
                                                    }}>
                                                    <i className="bi bi-eye"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm"
                                                    title="More Actions"
                                                    onClick={e => toggleDropdown(e, item.id)}
                                                    style={{
                                                        background: "var(--color-surface-secondary)",
                                                        color: "var(--color-text-primary)",
                                                    }}>
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {paginatedItems.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <i className="bi bi-shield-check fs-2 d-block mb-2"
                                                style={{ color: "var(--color-text-muted)" }}></i>
                                            <h6 style={{ color: "var(--color-text-primary)" }}>
                                                No moderation records found
                                            </h6>
                                            <p className="small mb-0"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                Try changing your search or filters.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredItems.length > 0 && (
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3">
                            <small style={{ color: "var(--color-text-secondary)" }}>
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
                                {filteredItems.length} records
                            </small>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        color: "var(--color-text-primary)",
                                        border: "1px solid var(--color-border)",
                                    }}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className="btn btn-sm"
                                        onClick={() => setCurrentPage(page)}
                                        style={{
                                            background: currentPage === page
                                                ? "var(--color-primary)"
                                                : "var(--color-surface-secondary)",
                                            color: currentPage === page
                                                ? "white"
                                                : "var(--color-text-primary)",
                                            border: "1px solid var(--color-border)",
                                        }}>
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className="btn btn-sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    style={{
                                        background: "var(--color-surface-secondary)",
                                        color: "var(--color-text-primary)",
                                        border: "1px solid var(--color-border)",
                                    }}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown Portal */}
            {activeDropdown && dropdownPosition && createPortal(
                <div
                    ref={dropdownRef}
                    className="dropdown-menu show p-2"
                    style={{
                        position: "fixed",
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        zIndex: 2000,
                        minWidth: 190,
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "var(--shadow-md)",
                    }}>
                    {(() => {
                        const item = items.find(i => i.id === activeDropdown);
                        if (!item) return null;

                        return (
                            <>
                                <button className="dropdown-item rounded-2"
                                    onClick={() => openDetails(item)}>
                                    <i className="bi bi-eye me-2"></i>View Details
                                </button>

                                <hr className="dropdown-divider" />

                                {item.action !== "under_review" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(item, "review")}>
                                        <i className="bi bi-search me-2"></i>Move to Review
                                    </button>
                                )}

                                {item.action !== "hidden" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(item, "hide")}>
                                        <i className="bi bi-eye-slash me-2"></i>Hide Content
                                    </button>
                                )}

                                {item.action !== "removed" && (
                                    <button className="dropdown-item rounded-2 text-danger"
                                        onClick={() => openConfirmation(item, "remove")}>
                                        <i className="bi bi-trash me-2"></i>Remove Content
                                    </button>
                                )}

                                {item.action !== "restored" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(item, "restore")}>
                                        <i className="bi bi-arrow-counterclockwise me-2"></i>Restore Content
                                    </button>
                                )}

                                <hr className="dropdown-divider" />

                                <button className="dropdown-item rounded-2 text-danger"
                                    onClick={() => openConfirmation(item, "delete")}>
                                    <i className="bi bi-trash3 me-2"></i>Delete Record
                                </button>
                            </>
                        );
                    })()}
                </div>,
                document.body
            )}

            {/* Modals */}
            {modal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 2100,
                    }}
                    onClick={closeModal}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0"
                            style={{
                                background: "var(--color-surface)",
                                color: "var(--color-text-primary)",
                                borderRadius: "var(--radius-lg)",
                            }}>

                            {modal === "details" && selectedItem && (
                                <>
                                    <div className="modal-header"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <div>
                                            <h5 className="modal-title fw-bold">
                                                Moderation Details
                                            </h5>
                                            <small style={{ color: "var(--color-text-secondary)" }}>
                                                {selectedItem.id}
                                            </small>
                                        </div>
                                        <button className="btn-close" onClick={closeModal}></button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="small"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                Current Action
                                            </span>
                                            <span className={`badge text-bg-${getActionClass(selectedItem.action)}`}>
                                                {getActionLabel(selectedItem.action)}
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <img src={selectedItem.avatar}
                                                alt=""
                                                width="42"
                                                height="42"
                                                className="rounded-circle" />
                                            <div>
                                                <div className="fw-semibold">{selectedItem.author}</div>
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    @{selectedItem.username}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-3 mb-3"
                                            style={{ background: "var(--color-surface-secondary)" }}>
                                            <small className="fw-semibold d-block mb-2">
                                                Content Preview
                                            </small>
                                            <p className="mb-0">{selectedItem.content}</p>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Content Type
                                                </small>
                                                <p className="fw-semibold text-capitalize mb-0">
                                                    {selectedItem.contentType}
                                                </p>
                                            </div>

                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Content ID
                                                </small>
                                                <p className="fw-semibold mb-0">
                                                    {selectedItem.contentId}
                                                </p>
                                            </div>

                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Reason
                                                </small>
                                                <p className="fw-semibold mb-0">
                                                    {selectedItem.reason}
                                                </p>
                                            </div>

                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Moderator
                                                </small>
                                                <p className="fw-semibold mb-0">
                                                    {selectedItem.moderator}
                                                </p>
                                            </div>

                                            <div className="col-12">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Moderation Date
                                                </small>
                                                <p className="fw-semibold mb-0">
                                                    {selectedItem.createdAt}
                                                </p>
                                            </div>
                                        </div>

                                        <hr style={{ borderColor: "var(--color-border)" }} />

                                        <small className="fw-semibold">Description</small>
                                        <p className="mb-0 mt-1"
                                            style={{ color: "var(--color-text-secondary)" }}>
                                            {selectedItem.description}
                                        </p>
                                    </div>

                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                        {selectedItem.action !== "restored" && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openConfirmation(selectedItem, "restore")}>
                                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                Restore Content
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {modal === "confirm" && selectedItem && confirmAction && (
                                <>
                                    <div className="modal-header"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <h5 className="modal-title fw-bold">
                                            {confirmationDetails[confirmAction].title}
                                        </h5>
                                        <button className="btn-close" onClick={closeModal}></button>
                                    </div>

                                    <div className="modal-body">
                                        <p className="mb-2">
                                            {confirmationDetails[confirmAction].message}
                                        </p>
                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                            Record ID: {selectedItem.id}
                                        </small>
                                    </div>

                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Cancel
                                        </button>
                                        <button
                                            className={`btn ${["remove", "delete"].includes(confirmAction)
                                                    ? "btn-danger"
                                                    : "btn-primary"
                                                }`}
                                            onClick={executeAction}>
                                            {confirmationDetails[confirmAction].button}
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moderation;
