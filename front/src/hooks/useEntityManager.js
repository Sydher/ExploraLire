import { useState, useEffect } from "react";

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;

export default function useEntityManager(service, entityName, initialFormData = {}) {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setError(null);
            const data = await service.getAll();
            setItems(data);
        } catch (error) {
            setError(ERR_LOAD);
            console.error(`Erreur lors du chargement des ${entityName} :`, error);
        }
    };

    const handleCreate = async (e, beforeSave = null) => {
        e.preventDefault();
        try {
            setError(null);
            const dataToSave = beforeSave ? beforeSave(formData) : formData;
            await service.create(dataToSave);
            setFormData(initialFormData);
            setIsCreating(false);
            fetchItems();
        } catch (error) {
            setError(ERR_SAVE);
            console.error("Erreur lors de la création :", error);
        }
    };

    const handleUpdate = async (e, beforeSave = null) => {
        e.preventDefault();
        try {
            setError(null);
            const dataToSave = beforeSave ? beforeSave(formData) : formData;
            await service.update(editingItem.id, dataToSave);
            setFormData(initialFormData);
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            setError(ERR_SAVE);
            console.error("Erreur lors de la modification :", error);
        }
    };

    const handleDelete = async (id, confirmMessage) => {
        if (window.confirm(confirmMessage)) {
            try {
                setError(null);
                await service.delete(id);
                fetchItems();
            } catch (error) {
                setError(ERR_DELETE);
                console.error("Erreur lors de la suppression :", error);
            }
        }
    };

    const startEdit = (item, prepareFormData = null) => {
        setEditingItem(item);
        setFormData(prepareFormData ? prepareFormData(item) : item);
        setIsCreating(false);
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setFormData(initialFormData);
        setIsCreating(false);
    };

    const startCreate = () => {
        setIsCreating(true);
        setEditingItem(null);
        setFormData(initialFormData);
    };

    return {
        items,
        editingItem,
        formData,
        setFormData,
        isCreating,
        error,
        setError,
        handleCreate,
        handleUpdate,
        handleDelete,
        startEdit,
        cancelEdit,
        startCreate,
        fetchItems,
    };
}
