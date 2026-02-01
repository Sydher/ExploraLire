import { useState, useEffect } from "react";
import * as siteService from "../../services/siteService";
import * as labelService from "../../services/labelService";
import useEntityManager from "../../hooks/useEntityManager";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityList from "../../components/common/EntityList";
import EntityFormCard from "../../components/common/EntityFormCard";
import { createSiteServiceAdapter } from "../../utils/serviceAdapter";
import ImportExportButtons from "../../components/site/ImportExportButtons";
import ExportButton from "../../components/site/ExportButton";

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
        fetchItems,
    } = useEntityManager(service, "sites", { name: "", labels: [], secretCode: "" });

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
        secretCode: site.secretCode || "",
    });

    const columns = [
        { key: "name", header: "Nom" },
        {
            key: "secretCode",
            header: "Protection",
            render: (site) =>
                site.secretCode && site.secretCode.trim() !== "" ? (
                    <span className="badge bg-warning text-dark">
                        <i className="bi bi-lock-fill me-1"></i>
                        Protégé
                    </span>
                ) : (
                    <span className="badge bg-success">
                        <i className="bi bi-unlock-fill me-1"></i>
                        Public
                    </span>
                ),
        },
        {
            key: "labels",
            header: "Catégories",
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
                    <span className="text-muted">Aucune catégorie</span>
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
                        <div className="d-flex gap-2">
                            <ImportExportButtons onImportSuccess={fetchItems} />
                            <button onClick={startCreate} className="btn btn-success">
                                Nouveau Site
                            </button>
                        </div>
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

                            <div className="mb-3">
                                <label htmlFor="siteSecretCode" className="form-label">
                                    Code secret (facultatif)
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="siteSecretCode"
                                    value={formData.secretCode}
                                    onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                                    placeholder="Laissez vide pour un site public"
                                />
                                <div className="form-text">
                                    Si vous définissez un code, les élèves devront le saisir pour accéder au
                                    site
                                </div>
                            </div>

                            <fieldset className="mb-3">
                                <legend className="form-label">Catégories associées</legend>
                                {allLabels.length === 0 ? (
                                    <p className="text-muted">Aucune catégorie disponible</p>
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
                        renderExtraActions={(site) => <ExportButton siteId={site.id} siteName={site.name} />}
                    />
                </div>
            </div>
        </div>
    );
}
