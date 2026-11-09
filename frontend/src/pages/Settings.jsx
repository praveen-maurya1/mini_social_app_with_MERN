
// import React, { useState } from "react";

// import Sidebar from "../components/layout/Sidebar";
// import Topbar from "../components/layout/Topbar";
// import MobileNav from "../components/layout/MobileNav";
// import Policies from "../components/settings/Policies";

// import { useTheme } from "../context/ThemeContext";
// import { themePresets } from "../config/theme";

// const settingsSections = [
//     { id: "account", label: "Account", icon: "bi-person" },
//     { id: "privacy", label: "Privacy", icon: "bi-shield-lock" },
//     { id: "notifications", label: "Notifications", icon: "bi-bell" },
//     { id: "appearance", label: "Appearance", icon: "bi-palette" },
//     { id: "security", label: "Security", icon: "bi-lock" },
//     { id: "policies", label: "Policies", icon: "bi-file-earmark-text" },
// ];

// function Settings() {
//     const [activeSection, setActiveSection] = useState("account");

//     const [preferences, setPreferences] = useState({
//         privateAccount: false,
//         onlineStatus: true,
//         activityStatus: true,
//         likes: true,
//         comments: true,
//         replies: true,
//         follows: true,
//     });
//     const { mode, accent, activeMode, setMode, setAccent, resetTheme, } = useTheme();
//     const updatePreference = (key) => {
//         setPreferences((prev) => ({
//             ...prev,
//             [key]: !prev[key],
//         }));
//     };

//     const renderToggle = (label, description, key) => (
//         <div className="d-flex align-items-center justify-content-between gap-3 py-3 border-bottom"
//             style={{ borderColor: "var(--color-border)" }}>
//             <div>
//                 <div className="fw-semibold small"
//                     style={{ color: "var(--color-text-primary)" }}>
//                     {label}
//                 </div>
//                 <small style={{ color: "var(--color-text-muted)" }}>
//                     {description}
//                 </small>
//             </div>

//             <button
//                 type="button"
//                 className="border-0 rounded-pill flex-shrink-0"
//                 onClick={() => updatePreference(key)}
//                 aria-label={`Toggle ${label}`}
//                 aria-pressed={preferences[key]}
//                 style={{
//                     width: "42px",
//                     height: "24px",
//                     padding: "3px",
//                     backgroundColor: preferences[key]
//                         ? "var(--color-primary)"
//                         : "var(--color-border)",
//                     transition: "background-color 0.2s",
//                 }}
//             >
//                 <span
//                     className="d-block rounded-circle"
//                     style={{
//                         width: "18px",
//                         height: "18px",
//                         backgroundColor: "var(--color-white)",
//                         transform: preferences[key]
//                             ? "translateX(18px)"
//                             : "translateX(0)",
//                         transition: "transform 0.2s",
//                     }}
//                 />
//             </button>
//         </div>
//     );

//     const renderAccount = () => (
//         <>
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-1">Account Information</h5>
//                 <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
//                     Manage your personal account details.
//                 </p>
//             </div>

//             <div className="d-flex align-items-center gap-3 mb-4">
//                 <img
//                     src="https://i.pravatar.cc/150?img=12"
//                     alt="Profile"
//                     width="72"
//                     height="72"
//                     className="rounded-circle"
//                 />
//                 <div>
//                     <div className="fw-semibold">Profile Photo</div>
//                     <button className="btn btn-sm mt-1 px-3"
//                         style={{
//                             backgroundColor: "var(--color-primary-light)",
//                             color: "var(--color-primary)",
//                         }}>
//                         Change Photo
//                     </button>
//                 </div>
//             </div>

//             {[
//                 ["Full Name", "Praveen Maurya"],
//                 ["Username", "praveenmaurya"],
//                 ["Email Address", "praveen@example.com"],
//             ].map(([label, value]) => (
//                 <div className="mb-3" key={label}>
//                     <label className="form-label small fw-semibold">{label}</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         defaultValue={value}
//                         style={{
//                             backgroundColor: "var(--color-surface)",
//                             color: "var(--color-text-primary)",
//                             borderColor: "var(--color-border)",
//                         }}
//                     />
//                 </div>
//             ))}

//             <button className="btn mt-2 px-4"
//                 style={{
//                     backgroundColor: "var(--color-primary)",
//                     color: "var(--color-white)",
//                 }}>
//                 Save Changes
//             </button>
//         </>
//     );

