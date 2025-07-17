import { BASE_URL, handleResponse } from "./AbstractApiService";

const API_URL = `${BASE_URL}/pages`;

export const getPages = (page = 0) => fetch(`${API_URL}?page=${page}`).then(handleResponse);

export const deletePage = (id) => fetch(`${API_URL}/${id}`, { method: "DELETE" });

export const createPage = (body) =>
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);

export const updatePage = (id, body) =>
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse);
