import { useState, useEffect } from "react";
import * as siteService from "../../services/siteService";
import * as labelService from "../../services/labelService";
import useEntityManager from "../../hooks/useEntityManager";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityList from "../../components/common/EntityList";
import EntityFormCard from "../../components/common/EntityFormCard";
import { createLabelServiceAdapter } from "../../utils/serviceAdapter";
import ImportExportButtons from "../../components/site/ImportExportButtons";

export default function ProfessorHome({ onNavigate }) {
    const [sites, setSites] = useState([]);
    const [sitesError, setSitesError] = useState(null);

    const labelService_ = createLabelServiceAdapter(labelService);
    const {
        items: labels,
        editingItem: editingLabel,
        formData: labelFormData,
        setFormData: setLabelFormData,
        isCreating: isCreatingLabel,
        error: labelError,
        setError: setLabelError,
        handleCreate: handleCreateLabel,
        handleUpdate: handleUpdateLabel,
        handleDelete: handleDeleteLabel,
        startEdit: startEditLabel,
        cancelEdit: cancelEditLabel,
        startCreate: startCreateLabel,
    } = useEntityManager(labelService_, "labels", { name: "" });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            setSitesError(null);
            const data = await siteService.getAllSites();
            setSites(data);
        } catch (error) {
            setSitesError(import.meta.env.VITE_ERR_LOAD);
            console.error("Erreur lors du chargement des sites :", error);
        }
    };

    const siteColumns = [
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

    const labelColumns = [{ key: "name", header: "Nom" }];

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <h1 className="display-5 mb-4">Sites</h1>

                    <ErrorAlert error={sitesError} onClose={() => setSitesError(null)} />

                    <div className="d-flex gap-2 mb-3">
                        <ImportExportButtons onImportSuccess={fetchSites} />
                        <button onClick={() => onNavigate({ view: "site", siteId: null })} className="btn btn-success">
                            Nouveau site
                        </button>
                    </div>

                    {sites.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                            Aucun site pour le moment
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        {siteColumns.map((col) => (
                                            <th key={col.key} scope="col">
                                                {col.header}
                                            </th>
                                        ))}
                                        <th scope="col" className="text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sites.map((site) => (
                                        <tr key={site.id}>
                                            {siteColumns.map((col) => (
                                                <td key={col.key}>
                                                    {col.render ? col.render(site) : site[col.key]}
                                                </td>
                                            ))}
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => onNavigate({ view: "site", siteId: site.id })}
                                                    aria-label={`Ouvrir ${site.name}`}
                                                >
                                                    <i className="bi bi-arrow-right me-1"></i>
                                                    Ouvrir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="col-md-4">
                    <h1 className="display-5 mb-4">Catégories</h1>

                    <ErrorAlert error={labelError} onClose={() => setLabelError(null)} />

                    {!isCreatingLabel && !editingLabel && (
                        <button onClick={startCreateLabel} className="btn btn-success mb-3">
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouvelle Catégorie
                        </button>
                    )}

                    {(isCreatingLabel || editingLabel) && (
                        <EntityFormCard
                            isCreating={isCreatingLabel}
                            editingItem={editingLabel}
                            onSubmit={isCreatingLabel ? handleCreateLabel : handleUpdateLabel}
                            onCancel={cancelEditLabel}
                            title={isCreatingLabel ? "Créer une catégorie" : "Modifier la catégorie"}
                        >
                            <div className="row g-3 align-items-end">
                                <div className="col">
                                    <label htmlFor="labelName" className="form-label">
                                        Nom de la catégorie
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="labelName"
                                        value={labelFormData.name}
                                        onChange={(e) => setLabelFormData({ name: e.target.value })}
                                        placeholder="Entrez le nom de la catégorie"
                                        required
                                    />
                                </div>
                            </div>
                        </EntityFormCard>
                    )}

                    <EntityList
                        items={labels}
                        columns={labelColumns}
                        onEdit={startEditLabel}
                        onDelete={(id) =>
                            handleDeleteLabel(id, "Êtes-vous sûr de vouloir supprimer cette catégorie ?")
                        }
                        emptyMessage="Aucune catégorie pour le moment"
                    />
                </div>
            </div>
        </div>
    );
}
