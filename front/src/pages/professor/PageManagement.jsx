import { useState, useEffect } from "react";
import * as pageService from "../../services/pageService";
import * as siteService from "../../services/siteService";
import BlockEditor from "../../components/BlockEditor";
import useEntityManager from "../../hooks/useEntityManager";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityList from "../../components/common/EntityList";
import EntityFormCard from "../../components/common/EntityFormCard";
import { createPageServiceAdapter } from "../../utils/serviceAdapter";

export default function PageManagement() {
    const [allSites, setAllSites] = useState([]);
    const service = createPageServiceAdapter(pageService);

    const {
        items: pages,
        editingItem: editingPage,
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
    } = useEntityManager(service, "pages", { name: "", content: [], site: null });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const data = await siteService.getAllSites();
            setAllSites(data);
        } catch (error) {
            console.error("Erreur lors du chargement des sites :", error);
        }
    };

    const prepareFormDataForEdit = (page) => {
        let parsedContent = [];
        try {
            parsedContent = page.content ? JSON.parse(page.content) : [];
        } catch (error) {
            console.error("Erreur lors du parsing du contenu:", error);
            parsedContent = [];
        }
        return {
            name: page.name,
            content: parsedContent,
            site: page.site,
        };
    };

    const beforeSave = (data) => ({
        ...data,
        content: JSON.stringify(data.content),
    });

    const columns = [
        { key: "name", header: "Nom" },
        {
            key: "site",
            header: "Site",
            render: (page) => page.site?.name || "-",
        },
    ];

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="display-5">Gestion des Pages</h1>
                </div>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            <div className="row mb-3">
                <div className="col">
                    {!isCreating && !editingPage && (
                        <button onClick={startCreate} className="btn btn-success">
                            Nouvelle Page
                        </button>
                    )}

                    {(isCreating || editingPage) && (
                        <EntityFormCard
                            isCreating={isCreating}
                            editingItem={editingPage}
                            onSubmit={(e) =>
                                isCreating ? handleCreate(e, beforeSave) : handleUpdate(e, beforeSave)
                            }
                            onCancel={cancelEdit}
                            title={isCreating ? "Créer une page" : "Modifier la page"}
                        >
                            <div className="mb-3">
                                <label htmlFor="pageName" className="form-label">
                                    Nom de la page
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="pageName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Entrez le nom de la page"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contenu de la page</label>
                                <BlockEditor
                                    blocks={formData.content}
                                    onChange={(blocks) => setFormData({ ...formData, content: blocks })}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="pageSite" className="form-label">
                                    Site associé
                                </label>
                                <select
                                    className="form-select"
                                    id="pageSite"
                                    value={formData.site?.id || ""}
                                    onChange={(e) => {
                                        const siteId = e.target.value ? parseInt(e.target.value) : null;
                                        setFormData({
                                            ...formData,
                                            site: siteId ? { id: siteId } : null,
                                        });
                                    }}
                                    required
                                    aria-required="true"
                                >
                                    <option value="">Sélectionnez un site</option>
                                    {allSites.map((site) => (
                                        <option key={site.id} value={site.id}>
                                            {site.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </EntityFormCard>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <EntityList
                        items={pages}
                        columns={columns}
                        onEdit={(page) => startEdit(page, prepareFormDataForEdit)}
                        onDelete={(id) => handleDelete(id, "Êtes-vous sûr de vouloir supprimer cette page ?")}
                        emptyMessage="Aucune page pour le moment"
                    />
                </div>
            </div>
        </div>
    );
}
