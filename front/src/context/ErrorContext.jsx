import { createContext, useContext, useState } from "react";

const ERR_GENERIC = import.meta.env.VITE_ERR_GENERIC;

const ErrorContext = createContext();

export function useError() {
    return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
    const [error, setError] = useState(null);

    const showError = (message) => {
        if (message === "Failed to fetch") {
            setError(ERR_GENERIC);
        } else {
            setError(message);
        }
    };

    const clearError = () => setError(null);

    return <ErrorContext.Provider value={{ error, showError, clearError }}>{children}</ErrorContext.Provider>;
}
