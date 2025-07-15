import { handleResponse } from "./AbstractApiService";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/sites`;

export const getSites = () => fetch(BASE_URL).then(handleResponse);

export const deleteSite = (id) =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

export const createSite = (body) =>
    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const updateSite = (id, body) =>
    fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);