//     const renderPrivacy = () => (
//         <>
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-1">Privacy Settings</h5>
//                 <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
//                     Control your account visibility and activity.
//                 </p>
//             </div>

//             {renderToggle(
//                 "Private Account",
//                 "Only approved followers can see your posts.",
//                 "privateAccount"
//             )}

//             {renderToggle(
//                 "Online Status",
//                 "Allow others to see when you are online.",
//                 "onlineStatus"
//             )}

//             {renderToggle(
//                 "Activity Status",
//                 "Show your recent activity to other users.",
//                 "activityStatus"
//             )}
//         </>
//     );

//     const renderNotifications = () => (
//         <>
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-1">Notification Preferences</h5>
//                 <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
//                     Choose which notifications you want to receive.
//                 </p>
//             </div>

//             {renderToggle("Likes", "When someone likes your post.", "likes")}
//             {renderToggle("Comments", "When someone comments on your post.", "comments")}
//             {renderToggle("Replies", "When someone replies to your comment.", "replies")}
//             {renderToggle("New Followers", "When someone follows you.", "follows")}
//         </>
//     );

//     // const renderAppearance = () => (
//     //     <>
//     //         <div className="mb-4">
//     //             <h5 className="fw-semibold mb-1">Appearance</h5>
//     //             <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
//     //                 Customize how Caché looks on your device.
//     //             </p>
//     //         </div>

//     //         <div className="d-flex justify-content-between align-items-center py-3">
//     //             <div>
//     //                 <div className="fw-semibold small">Theme</div>
//     //                 <small style={{ color: "var(--color-text-muted)" }}>
//     //                     Choose your preferred appearance.
//     //                 </small>
//     //             </div>
//     //             <select
//     //                 className="form-select"
//     //                 style={{
//     //                     maxWidth: "140px",
//     //                     backgroundColor: "var(--color-surface)",
//     //                     color: "var(--color-text-primary)",
//     //                     borderColor: "var(--color-border)",
//     //                 }}
//     //             >
//     //                 <option>System</option>
//     //                 <option>Light</option>
//     //                 <option>Dark</option>
//     //                 {/* <option>Choose Color</option> */}
//     //             </select>
//     //         </div>
//     //     </>
//     // );


//     const renderAppearance = () => (
//         <>
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-1">Appearance</h5>
//                 <p
//                     className="small mb-0"
//                     style={{ color: "var(--color-text-muted)" }}
//                 >
//                     Personalize the look and feel of Caché.
//                 </p>
//             </div>

//             {/* Theme Mode */}
//             <div className="py-3 border-bottom"
//                 style={{ borderColor: "var(--color-border)" }}>
//                 <div className="mb-3">
//                     <div className="fw-semibold small">Appearance Mode</div>
//                     <small style={{ color: "var(--color-text-muted)" }}>
//                         Choose light, dark or follow your device settings.
//                     </small>
//                 </div>

//                 <div className="d-flex flex-wrap gap-2">
//                     {[
//                         { value: "light", label: "Light", icon: "bi-sun" },
//                         { value: "dark", label: "Dark", icon: "bi-moon" },
//                         { value: "system", label: "System", icon: "bi-display" },
//                     ].map((item) => (
//                         <button
//                             key={item.value}
//                             type="button"
//                             onClick={() => setMode(item.value)}
//                             className="btn d-flex align-items-center gap-2 px-3"
//                             style={{
//                                 backgroundColor:
//                                     mode === item.value
//                                         ? "var(--color-primary-light)"
//                                         : "var(--color-surface)",
//                                 color:
//                                     mode === item.value
//                                         ? "var(--color-primary)"
//                                         : "var(--color-text-secondary)",
//                                 border: `1px solid ${mode === item.value
//                                     ? "var(--color-primary)"
//                                     : "var(--color-border)"
//                                     }`,
//                                 borderRadius: "var(--radius-md)",
//                             }}
//                         >
//                             <i className={`bi ${item.icon}`} />
//                             <span className="small fw-semibold">
//                                 {item.label}
//                             </span>
//                         </button>
//                     ))}
//                 </div>

//                 <small
//                     className="d-block mt-2"
//                     style={{ color: "var(--color-text-muted)" }}
//                 >
//                     Currently active: {activeMode === "dark" ? "Dark" : "Light"}
//                 </small>
//             </div>

//             {/* Accent Color */}
//             <div className="py-4 border-bottom"
//                 style={{ borderColor: "var(--color-border)" }}>
//                 <div className="mb-3">
//                     <div className="fw-semibold small">Accent Color</div>
//                     <small style={{ color: "var(--color-text-muted)" }}>
//                         Choose a color for buttons, links and active elements.
//                     </small>
//                 </div>

