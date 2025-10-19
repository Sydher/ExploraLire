import { createCrudService } from "./crudService";

const siteCrud = createCrudService("/api/sites");

export const getAllSites = siteCrud.getAll;
export const createSite = siteCrud.create;
export const updateSite = siteCrud.update;
export const deleteSite = siteCrud.delete;
