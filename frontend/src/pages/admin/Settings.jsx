
// import React, { useState } from "react";

// const defaultSettings = {
//     general: {
//         platformName: "Caché",
//         tagline: "Connect. Share. Discover.",
//         supportEmail: "support@cache.com",
//         websiteUrl: "https://cache.com",
//         timezone: "Asia/Kolkata",
//         language: "English",
//     },
//     users: {
//         allowRegistration: true,
//         requireEmailVerification: true,
//         requirePhoneVerification: false,
//         allowProfileEditing: true,
//         allowUsernameChange: true,
//         defaultUserStatus: "active",
//     },
//     posts: {
//         allowPostCreation: true,
//         allowImageUploads: true,
//         allowVideoUploads: true,
//         allowComments: true,
//         allowLikes: true,
//         allowSharing: true,
//         maxImagesPerPost: 10,
//         maxPostLength: 5000,
//     },
//     moderation: {
//         autoModeration: true,
//         autoHideReportedContent: false,
//         reportThreshold: 5,
//         allowUserReporting: true,
//         requireAdminApproval: false,
//     },
//     notifications: {
//         emailNotifications: true,
//         newUserNotifications: true,
//         newReportNotifications: true,
//         moderationNotifications: true,
//         systemNotifications: true,
//     },
//     maintenance: {
//         maintenanceMode: false,
//         maintenanceMessage: "Caché is currently under maintenance. Please check back soon.",
//     },
// };

// const Settings = () => {
//     const [settings, setSettings] = useState(defaultSettings);
//     const [activeTab, setActiveTab] = useState("general");
//     const [saved, setSaved] = useState(false);
//     const [showResetConfirm, setShowResetConfirm] = useState(false);

//     const tabs = [
//         { id: "general", label: "General", icon: "bi-gear" },
//         { id: "users", label: "User Settings", icon: "bi-people" },
//         { id: "posts", label: "Post Settings", icon: "bi-file-post" },
//         { id: "moderation", label: "Moderation", icon: "bi-shield-check" },
//         { id: "notifications", label: "Notifications", icon: "bi-bell" },
//         { id: "maintenance", label: "Maintenance", icon: "bi-tools" },
//     ];

//     const updateSetting = (section, key, value) => {
//         setSettings(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [key]: value,
//             },
//         }));

//         setSaved(false);
//     };

//     const handleSave = () => {
//         // Backend API integration will be added later.
//         console.log("Updated platform settings:", settings);
//         setSaved(true);
//     };

//     const handleReset = () => {
//         setSettings(defaultSettings);
//         setSaved(false);
//         setShowResetConfirm(false);
//     };

//     const inputStyle = {
//         background: "var(--color-surface-secondary)",
//         borderColor: "var(--color-border)",
//         color: "var(--color-text-primary)",
//     };

//     const sectionStyle = {
//         background: "var(--color-surface)",
//         borderRadius: "var(--radius-lg)",
//         boxShadow: "var(--shadow-sm)",
//         border: "1px solid var(--color-border)",
//     };

//     const renderInput = (section, key, label, placeholder = "", type = "text") => (
//         <div className="mb-3">
//             <label className="form-label small fw-semibold"
//                 style={{ color: "var(--color-text-primary)" }}>
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 className="form-control"
//                 value={settings[section][key]}
//                 placeholder={placeholder}
//                 onChange={e => updateSetting(section, key, e.target.value)}
//                 style={inputStyle}
//             />
//         </div>
//     );

//     const renderSelect = (section, key, label, options) => (
//         <div className="mb-3">
//             <label className="form-label small fw-semibold"
//                 style={{ color: "var(--color-text-primary)" }}>
//                 {label}
//             </label>
//             <select
//                 className="form-select"
//                 value={settings[section][key]}
//                 onChange={e => updateSetting(section, key, e.target.value)}
//                 style={inputStyle}>
//                 {options.map(option => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );

