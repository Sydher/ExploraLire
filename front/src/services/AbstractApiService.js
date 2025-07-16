const ERR_GENERIC = import.meta.env.VITE_ERR_GENERIC;
export const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const handleResponse = async (res) => {
    const contentType = res.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = await res.text();
    }

    if (!res.ok) {
        // Extract Quarkus violations
        let messagesViolations;
        if (data.violations) {
            messagesViolations = data.violations.map((v) => v.message).join("\n");
        }

        const error = new Error(data.message || messagesViolations || ERR_GENERIC);
        error.status = res.status;
        error.details = data;

        throw error;
    }

    return data;
};
