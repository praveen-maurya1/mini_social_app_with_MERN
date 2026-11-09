// import React from "react";
// import trends from "../../data/trends";

// function Trending() {
//     const trendingItems = trends.slice(0, 5);

//     return (
//         <section
//             className="p-3 mt-3"
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
//                     Trending
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

//             {/* Trending List */}
//             <div className="d-flex flex-column">
//                 {trendingItems.map((trend, index) => (
//                     <button
//                         key={trend.id || index}
//                         type="button"
//                         className="btn border-0 text-start px-0 py-2"
//                     >
//                         <div
//                             className="small"
//                             style={{
//                                 color: "var(--color-text-muted)",
//                             }}
//                         >
//                             Trending #{index + 1}
//                         </div>

//                         <div
//                             className="fw-semibold mt-1"
//                             style={{
//                                 color: "var(--color-text-primary)",
//                                 fontSize: "14px",
//                             }}
//                         >
//                             #{trend.name || trend.title}
//                         </div>

//                         {trend.posts !== undefined && (
//                             <div
//                                 className="small mt-1"
//                                 style={{
//                                     color: "var(--color-text-muted)",
//                                 }}
//                             >
//                                 {trend.posts} posts
//                             </div>
//                         )}
//                     </button>
//                 ))}
//             </div>
//         </section>
//     );
// }

// export default Trending;




import ComingSoon from "../commonModule/CommingSoon";

function Trending() {
    return <ComingSoon title="Trending" />;
}

export default Trending;