//     const renderNumber = (section, key, label, min, max) => (
//         <div className="mb-3">
//             <label className="form-label small fw-semibold"
//                 style={{ color: "var(--color-text-primary)" }}>
//                 {label}
//             </label>
//             <input
//                 type="number"
//                 className="form-control"
//                 min={min}
//                 max={max}
//                 value={settings[section][key]}
//                 onChange={e => updateSetting(section, key, Number(e.target.value))}
//                 style={inputStyle}
//             />
//         </div>
//     );

//     const renderToggle = (section, key, title, description) => (
//         <div className="d-flex justify-content-between align-items-center gap-3 py-3"
//             style={{ borderBottom: "1px solid var(--color-border)" }}>
//             <div>
//                 <div className="fw-semibold small"
//                     style={{ color: "var(--color-text-primary)" }}>
//                     {title}
//                 </div>
//                 <small style={{ color: "var(--color-text-secondary)" }}>
//                     {description}
//                 </small>
//             </div>

//             <div className="form-check form-switch mb-0 flex-shrink-0">
//                 <input
//                     className="form-check-input"
//                     type="checkbox"
//                     role="switch"
//                     checked={settings[section][key]}
//                     onChange={e => updateSetting(section, key, e.target.checked)}
//                     style={{ cursor: "pointer" }}
//                 />
//             </div>
//         </div>
//     );

//     const renderSectionHeader = (title, description) => (
//         <div className="mb-4">
//             <h6 className="fw-bold mb-1"
//                 style={{ color: "var(--color-text-primary)" }}>
//                 {title}
//             </h6>
//             <p className="small mb-0"
//                 style={{ color: "var(--color-text-secondary)" }}>
//                 {description}
//             </p>
//         </div>
//     );

//     return (
//         <div className="container-fluid px-0">

//             {/* Header */}
//             <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
//                 <div>
//                     <h4 className="fw-bold mb-1"
//                         style={{ color: "var(--color-text-primary)" }}>
//                         Platform Settings
//                     </h4>
//                     <p className="mb-0"
//                         style={{ color: "var(--color-text-secondary)" }}>
//                         Configure and manage your Caché platform.
//                     </p>
//                 </div>

//                 <div className="d-flex gap-2">
//                     <button
//                         className="btn"
//                         onClick={() => setShowResetConfirm(true)}
//                         style={{
//                             background: "var(--color-surface-secondary)",
//                             color: "var(--color-text-primary)",
//                             border: "1px solid var(--color-border)",
//                         }}>
//                         <i className="bi bi-arrow-counterclockwise me-2"></i>
//                         Reset
//                     </button>

//                     <button
//                         className="btn"
//                         onClick={handleSave}
//                         style={{
//                             background: "var(--color-primary)",
//                             color: "white",
//                         }}>
//                         <i className="bi bi-check-lg me-2"></i>
//                         Save Changes
//                     </button>
//                 </div>
//             </div>

//             {/* Save Message */}
//             {saved && (
//                 <div className="alert d-flex align-items-center gap-2 mb-4"
//                     role="alert"
//                     style={{
//                         background: "var(--color-success-light)",
//                         color: "var(--color-success)",
//                         border: "1px solid var(--color-border)",
//                     }}>
//                     <i className="bi bi-check-circle-fill"></i>
//                     Settings updated successfully in the current demo session.
//                 </div>
//             )}

//             <div className="row g-3">

//                 {/* Settings Sidebar */}
//                 <div className="col-12 col-xl-3">
//                     <div className="card border-0"
//                         style={sectionStyle}>
//                         <div className="card-body p-2">
//                             <div className="px-3 pt-3 pb-2">
//                                 <small className="fw-semibold text-uppercase"
//                                     style={{
//                                         color: "var(--color-text-muted)",
//                                         letterSpacing: "0.7px",
//                                     }}>
//                                     Configuration
//                                 </small>
//                             </div>

