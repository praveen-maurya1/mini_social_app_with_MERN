
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import adminReports from "../../data/adminReports";

const Reports = () => {
    const [reports, setReports] = useState(adminReports);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedReport, setSelectedReport] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const [modal, setModal] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const dropdownRef = useRef(null);
    const itemsPerPage = 5;

    // Statistics
    const stats = useMemo(() => ({
        total: reports.length,
        pending: reports.filter(r => r.status === "pending").length,
        reviewing: reports.filter(r => r.status === "reviewing").length,
        resolved: reports.filter(r => r.status === "resolved").length,
        dismissed: reports.filter(r => r.status === "dismissed").length,
    }), [reports]);

    // Search and filters
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const query = search.toLowerCase();

            const matchesSearch =
                report.id.toLowerCase().includes(query) ||
                report.reporter.toLowerCase().includes(query) ||
                report.reporterUsername.toLowerCase().includes(query) ||
                report.contentAuthor.toLowerCase().includes(query) ||
                report.contentUsername.toLowerCase().includes(query) ||
                report.content.toLowerCase().includes(query) ||
                report.reason.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "all" || report.status === statusFilter;

            const matchesType =
                typeFilter === "all" || report.contentType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [reports, search, statusFilter, typeFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, typeFilter]);

    // Close dropdown
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setActiveDropdown(null);
                setDropdownPosition(null);
            }
        };

        const handleEscape = (event) => {
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

    // Dropdown
    const toggleDropdown = (event, reportId) => {
        event.stopPropagation();

        if (activeDropdown === reportId) {
            setActiveDropdown(null);
            setDropdownPosition(null);
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const menuHeight = 230;
        const openUp = window.innerHeight - rect.bottom < menuHeight;

        setDropdownPosition({
            top: openUp ? rect.top - menuHeight : rect.bottom + 5,
            left: Math.max(8, rect.right - 180),
        });

        setActiveDropdown(reportId);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
        setDropdownPosition(null);
    };

    // Status helpers
    const getStatusClass = (status) => {
        const classes = {
            pending: "warning",
            reviewing: "info",
            resolved: "success",
            dismissed: "secondary",
        };

        return classes[status] || "secondary";
    };

    const updateReportStatus = (reportId, status) => {
        setReports(prev =>
            prev.map(report =>
                report.id === reportId
                    ? { ...report, status }
                    : report
            )
        );

        setSelectedReport(prev =>
            prev?.id === reportId ? { ...prev, status } : prev
        );

        setConfirmAction(null);
        setModal("");
        closeDropdown();
    };

    // Content removal is separate from report resolution
    const removeReportedContent = (reportId) => {
        setReports(prev =>
            prev.map(report =>
                report.id === reportId
                    ? { ...report, contentRemoved: true }
                    : report
            )
        );

        setSelectedReport(prev =>
            prev?.id === reportId
                ? { ...prev, contentRemoved: true }
                : prev
        );

        setConfirmAction(null);
        setModal("");
        closeDropdown();
    };

    const deleteReport = (reportId) => {
        setReports(prev => prev.filter(report => report.id !== reportId));
        setSelectedReport(null);
        setConfirmAction(null);
        setModal("");
        closeDropdown();
    };

    const openConfirmation = (report, action) => {
        setSelectedReport(report);
        setConfirmAction(action);
        setModal("confirm");
        closeDropdown();
    };

    const confirmationDetails = {
        review: {
            title: "Start Review?",
            message: "This report will be marked as under review.",
            button: "Start Review",
        },
        resolve: {
            title: "Resolve Report?",
            message: "This report will be marked as resolved.",
            button: "Resolve Report",
        },
        dismiss: {
            title: "Dismiss Report?",
            message: "This report will be dismissed without further action.",
            button: "Dismiss Report",
        },
        removeContent: {
            title: "Remove Reported Content?",
            message: "This will mark the reported content as removed in this demo. It will not delete the report.",
            button: "Remove Content",
        },
        delete: {
            title: "Delete Report?",
            message: "This report will be permanently removed from this demo.",
            button: "Delete Report",
        },
    };

    const executeAction = () => {
        if (!selectedReport || !confirmAction) return;

        switch (confirmAction) {
            case "review":
                updateReportStatus(selectedReport.id, "reviewing");
                break;
            case "resolve":
                updateReportStatus(selectedReport.id, "resolved");
                break;
            case "dismiss":
                updateReportStatus(selectedReport.id, "dismissed");
                break;
            case "removeContent":
                removeReportedContent(selectedReport.id);
                break;
            case "delete":
                deleteReport(selectedReport.id);
                break;
            default:
                break;
        }
    };

    const openReportDetails = (report) => {
        setSelectedReport(report);
        setModal("details");
        closeDropdown();
    };

    const openReporterDetails = (report) => {
        setSelectedReport(report);
        setModal("reporter");
        closeDropdown();
    };

    const openContentDetails = (report) => {
        setSelectedReport(report);
        setModal("content");
        closeDropdown();
    };

    const closeModal = () => {
        setModal("");
        setConfirmAction(null);
    };

    const getContentTypeIcon = (type) => {
        return type === "post" ? "bi-file-post" : "bi-chat-left-text";
    };

    return (
        <div className="container-fluid px-0">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h4 className="fw-bold mb-1"
                        style={{ color: "var(--color-text-primary)" }}>
                        Reports Management
                    </h4>
                    <p className="mb-0"
                        style={{ color: "var(--color-text-secondary)" }}>
                        Review and manage reported posts and comments.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-pill px-3 py-2"
                        style={{
                            background: "var(--color-warning-light)",
                            color: "var(--color-warning)"
                        }}>
                        {stats.pending} Pending Reports
                    </span>
                </div>
            </div>

            {/* Statistics */}
            <div className="row g-3 mb-4">
                {[
                    {
                        title: "Total Reports",
                        value: stats.total,
                        icon: "bi-flag",
                        color: "var(--color-primary)",
                    },
                    {
                        title: "Pending",
                        value: stats.pending,
                        icon: "bi-clock-history",
                        color: "var(--color-warning)",
                    },
                    {
                        title: "Under Review",
                        value: stats.reviewing,
                        icon: "bi-search",
                        color: "var(--color-info)",
                    },
                    {
                        title: "Resolved",
                        value: stats.resolved,
                        icon: "bi-check-circle",
                        color: "var(--color-success)",
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
                                    <p className="mb-2 small"
                                        style={{ color: "var(--color-text-secondary)" }}>
                                        {stat.title}
                                    </p>
                                    <h3 className="fw-bold mb-0"
                                        style={{ color: "var(--color-text-primary)" }}>
                                        {stat.value.toLocaleString()}
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
                        <div className="col-12 col-lg-5">
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
                                    placeholder="Search reports, users, content..."
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
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                style={{
                                    backgroundColor: "var(--color-surface-secondary)",
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-text-primary)",
                                }}>
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="reviewing">Under Review</option>
                                <option value="resolved">Resolved</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>

                        <div className="col-6 col-lg-2">
                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={e => setTypeFilter(e.target.value)}
                                style={{
                                    backgroundColor: "var(--color-surface-secondary)",
                                    borderColor: "var(--color-border)",
                                    color: "var(--color-text-primary)",
                                }}>
                                <option value="all">All Content</option>
                                <option value="post">Posts</option>
                                <option value="comment">Comments</option>
                            </select>
                        </div>

                        <div className="col-12 col-lg-2">
                            <button
                                className="btn w-100"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                    setTypeFilter("all");
                                }}
                                style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-primary)",
                                    border: "1px solid var(--color-border)",
                                }}>
                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="card border-0"
                style={{
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                    borderRadius: "var(--radius-lg)",
                }}>
                <div className="card-body p-0">

                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom"
                        style={{ borderColor: "var(--color-border)" }}>
                        <div>
                            <h6 className="fw-bold mb-1"
                                style={{ color: "var(--color-text-primary)" }}>
                                All Reports
                            </h6>
                            <small style={{ color: "var(--color-text-secondary)" }}>
                                {filteredReports.length} reports found
                            </small>
                        </div>
                    </div>

                    <div className="table-responsive main-feed-scroll">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr style={{
                                    background: "var(--color-surface-secondary)",
                                    color: "var(--color-text-secondary)",
                                }}>
                                    {[
                                        "Report",
                                        "Reported By",
                                        "Reported Content",
                                        "Reason",
                                        "Reports",
                                        "Status",
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
                                {paginatedReports.map(report => (
                                    <tr key={report.id}
                                        style={{ borderColor: "var(--color-border)" }}>

                                        <td className="px-3">
                                            <span className="fw-semibold small"
                                                style={{ color: "var(--color-primary)" }}>
                                                {report.id}
                                            </span>
                                            <div className="small mt-1 text-capitalize"
                                                style={{ color: "var(--color-text-muted)" }}>
                                                <i className={`bi ${getContentTypeIcon(report.contentType)} me-1`}></i>
                                                {report.contentType}
                                            </div>
                                        </td>

                                        <td className="px-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={report.reporterAvatar}
                                                    alt={report.reporter}
                                                    className="rounded-circle"
                                                    width="34"
                                                    height="34"
                                                />
                                                <div>
                                                    <div className="small fw-semibold text-nowrap"
                                                        style={{ color: "var(--color-text-primary)" }}>
                                                        {report.reporter}
                                                    </div>
                                                    <div className="small"
                                                        style={{ color: "var(--color-text-muted)" }}>
                                                        @{report.reporterUsername}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-3" style={{ minWidth: 220, maxWidth: 280 }}>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <img
                                                    src={report.contentAvatar}
                                                    alt={report.contentAuthor}
                                                    className="rounded-circle"
                                                    width="26"
                                                    height="26"
                                                />
                                                <span className="small fw-semibold text-nowrap"
                                                    style={{ color: "var(--color-text-primary)" }}>
                                                    {report.contentAuthor}
                                                </span>
                                            </div>
                                            <p className="small mb-0"
                                                style={{
                                                    color: "var(--color-text-secondary)",
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}>
                                                {report.content}
                                            </p>
                                        </td>

                                        <td className="px-3">
                                            <span className="small fw-medium text-nowrap"
                                                style={{ color: "var(--color-text-primary)" }}>
                                                {report.reason}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className="fw-semibold small"
                                                style={{ color: "var(--color-text-primary)" }}>
                                                {report.reportsCount}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className={`badge rounded-pill text-bg-${getStatusClass(report.status)}`}>
                                                {report.status === "reviewing"
                                                    ? "Under Review"
                                                    : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <span className="small text-nowrap"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                {report.createdAt}
                                            </span>
                                        </td>

                                        <td className="px-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm"
                                                    title="View Report"
                                                    onClick={() => openReportDetails(report)}
                                                    style={{
                                                        background: "var(--color-surface-secondary)",
                                                        color: "var(--color-text-primary)",
                                                    }}>
                                                    <i className="bi bi-eye"></i>
                                                </button>

                                                <button
                                                    className="btn btn-sm"
                                                    title="More Actions"
                                                    onClick={e => toggleDropdown(e, report.id)}
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

                                {paginatedReports.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <i className="bi bi-flag fs-2 d-block mb-2"
                                                style={{ color: "var(--color-text-muted)" }}></i>
                                            <h6 style={{ color: "var(--color-text-primary)" }}>
                                                No reports found
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
                    {filteredReports.length > 0 && (
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3">
                            <small style={{ color: "var(--color-text-secondary)" }}>
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{" "}
                                {filteredReports.length} reports
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
                        minWidth: 180,
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "var(--shadow-md)",
                    }}>
                    {(() => {
                        const report = reports.find(r => r.id === activeDropdown);
                        if (!report) return null;

                        return (
                            <>
                                <button className="dropdown-item rounded-2"
                                    onClick={() => openReportDetails(report)}>
                                    <i className="bi bi-eye me-2"></i>View Report
                                </button>

                                <button className="dropdown-item rounded-2"
                                    onClick={() => openReporterDetails(report)}>
                                    <i className="bi bi-person me-2"></i>Reporter Details
                                </button>

                                <button className="dropdown-item rounded-2"
                                    onClick={() => openContentDetails(report)}>
                                    <i className="bi bi-file-earmark-text me-2"></i>View Content
                                </button>

                                <hr className="dropdown-divider" />

                                {report.status === "pending" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(report, "review")}>
                                        <i className="bi bi-search me-2"></i>Start Review
                                    </button>
                                )}

                                {report.status !== "resolved" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(report, "resolve")}>
                                        <i className="bi bi-check-circle me-2"></i>Resolve Report
                                    </button>
                                )}

                                {report.status !== "dismissed" && (
                                    <button className="dropdown-item rounded-2"
                                        onClick={() => openConfirmation(report, "dismiss")}>
                                        <i className="bi bi-x-circle me-2"></i>Dismiss Report
                                    </button>
                                )}

                                {!report.contentRemoved && (
                                    <>
                                        <hr className="dropdown-divider" />
                                        <button className="dropdown-item rounded-2 text-danger"
                                            onClick={() => openConfirmation(report, "removeContent")}>
                                            <i className="bi bi-trash me-2"></i>Remove Content
                                        </button>
                                    </>
                                )}

                                <button className="dropdown-item rounded-2 text-danger"
                                    onClick={() => openConfirmation(report, "delete")}>
                                    <i className="bi bi-trash3 me-2"></i>Delete Report
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
                    style={{ background: "rgba(0,0,0,0.5)", zIndex: 2100 }}
                    onClick={closeModal}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                        onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0"
                            style={{
                                background: "var(--color-surface)",
                                borderRadius: "var(--radius-lg)",
                                color: "var(--color-text-primary)",
                            }}>

                            {modal === "details" && selectedReport && (
                                <>
                                    <div className="modal-header"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <div>
                                            <h5 className="modal-title fw-bold">Report Details</h5>
                                            <small style={{ color: "var(--color-text-secondary)" }}>
                                                {selectedReport.id}
                                            </small>
                                        </div>
                                        <button className="btn-close" onClick={closeModal}></button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="small"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                Report Status
                                            </span>
                                            <span className={`badge text-bg-${getStatusClass(selectedReport.status)}`}>
                                                {selectedReport.status}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="small fw-semibold mb-2">Reported By</label>
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={selectedReport.reporterAvatar}
                                                    alt="" width="38" height="38"
                                                    className="rounded-circle" />
                                                <div>
                                                    <div className="fw-semibold">{selectedReport.reporter}</div>
                                                    <small style={{ color: "var(--color-text-secondary)" }}>
                                                        @{selectedReport.reporterUsername}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <hr style={{ borderColor: "var(--color-border)" }} />

                                        <div className="mb-3">
                                            <label className="small fw-semibold mb-2">Reported Content</label>
                                            <div className="p-3 rounded-3"
                                                style={{ background: "var(--color-surface-secondary)" }}>
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <img src={selectedReport.contentAvatar}
                                                        alt="" width="32" height="32"
                                                        className="rounded-circle" />
                                                    <div>
                                                        <div className="fw-semibold small">
                                                            {selectedReport.contentAuthor}
                                                        </div>
                                                        <small style={{ color: "var(--color-text-secondary)" }}>
                                                            @{selectedReport.contentUsername}
                                                        </small>
                                                    </div>
                                                </div>
                                                <p className="mb-0">{selectedReport.content}</p>
                                            </div>
                                            {selectedReport.contentRemoved && (
                                                <small className="text-danger d-block mt-2">
                                                    <i className="bi bi-trash me-1"></i>
                                                    Content marked as removed.
                                                </small>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="small fw-semibold">Reason</label>
                                            <p className="mb-0">{selectedReport.reason}</p>
                                        </div>

                                        <div className="mb-3">
                                            <label className="small fw-semibold">Report Description</label>
                                            <p className="mb-0"
                                                style={{ color: "var(--color-text-secondary)" }}>
                                                {selectedReport.description}
                                            </p>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Total Reports
                                                </small>
                                                <h5 className="fw-bold mb-0">
                                                    {selectedReport.reportsCount}
                                                </h5>
                                            </div>
                                            <div className="col-6">
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    Report Date
                                                </small>
                                                <p className="fw-semibold mb-0">
                                                    {selectedReport.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                        {selectedReport.status === "pending" && (
                                            <button className="btn btn-primary"
                                                onClick={() => openConfirmation(selectedReport, "review")}>
                                                Start Review
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {modal === "reporter" && selectedReport && (
                                <>
                                    <div className="modal-header"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <h5 className="modal-title fw-bold">Reporter Details</h5>
                                        <button className="btn-close" onClick={closeModal}></button>
                                    </div>
                                    <div className="modal-body text-center py-4">
                                        <img
                                            src={selectedReport.reporterAvatar}
                                            alt=""
                                            width="80"
                                            height="80"
                                            className="rounded-circle mb-3"
                                        />
                                        <h5 className="fw-bold mb-1">{selectedReport.reporter}</h5>
                                        <p style={{ color: "var(--color-text-secondary)" }}>
                                            @{selectedReport.reporterUsername}
                                        </p>
                                        <div className="p-3 rounded-3 mt-3"
                                            style={{ background: "var(--color-surface-secondary)" }}>
                                            <small style={{ color: "var(--color-text-secondary)" }}>
                                                Reporter ID
                                            </small>
                                            <h6 className="fw-bold mb-0">{selectedReport.reporterId}</h6>
                                        </div>
                                    </div>
                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                    </div>
                                </>
                            )}

                            {modal === "content" && selectedReport && (
                                <>
                                    <div className="modal-header"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <h5 className="modal-title fw-bold">Reported Content</h5>
                                        <button className="btn-close" onClick={closeModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <img src={selectedReport.contentAvatar}
                                                alt="" width="42" height="42"
                                                className="rounded-circle" />
                                            <div>
                                                <div className="fw-semibold">
                                                    {selectedReport.contentAuthor}
                                                </div>
                                                <small style={{ color: "var(--color-text-secondary)" }}>
                                                    @{selectedReport.contentUsername}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-3"
                                            style={{ background: "var(--color-surface-secondary)" }}>
                                            {selectedReport.content}
                                        </div>

                                        <div className="mt-3">
                                            <small style={{ color: "var(--color-text-secondary)" }}>
                                                Content Type
                                            </small>
                                            <p className="fw-semibold text-capitalize mb-0">
                                                {selectedReport.contentType}
                                            </p>
                                        </div>

                                        <div className="mt-2">
                                            <small style={{ color: "var(--color-text-secondary)" }}>
                                                Content ID
                                            </small>
                                            <p className="fw-semibold mb-0">
                                                {selectedReport.contentId}
                                            </p>
                                        </div>

                                        {selectedReport.contentRemoved && (
                                            <p className="text-danger small mt-3 mb-0">
                                                This content has been marked as removed.
                                            </p>
                                        )}
                                    </div>
                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Close
                                        </button>
                                        {!selectedReport.contentRemoved && (
                                            <button className="btn btn-danger"
                                                onClick={() => openConfirmation(selectedReport, "removeContent")}>
                                                Remove Content
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {modal === "confirm" && selectedReport && confirmAction && (
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
                                            Report ID: {selectedReport.id}
                                        </small>
                                    </div>

                                    <div className="modal-footer"
                                        style={{ borderColor: "var(--color-border)" }}>
                                        <button className="btn btn-secondary" onClick={closeModal}>
                                            Cancel
                                        </button>
                                        <button
                                            className={`btn ${["removeContent", "delete"].includes(confirmAction)
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

export default Reports;
