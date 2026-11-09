import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "info", duration = 3000) => {
        setToast({
            id: Date.now(),
            message,
            type,
            duration,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast]);

    const toastConfig = {
        success: {
            icon: "bi-check-circle-fill",
            background: "var(--color-success, var(--color-primary))",
        },
        error: {
            icon: "bi-x-circle-fill",
            background: "var(--color-danger)",
        },
        warning: {
            icon: "bi-exclamation-triangle-fill",
            background: "var(--color-warning, #b7791f)",
        },
        info: {
            icon: "bi-info-circle-fill",
            background: "var(--color-primary)",
        },
    };

    const config = toast
        ? toastConfig[toast.type] || toastConfig.info
        : null;

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {toast && (
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{
                        zIndex: 9999,
                        maxWidth: "100%",
                        width: "380px",
                    }}
                >
                    <div
                        className="d-flex align-items-center gap-3 rounded-3 shadow-lg p-3 text-white"
                        role="alert"
                        aria-live="assertive"
                        style={{
                            backgroundColor: config.background,
                            animation: "toastSlideIn 0.25s ease",
                        }}
                    >
                        <i className={`bi ${config.icon} fs-5 flex-shrink-0`} />

                        <div className="flex-grow-1 small fw-medium">
                            {toast.message}
                        </div>

                        <button
                            type="button"
                            className="btn-close btn-close-white flex-shrink-0"
                            aria-label="Close"
                            onClick={hideToast}
                        />
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}