//                             <div className="nav flex-column gap-1">
//                                 {tabs.map(tab => (
//                                     <button
//                                         key={tab.id}
//                                         className="btn text-start d-flex align-items-center gap-3 px-3 py-3"
//                                         onClick={() => setActiveTab(tab.id)}
//                                         style={{
//                                             background: activeTab === tab.id
//                                                 ? "var(--color-surface-secondary)"
//                                                 : "transparent",
//                                             color: activeTab === tab.id
//                                                 ? "var(--color-primary)"
//                                                 : "var(--color-text-secondary)",
//                                             border: "none",
//                                             fontWeight: activeTab === tab.id ? 600 : 400,
//                                         }}>
//                                         <i className={`bi ${tab.icon}`}></i>
//                                         <span>{tab.label}</span>
//                                         {activeTab === tab.id && (
//                                             <i className="bi bi-chevron-right ms-auto"></i>
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Settings Content */}
//                 <div className="col-12 col-xl-9">
//                     <div className="card border-0"
//                         style={sectionStyle}>
//                         <div className="card-body p-3 p-md-4">

//                             {/* General */}
//                             {activeTab === "general" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "General Settings",
//                                         "Manage your platform's basic information and regional preferences."
//                                     )}

//                                     <div className="row">
//                                         <div className="col-md-6">
//                                             {renderInput("general", "platformName", "Platform Name")}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderInput("general", "tagline", "Platform Tagline")}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderInput("general", "supportEmail", "Support Email", "", "email")}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderInput("general", "websiteUrl", "Website URL", "", "url")}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderSelect("general", "timezone", "Timezone", [
//                                                 { value: "Asia/Kolkata", label: "India (IST)" },
//                                                 { value: "Asia/Dubai", label: "Dubai (GST)" },
//                                                 { value: "Europe/London", label: "London (GMT)" },
//                                                 { value: "America/New_York", label: "New York (EST)" },
//                                                 { value: "Asia/Tokyo", label: "Tokyo (JST)" },
//                                             ])}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderSelect("general", "language", "Default Language", [
//                                                 { value: "English", label: "English" },
//                                                 { value: "Hindi", label: "Hindi" },
//                                             ])}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}

//                             {/* Users */}
//                             {activeTab === "users" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "User Settings",
//                                         "Control registration, verification and user account permissions."
//                                     )}

//                                     {renderToggle(
//                                         "users",
//                                         "allowRegistration",
//                                         "Allow User Registration",
//                                         "Allow new users to create accounts on Caché."
//                                     )}

//                                     {renderToggle(
//                                         "users",
//                                         "requireEmailVerification",
//                                         "Require Email Verification",
//                                         "Users must verify their email address."
//                                     )}

//                                     {renderToggle(
//                                         "users",
//                                         "requirePhoneVerification",
//                                         "Require Phone Verification",
//                                         "Users must verify their phone number."
//                                     )}

//                                     {renderToggle(
//                                         "users",
//                                         "allowProfileEditing",
//                                         "Allow Profile Editing",
//                                         "Users can update their profile information."
//                                     )}

//                                     {renderToggle(
//                                         "users",
//                                         "allowUsernameChange",
//                                         "Allow Username Changes",
//                                         "Users can change their usernames."
//                                     )}

//                                     <div className="mt-4">
//                                         {renderSelect("users", "defaultUserStatus", "Default New User Status", [
//                                             { value: "active", label: "Active" },
//                                             { value: "pending", label: "Pending Approval" },
//                                         ])}
//                                     </div>
//                                 </>
//                             )}

