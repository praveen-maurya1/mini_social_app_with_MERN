
// import React, { useState } from "react";

// import Sidebar from "../components/layout/Sidebar";
// import Topbar from "../components/layout/Topbar";
// import MobileNav from "../components/layout/MobileNav";

// import ChatList from "../components/chats/ChatList";
// import ChatWindow from "../components/chats/ChatWindow";

// import chats from "../data/chats";

// function Chats() {
//     const [selectedChat, setSelectedChat] = useState(null);

//     const handleSelectChat = (chat) => {
//         setSelectedChat(chat);
//     };

//     const handleBack = () => {
//         setSelectedChat(null);
//     };

//     return (
//         <div
//             style={{
//                 height: "100vh",
//                 overflow: "hidden",
//                 backgroundColor: "var(--color-background)",
//                 color: "var(--color-text-primary)",
//             }}
//         >
//             <div className="d-flex h-100">

//                 {/* Desktop Sidebar */}
//                 <div className="d-none d-lg-block flex-shrink-0">
//                     <Sidebar />
//                 </div>

//                 {/* Main Area */}
//                 <div className="flex-grow-1 min-vw-0 d-flex flex-column h-100">
//                     <Topbar />

//                     <div className="container-fluid flex-grow-1 p-0 overflow-hidden">
//                         <div className="row h-100 g-0">

//                             {/* Chat Window */}
//                             <main
//                                 className={`col-12 col-lg-8 col-xl-8 h-100 ${selectedChat
//                                         ? "d-flex"
//                                         : "d-none d-lg-flex"
//                                     }`}
//                             >
//                                 {selectedChat ? (
//                                     <div className="w-100 h-100">
//                                         <ChatWindow
//                                             key={selectedChat.id}
//                                             chat={selectedChat}
//                                             onBack={handleBack}
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="d-none d-lg-flex flex-column align-items-center justify-content-center w-100 h-100">
//                                         <i
//                                             className="bi bi-chat-square-text"
//                                             style={{
//                                                 fontSize: "56px",
//                                                 color: "var(--color-text-muted)",
//                                             }}
//                                         />

//                                         <h5 className="mt-3 fw-semibold">
//                                             Your messages
//                                         </h5>

//                                         <p
//                                             className="small"
//                                             style={{
//                                                 color: "var(--color-text-muted)",
//                                             }}
//                                         >
//                                             Select a conversation to start chatting.
//                                         </p>
//                                     </div>
//                                 )}
//                             </main>

//                             {/* Chat List */}
//                             <aside
//                                 className={`col-12 col-lg-4 col-xl-4 h-100 ${selectedChat
//                                         ? "d-none d-lg-block"
//                                         : "d-block"
//                                     }`}
//                             >
//                                 <ChatList
//                                     conversations={chats}
//                                     selectedChat={selectedChat}
//                                     onSelectChat={handleSelectChat}
//                                 />
//                             </aside>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Bottom Navigation */}
//             {!selectedChat && <MobileNav />}
//         </div>
//     );
// }

// export default Chats;





import ComingSoon from "../components/commonModule/CommingSoon";

function Search() {
    return <ComingSoon title="Search" />;
}

export default Search;