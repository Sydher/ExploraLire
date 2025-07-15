import { handleResponse } from "./AbstractApiService";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/labels`;

export const getLabels = () => fetch(BASE_URL).then(handleResponse);

export const deleteLabel = (id) =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

export const createLabel = (body) =>
    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const updateLabel = (id, body) =>
    fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);
