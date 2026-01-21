import { createCrudService } from "./crudService";
import { apiGet, apiPost } from "./api";

const siteCrud = createCrudService("/api/sites");

export const getAllSites = siteCrud.getAll;
export const createSite = siteCrud.create;
export const updateSite = siteCrud.update;
export const deleteSite = siteCrud.delete;

export const requiresAccessCode = async (siteId) => {
    const data = await apiGet(`/api/sites/${siteId}/requires-code`);
    return data.requiresCode;
};

export const verifyAccessCode = async (siteId, code) => {
    const data = await apiPost(`/api/sites/${siteId}/verify-access`, { code });
    return data.hasAccess;
};