//                             {/* Posts */}
//                             {activeTab === "posts" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "Post Settings",
//                                         "Configure content creation and interaction permissions."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowPostCreation",
//                                         "Allow Post Creation",
//                                         "Users can publish new posts."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowImageUploads",
//                                         "Allow Image Uploads",
//                                         "Users can attach images to posts."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowVideoUploads",
//                                         "Allow Video Uploads",
//                                         "Users can attach videos to posts."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowComments",
//                                         "Allow Comments",
//                                         "Users can comment on posts."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowLikes",
//                                         "Allow Likes",
//                                         "Users can like posts."
//                                     )}

//                                     {renderToggle(
//                                         "posts",
//                                         "allowSharing",
//                                         "Allow Post Sharing",
//                                         "Users can share posts."
//                                     )}

//                                     <div className="row mt-4">
//                                         <div className="col-md-6">
//                                             {renderNumber("posts", "maxImagesPerPost", "Maximum Images Per Post", 1, 50)}
//                                         </div>
//                                         <div className="col-md-6">
//                                             {renderNumber("posts", "maxPostLength", "Maximum Post Characters", 100, 10000)}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}

//                             {/* Moderation */}
//                             {activeTab === "moderation" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "Content Moderation",
//                                         "Configure automated moderation and community reporting policies."
//                                     )}

//                                     {renderToggle(
//                                         "moderation",
//                                         "autoModeration",
//                                         "Enable Auto Moderation",
//                                         "Enable automated checks for potentially harmful content."
//                                     )}

//                                     {renderToggle(
//                                         "moderation",
//                                         "autoHideReportedContent",
//                                         "Automatically Hide Reported Content",
//                                         "Automatically hide content after reaching the report threshold."
//                                     )}

//                                     {renderToggle(
//                                         "moderation",
//                                         "allowUserReporting",
//                                         "Allow User Reporting",
//                                         "Allow users to report posts and comments."
//                                     )}

//                                     {renderToggle(
//                                         "moderation",
//                                         "requireAdminApproval",
//                                         "Require Admin Approval",
//                                         "Require admin approval before flagged content is published."
//                                     )}

//                                     <div className="mt-4">
//                                         {renderNumber(
//                                             "moderation",
//                                             "reportThreshold",
//                                             "Report Threshold",
//                                             1,
//                                             100
//                                         )}
//                                         <small style={{ color: "var(--color-text-secondary)" }}>
//                                             Number of reports required to trigger the configured report action.
//                                         </small>
//                                     </div>
//                                 </>
//                             )}

//                             {/* Notifications */}
//                             {activeTab === "notifications" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "Notification Settings",
//                                         "Choose which platform events should trigger admin notifications."
//                                     )}

//                                     {renderToggle(
//                                         "notifications",
//                                         "emailNotifications",
//                                         "Email Notifications",
//                                         "Enable email notifications for admin events."
//                                     )}

//                                     {renderToggle(
//                                         "notifications",
//                                         "newUserNotifications",
//                                         "New User Notifications",
//                                         "Get notified when a new user registers."
//                                     )}

//                                     {renderToggle(
//                                         "notifications",
//                                         "newReportNotifications",
//                                         "New Report Notifications",
//                                         "Get notified when content is reported."
//                                     )}

//                                     {renderToggle(
//                                         "notifications",
//                                         "moderationNotifications",
//                                         "Moderation Notifications",
//                                         "Get notified about moderation actions."
//                                     )}

//                                     {renderToggle(
//                                         "notifications",
//                                         "systemNotifications",
//                                         "System Notifications",
//                                         "Get notified about important platform events."
//                                     )}
//                                 </>
//                             )}

//                             {/* Maintenance */}
//                             {activeTab === "maintenance" && (
//                                 <>
//                                     {renderSectionHeader(
//                                         "Maintenance Mode",
//                                         "Temporarily restrict platform access during maintenance."
//                                     )}

