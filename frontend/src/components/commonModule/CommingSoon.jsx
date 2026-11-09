
function ComingSoon({ title = "This feature" }) {
    return (
        <div
            className="d-flex align-items-center justify-content-center text-center p-4"
            style={{
                minHeight: "70vh",
                color: "var(--color-text-primary)",
            }}
        >
            <div style={{ maxWidth: "420px" }}>

                <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "28px",
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                        fontSize: "38px",
                    }}
                >
                    <i className="bi bi-hourglass-split" />
                </div>

                <h2 className="fw-bold mb-3">
                    Coming Soon!
                </h2>

                <p
                    className="mb-3"
                    style={{
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                    }}
                >
                    We're working hard to bring you {title.toLowerCase()}.
                    This feature will be available soon.
                </p>

                <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                        fontSize: "12px",
                    }}
                >
                    <i className="bi bi-stars me-1" />
                    Stay Tuned
                </span>

            </div>
        </div>
    );
}

export default ComingSoon;
