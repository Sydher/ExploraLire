import { BASE_URL, handleResponse } from "./AbstractApiService";

const API_URL = `${BASE_URL}/labels`;

export const getLabels = () => fetch(API_URL).then(handleResponse);

export const deleteLabel = (id) =>
    fetch(`${API_URL}/${id}`, { method: "DELETE" });

export const createLabel = (body) =>
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const updateLabel = (id, body) =>
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);