//                 {/* Preset Colors */}
//                 <div className="d-flex flex-wrap gap-3 mb-4">
//                     {themePresets.map((preset) => {
//                         const selected =
//                             accent.toLowerCase() === preset.color.toLowerCase();

//                         return (
//                             <button
//                                 key={preset.color}
//                                 type="button"
//                                 title={preset.name}
//                                 aria-label={`Select ${preset.name} theme`}
//                                 onClick={() => setAccent(preset.color)}
//                                 className="border-0 rounded-circle d-flex align-items-center justify-content-center"
//                                 style={{
//                                     width: "38px",
//                                     height: "38px",
//                                     backgroundColor: preset.color,
//                                     outline: selected
//                                         ? "3px solid var(--color-text-primary)"
//                                         : "none",
//                                     outlineOffset: "3px",
//                                     cursor: "pointer",
//                                 }}
//                             >
//                                 {selected && (
//                                     <i className="bi bi-check-lg text-white" />
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Custom Color Picker */}
//                 <div className="d-flex align-items-center gap-3 flex-wrap">
//                     <label
//                         htmlFor="customAccentColor"
//                         className="small fw-semibold"
//                         style={{ color: "var(--color-text-primary)" }}
//                     >
//                         Custom Color
//                     </label>

//                     <input
//                         id="customAccentColor"
//                         type="color"
//                         value={accent}
//                         onChange={(e) => setAccent(e.target.value)}
//                         className="form-control form-control-color"
//                         title="Choose custom accent color"
//                         style={{
//                             width: "48px",
//                             height: "38px",
//                             padding: "3px",
//                             backgroundColor: "var(--color-surface)",
//                             borderColor: "var(--color-border)",
//                         }}
//                     />

//                     <span
//                         className="small fw-semibold text-uppercase"
//                         style={{ color: "var(--color-text-secondary)" }}
//                     >
//                         {accent}
//                     </span>
//                 </div>
//             </div>

//             {/* Preview */}
//             <div className="pt-4">
//                 <div className="fw-semibold small mb-3">Theme Preview</div>

//                 <div
//                     className="p-3"
//                     style={{
//                         backgroundColor: "var(--color-background)",
//                         border: "1px solid var(--color-border)",
//                         borderRadius: "var(--radius-lg)",
//                     }}
//                 >
//                     <div className="d-flex align-items-center justify-content-between gap-2">
//                         <div>
//                             <div
//                                 className="fw-semibold"
//                                 style={{ color: "var(--color-text-primary)" }}
//                             >
//                                 Caché Preview
//                             </div>
//                             <small style={{ color: "var(--color-text-muted)" }}>
//                                 Your selected theme
//                             </small>
//                         </div>

//                         <button
//                             className="btn btn-sm"
//                             style={{
//                                 backgroundColor: "var(--color-primary)",
//                                 color: "var(--color-white)",
//                                 borderRadius: "var(--radius-md)",
//                             }}
//                         >
//                             Follow
//                         </button>
//                     </div>

//                     <div
//                         className="mt-3 p-3"
//                         style={{
//                             backgroundColor: "var(--color-surface)",
//                             border: "1px solid var(--color-border)",
//                             borderRadius: "var(--radius-md)",
//                         }}
//                     >
//                         <span
//                             className="small fw-semibold"
//                             style={{ color: "var(--color-primary)" }}
//                         >
//                             Accent color preview
//                         </span>

//                         <p
//                             className="small mb-0 mt-1"
//                             style={{ color: "var(--color-text-secondary)" }}
//                         >
//                             Your application colors update automatically.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             {/* Reset Theme */}
//             <div className="d-flex align-items-center justify-content-between gap-3 pt-4 mt-2">
//                 <div>
//                     <div
//                         className="fw-semibold small"
//                         style={{ color: "var(--color-text-primary)" }}
//                     >
//                         Reset Appearance
//                     </div>

//                     <small style={{ color: "var(--color-text-muted)" }}>
//                         Restore the default Caché theme and colors.
//                     </small>
//                 </div>

//                 <button
//                     type="button"
//                     className="btn btn-sm d-flex align-items-center gap-2 flex-shrink-0"
//                     onClick={resetTheme}
//                     style={{
//                         color: "var(--color-danger)",
//                         backgroundColor: "var(--color-danger-light)",
//                         borderRadius: "var(--radius-md)",
//                     }}
//                 >
//                     <i className="bi bi-arrow-counterclockwise" />
//                     Reset to Default
//                 </button>
//             </div>
//         </>
//     );


