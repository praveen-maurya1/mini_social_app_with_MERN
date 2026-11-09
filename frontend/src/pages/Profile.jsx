
// import React from "react";

// import Sidebar from "../components/layout/Sidebar";
// import Topbar from "../components/layout/Topbar";
// import MobileNav from "../components/layout/MobileNav";

// import ProfileHeader from "../components/profile/ProfileHeader";
// import ProfileHighlights from "../components/profile/ProfileHighlights";
// import ProfilePosts from "../components/profile/ProfilePosts";

// function Profile() {
//     return (
//         <div
//             className="w-100 d-flex"
//             style={{
//                 height: "100dvh",
//                 overflow: "hidden",
//                 backgroundColor: "var(--color-background)",
//                 color: "var(--color-text-primary)",
//             }}
//         >
//             {/* Desktop Sidebar */}
//             <div className="d-none d-lg-block flex-shrink-0">
//                 <Sidebar />
//             </div>

//             {/* Main Area */}
//             <div
//                 className="flex-grow-1 d-flex flex-column"
//                 style={{
//                     minWidth: 0,
//                     height: "100%",
//                 }}
//             >
//                 <Topbar />

//                 <main
//                     className="flex-grow-1 overflow-auto main-feed-scroll"
//                     style={{
//                         minWidth: 0,
//                     }}
//                 >
//                     <div
//                         className="w-100 mx-auto px-2 px-sm-3 px-md-4 px-lg-3 px-xl-4"
//                         style={{
//                             maxWidth: "1000px",
//                             paddingTop: "16px",
//                             paddingBottom: "90px",
//                         }}
//                     >
//                         <ProfileHeader />

//                         <div className="mt-4 mt-md-5">
//                             <ProfileHighlights />
//                         </div>

//                         <div className="mt-4 mt-md-5">
//                             <ProfilePosts />
//                         </div>
//                     </div>
//                 </main>
//             </div>

//             {/* Mobile Navigation */}
//             <MobileNav />
//         </div>
//     );
// }

// export default Profile;







import ComingSoon from "../components/commonModule/CommingSoon";

function Search() {
    return <ComingSoon title="Search" />;
}

export default Search;