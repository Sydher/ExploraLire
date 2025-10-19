import { useState, useEffect } from "react";
import * as siteService from "../../services/siteService";
import * as labelService from "../../services/labelService";
import useEntityManager from "../../hooks/useEntityManager";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityList from "../../components/common/EntityList";
import EntityFormCard from "../../components/common/EntityFormCard";
import { createSiteServiceAdapter } from "../../utils/serviceAdapter";

export default function SiteManagement() {
    const [allLabels, setAllLabels] = useState([]);
    const service = createSiteServiceAdapter(siteService);

    const {
        items: sites,
        editingItem: editingSite,
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
    } = useEntityManager(service, "sites", { name: "", labels: [] });

    useEffect(() => {
        fetchLabels();
    }, []);

    const fetchLabels = async () => {
        try {
            const data = await labelService.getAllLabels();
            setAllLabels(data);
        } catch (error) {
            console.error("Erreur lors du chargement des labels :", error);
        }
    };

    const handleLabelToggle = (label) => {
        const isSelected = formData.labels.some((l) => l.id === label.id);
        if (isSelected) {
            setFormData({
                ...formData,
                labels: formData.labels.filter((l) => l.id !== label.id),
            });
        } else {
            setFormData({
                ...formData,
                labels: [...formData.labels, { id: label.id }],
            });
        }
    };

    const prepareFormData = (site) => ({
        name: site.name,
        labels: site.labels || [],
    });

    const columns = [
        { key: "name", header: "Nom" },
        {
            key: "labels",
            header: "Labels",
            render: (site) =>
                site.labels && site.labels.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                        {site.labels.map((label) => (
                            <span key={label.id} className="badge bg-secondary">
                                {label.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-muted">Aucun label</span>
                ),
        },
    ];

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="display-5">Gestion des Sites</h1>
                </div>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            <div className="row mb-3">
                <div className="col">
                    {!isCreating && !editingSite && (
                        <button onClick={startCreate} className="btn btn-success">
                            Nouveau Site
                        </button>
                    )}

                    {(isCreating || editingSite) && (
                        <EntityFormCard
                            isCreating={isCreating}
                            editingItem={editingSite}
                            onSubmit={isCreating ? handleCreate : handleUpdate}
                            onCancel={cancelEdit}
                            title={isCreating ? "Créer un site" : "Modifier le site"}
                        >
                            <div className="mb-3">
                                <label htmlFor="siteName" className="form-label">
                                    Nom du site
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="siteName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Entrez le nom du site"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <fieldset className="mb-3">
                                <legend className="form-label">Labels associés</legend>
                                {allLabels.length === 0 ? (
                                    <p className="text-muted">Aucun label disponible</p>
                                ) : (
                                    <div className="d-flex flex-wrap gap-2">
                                        {allLabels.map((label) => (
                                            <div key={label.id} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`label-${label.id}`}
                                                    checked={formData.labels.some((l) => l.id === label.id)}
                                                    onChange={() => handleLabelToggle(label)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`label-${label.id}`}
                                                >
                                                    {label.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </fieldset>
                        </EntityFormCard>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <EntityList
                        items={sites}
                        columns={columns}
                        onEdit={(site) => startEdit(site, prepareFormData)}
                        onDelete={(id) => handleDelete(id, "Êtes-vous sûr de vouloir supprimer ce site ?")}
                        emptyMessage="Aucun site pour le moment"
                    />
                </div>
            </div>
        </div>
    );
}
