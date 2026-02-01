import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const createCrudService = (endpoint) => {
    return {
        getAll: async () => {
            return apiGet(endpoint);
        },

        getById: async (id) => {
            return apiGet(`${endpoint}/${id}`);
        },

        create: async (data) => {
            return apiPost(endpoint, data);
        },

        update: async (id, data) => {
            return apiPut(`${endpoint}/${id}`, data);
        },

        delete: async (id) => {
            return apiDelete(`${endpoint}/${id}`);
        },
    };
};
