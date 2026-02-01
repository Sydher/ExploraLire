import { createCrudService } from "./crudService";

const pageCrud = createCrudService("/api/pages");

export const getAllPages = pageCrud.getAll;
export const getPageById = pageCrud.getById;
export const createPage = pageCrud.create;
export const updatePage = pageCrud.update;
export const deletePage = pageCrud.delete;