//                                     <div className="p-3 rounded-3 mb-4"
//                                         style={{
//                                             background: settings.maintenance.maintenanceMode
//                                                 ? "var(--color-warning-light)"
//                                                 : "var(--color-surface-secondary)",
//                                             border: "1px solid var(--color-border)",
//                                         }}>
//                                         <div className="d-flex align-items-center justify-content-between gap-3">
//                                             <div>
//                                                 <div className="fw-semibold"
//                                                     style={{ color: "var(--color-text-primary)" }}>
//                                                     Maintenance Mode
//                                                 </div>
//                                                 <small style={{ color: "var(--color-text-secondary)" }}>
//                                                     {settings.maintenance.maintenanceMode
//                                                         ? "Maintenance mode is enabled."
//                                                         : "Your platform is currently available."}
//                                                 </small>
//                                             </div>

//                                             <div className="form-check form-switch mb-0">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     role="switch"
//                                                     checked={settings.maintenance.maintenanceMode}
//                                                     onChange={e => updateSetting(
//                                                         "maintenance",
//                                                         "maintenanceMode",
//                                                         e.target.checked
//                                                     )}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="mb-3">
//                                         <label className="form-label small fw-semibold"
//                                             style={{ color: "var(--color-text-primary)" }}>
//                                             Maintenance Message
//                                         </label>
//                                         <textarea
//                                             className="form-control"
//                                             rows="4"
//                                             value={settings.maintenance.maintenanceMessage}
//                                             onChange={e => updateSetting(
//                                                 "maintenance",
//                                                 "maintenanceMessage",
//                                                 e.target.value
//                                             )}
//                                             style={inputStyle}
//                                         />
//                                     </div>

//                                     <div className="alert d-flex gap-2 align-items-start"
//                                         style={{
//                                             background: "var(--color-warning-light)",
//                                             color: "var(--color-text-primary)",
//                                             border: "1px solid var(--color-border)",
//                                         }}>
//                                         <i className="bi bi-exclamation-triangle-fill mt-1"></i>
//                                         <small>
//                                             Enabling this option only changes the frontend demo setting.
//                                             Actual platform access restrictions must be enforced by the backend.
//                                         </small>
//                                     </div>
//                                 </>
//                             )}

//                             {/* Bottom Save */}
//                             <div className="d-flex justify-content-end mt-4 pt-3"
//                                 style={{ borderTop: "1px solid var(--color-border)" }}>
//                                 <button
//                                     className="btn px-4"
//                                     onClick={handleSave}
//                                     style={{
//                                         background: "var(--color-primary)",
//                                         color: "white",
//                                     }}>
//                                     <i className="bi bi-check-lg me-2"></i>
//                                     Save Changes
//                                 </button>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Reset Confirmation */}
//             {showResetConfirm && (
//                 <div
//                     className="modal d-block"
//                     tabIndex="-1"
//                     style={{
//                         background: "rgba(0,0,0,0.5)",
//                         zIndex: 2100,
//                     }}
//                     onClick={() => setShowResetConfirm(false)}>
//                     <div className="modal-dialog modal-dialog-centered"
//                         onClick={e => e.stopPropagation()}>
//                         <div className="modal-content border-0"
//                             style={{
//                                 background: "var(--color-surface)",
//                                 color: "var(--color-text-primary)",
//                                 borderRadius: "var(--radius-lg)",
//                             }}>
//                             <div className="modal-header"
//                                 style={{ borderColor: "var(--color-border)" }}>
//                                 <h5 className="modal-title fw-bold">Reset Settings?</h5>
//                                 <button
//                                     className="btn-close"
//                                     onClick={() => setShowResetConfirm(false)}>
//                                 </button>
//                             </div>

//                             <div className="modal-body">
//                                 This will restore all settings to their default values.
//                                 Your current changes will be lost.
//                             </div>

//                             <div className="modal-footer"
//                                 style={{ borderColor: "var(--color-border)" }}>
//                                 <button
//                                     className="btn btn-secondary"
//                                     onClick={() => setShowResetConfirm(false)}>
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="btn btn-danger"
//                                     onClick={handleReset}>
//                                     Reset Settings
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Settings;
