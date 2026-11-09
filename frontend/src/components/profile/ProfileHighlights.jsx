
import React from "react";

const highlights = [
    {
        id: 1,
        title: "Nature",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=200",
    },
    {
        id: 2,
        title: "Travel",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200",
    },
    {
        id: 3,
        title: "Coding",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200",
    },
    {
        id: 4,
        title: "Moments",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=200",
    },
];

function ProfileHighlights() {
    return (
        <section className="px-3 px-md-4 py-4">
            <div className="d-flex align-items-center gap-4 overflow-auto">
                {/* Add Highlight */}
                <button
                    type="button"
                    className="btn border-0 p-0 flex-shrink-0 d-flex flex-column align-items-center gap-2"
                >
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "68px",
                            height: "68px",
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-surface-secondary)",
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        <i className="bi bi-plus-lg fs-3" />
                    </div>
                    <small>New</small>
                </button>

                {highlights.map((highlight) => (
                    <button
                        type="button"
                        key={highlight.id}
                        className="btn border-0 p-0 flex-shrink-0 d-flex flex-column align-items-center gap-2"
                    >
                        <div
                            className="rounded-circle p-1"
                            style={{
                                width: "76px",
                                height: "76px",
                                border: "1px solid var(--color-border)",
                            }}
                        >
                            <img
                                src={highlight.image}
                                alt={highlight.title}
                                className="rounded-circle w-100 h-100"
                                style={{ objectFit: "cover" }}
                            />
                        </div>

                        <small>{highlight.title}</small>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default ProfileHighlights;
