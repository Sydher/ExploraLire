import { createCrudService } from "./crudService";

const labelCrud = createCrudService("/api/labels");

export const getAllLabels = labelCrud.getAll;
export const createLabel = labelCrud.create;
export const updateLabel = labelCrud.update;
export const deleteLabel = labelCrud.delete;
