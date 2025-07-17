import { BASE_URL, handleResponse } from "./AbstractApiService";

const API_URL = `${BASE_URL}/sites`;

export const getSites = () => fetch(API_URL).then(handleResponse);

export const getSite = (id) => fetch(`${API_URL}/${id}`).then(handleResponse);

export const deleteSite = (id) => fetch(`${API_URL}/${id}`, { method: "DELETE" });

export const createSite = (body) =>
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const updateSite = (id, body) =>
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const attachPage = (id, body) =>
    fetch(`${API_URL}/attach/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);
