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

export const exportSite = async (siteId) => {
    return await apiGet(`/api/sites/${siteId}/export`);
};

export const importSite = async (importData) => {
    return await apiPost("/api/sites/import", importData);
};

export const validateImport = async (importData) => {
    return await apiPost("/api/sites/import/validate", importData);
};

export const downloadSiteAsFile = (exportData, siteName) => {
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const sanitizedName = siteName.replace(/[^a-zA-Z0-9-_àâäéèêëïîôùûüÿç\s]/g, "").trim();
    const fileName = `${sanitizedName || "site"}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
