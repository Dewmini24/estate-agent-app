import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

/**
 * Global toast/notification stack. Kept separate from FavouritesContext on
 * purpose: the favourites reducer stays a pure function (easy to unit test),
 * while showing a notification is a side effect that belongs in the UI layer.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2600);
    }, []);

    const icon = { success: "♥", remove: "✕", info: "★" };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-stack" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast--${t.type}`}>
                        <span className="toast__icon" aria-hidden="true">{icon[t.type] || icon.info}</span>
                        <span className="toast__message">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}