//     const renderSecurity = () => (
//         <>
//             <div className="mb-4">
//                 <h5 className="fw-semibold mb-1">Security</h5>
//                 <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
//                     Manage your password and account security.
//                 </p>
//             </div>

//             <div className="py-3 border-bottom"
//                 style={{ borderColor: "var(--color-border)" }}>
//                 <div className="fw-semibold small mb-1">Password</div>
//                 <small style={{ color: "var(--color-text-muted)" }}>
//                     Keep your account secure with a strong password.
//                 </small>
//                 <div>
//                     <button className="btn btn-sm mt-2"
//                         style={{
//                             backgroundColor: "var(--color-primary-light)",
//                             color: "var(--color-primary)",
//                         }}>
//                         Change Password
//                     </button>
//                 </div>
//             </div>

//             <div className="py-3">
//                 <div className="fw-semibold small mb-1">Active Sessions</div>
//                 <small style={{ color: "var(--color-text-muted)" }}>
//                     Manage devices where you are currently logged in.
//                 </small>
//                 <div>
//                     <button className="btn btn-sm mt-2"
//                         style={{
//                             backgroundColor: "var(--color-primary-light)",
//                             color: "var(--color-primary)",
//                         }}>
//                         View Sessions
//                     </button>
//                 </div>
//             </div>
//         </>
//     );

//     const sectionContent = {
//         account: renderAccount,
//         privacy: renderPrivacy,
//         notifications: renderNotifications,
//         appearance: renderAppearance,
//         security: renderSecurity,
//         policies: () => <Policies />,
//     };

//     return (
//         <div
//             className="d-flex w-100"
//             style={{
//                 height: "100dvh",
//                 overflow: "hidden",
//                 backgroundColor: "var(--color-background)",
//                 color: "var(--color-text-primary)",
//             }}
//         >
//             <div className="d-none d-lg-block flex-shrink-0">
//                 <Sidebar />
//             </div>

//             <div className="flex-grow-1 d-flex flex-column"
//                 style={{ minWidth: 0 }}>
//                 <Topbar />

//                 <main className="flex-grow-1 overflow-auto main-feed-scroll">
//                     <div className="container-fluid px-3 px-md-4 py-4"
//                         style={{ maxWidth: "1100px" }}>

//                         <div className="mb-4">
//                             <h4 className="fw-bold mb-1">Settings</h4>
//                             <p className="small mb-0"
//                                 style={{ color: "var(--color-text-muted)" }}>
//                                 Manage your account preferences and settings.
//                             </p>
//                         </div>

//                         <div className="row g-3">
//                             {/* Settings Navigation */}
//                             <div className="col-12 col-lg-3">
//                                 <div className="d-flex flex-row flex-lg-column gap-2 overflow-auto pb-2 pb-lg-0">
//                                     {settingsSections.map((section) => (
//                                         <button
//                                             key={section.id}
//                                             type="button"
//                                             onClick={() => setActiveSection(section.id)}
//                                             className="btn border-0 d-flex align-items-center gap-2 text-start flex-shrink-0"
//                                             style={{
//                                                 backgroundColor:
//                                                     activeSection === section.id
//                                                         ? "var(--color-primary-light)"
//                                                         : "transparent",
//                                                 color:
//                                                     activeSection === section.id
//                                                         ? "var(--color-primary)"
//                                                         : "var(--color-text-secondary)",
//                                                 borderRadius: "var(--radius-md)",
//                                                 padding: "12px",
//                                             }}
//                                         >
//                                             <i className={`bi ${section.icon}`} />
//                                             <span className="small fw-semibold">
//                                                 {section.label}
//                                             </span>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Settings Content */}
//                             <div className="col-12 col-lg-9">
//                                 <div
//                                     className="p-3 p-md-4"
//                                     style={{
//                                         backgroundColor: "var(--color-surface)",
//                                         border: "1px solid var(--color-border)",
//                                         borderRadius: "var(--radius-lg)",
//                                         boxShadow: "var(--shadow-sm)",
//                                     }}
//                                 >
//                                     {sectionContent[activeSection]()}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             <MobileNav />
//         </div>
//     );
// }

// export default Settings;







import ComingSoon from "../components/commonModule/CommingSoon";

function Search() {
    return <ComingSoon title="Search" />;
}

export default Search;