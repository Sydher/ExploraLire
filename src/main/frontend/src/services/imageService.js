const API_BASE_URL = import.meta.env.VITE_API_URL;

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/images`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }

    return response.json();
};

export const getImageUrl = (filename) => {
    if (!filename) return "";
    return `${API_BASE_URL}/api/images/${filename}`;
};
