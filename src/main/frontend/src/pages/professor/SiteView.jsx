import { useState, useEffect } from "react";
import * as siteService from "../../services/siteService";
import * as pageService from "../../services/pageService";
import * as labelService from "../../services/labelService";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityFormCard from "../../components/common/EntityFormCard";
import ExportButton from "../../components/site/ExportButton";

export default function SiteView({ siteId, onNavigate, onBack }) {
    const [site, setSite] = useState(null);
    const [pages, setPages] = useState([]);
    const [allLabels, setAllLabels] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [creating, _] = useState(!siteId);
    const [formData, setFormData] = useState({ name: "", labels: [], secretCode: "" });
    const [newPageName, setNewPageName] = useState("");
    const [creatingPage, setCreatingPage] = useState(false);

    useEffect(() => {
        fetchLabels();
        if (siteId) {
            fetchSite();
            fetchPages();
        } else {
            setLoading(false);
        }
    }, [siteId]);

    const fetchSite = async () => {
        try {
            setLoading(true);
            const data = await siteService.getSiteById(siteId);
            setSite(data);
            setFormData({
                name: data.name,
                labels: data.labels || [],
                secretCode: data.secretCode || "",
            });
        } catch (err) {
            setError(import.meta.env.VITE_ERR_LOAD);
            console.error("Erreur lors du chargement du site :", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPages = async () => {
        try {
            const allPages = await pageService.getAllPages();
            setPages(allPages.filter((p) => p.site?.id === siteId));
        } catch (err) {
            console.error("Erreur lors du chargement des pages :", err);
        }
    };

    const fetchLabels = async () => {
        try {
            const data = await labelService.getAllLabels();
            setAllLabels(data);
        } catch (err) {
            console.error("Erreur lors du chargement des labels :", err);
        }
    };

    const handleLabelToggle = (label) => {
        const isSelected = formData.labels.some((l) => l.id === label.id);
        setFormData({
            ...formData,
            labels: isSelected ? formData.labels.filter((l) => l.id !== label.id) : [...formData.labels, { id: label.id }],
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (creating) {
                const created = await siteService.createSite(formData);
                onNavigate({ view: "site", siteId: created.id });
            } else {
                await siteService.updateSite(siteId, formData);
                setEditing(false);
                fetchSite();
            }
        } catch (err) {
            setError(import.meta.env.VITE_ERR_SAVE);
            console.error("Erreur lors de la sauvegarde :", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
            try {
                await siteService.deleteSite(siteId);
                onBack();
            } catch (err) {
                setError(import.meta.env.VITE_ERR_DELETE);
                console.error("Erreur lors de la suppression :", err);
            }
        }
    };

    const handleCreatePage = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await pageService.createPage({
                name: newPageName,
                content: JSON.stringify([]),
                site: { id: siteId },
            });
            setNewPageName("");
            setCreatingPage(false);
            fetchPages();
        } catch (err) {
            setError(import.meta.env.VITE_ERR_SAVE);
            console.error("Erreur lors de la création de la page :", err);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (creating) {
        return (
            <div className="container mt-4">
                <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour
                </button>

                <ErrorAlert error={error} onClose={() => setError(null)} />

                <EntityFormCard isCreating onSubmit={handleSave} onCancel={onBack} title="Créer un site">
                    {renderSiteForm()}
                </EntityFormCard>
            </div>
        );
    }

    function renderSiteForm() {
        return (
            <>
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
                        Si vous définissez un code, les élèves devront le saisir pour accéder au site
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
                                    <label className="form-check-label" htmlFor={`label-${label.id}`}>
                                        {label.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </fieldset>
            </>
        );
    }

    return (
        <div className="container mt-4">
            <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
                <i className="bi bi-arrow-left me-2"></i>
                Retour
            </button>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="display-5 mb-2">{site?.name}</h1>
                    <div className="d-flex gap-2 align-items-center">
                        {site?.secretCode && site.secretCode.trim() !== "" ? (
                            <span className="badge bg-warning text-dark">
                                <i className="bi bi-lock-fill me-1"></i>
                                Protégé
                            </span>
                        ) : (
                            <span className="badge bg-success">
                                <i className="bi bi-unlock-fill me-1"></i>
                                Public
                            </span>
                        )}
                        {site?.labels?.map((label) => (
                            <span key={label.id} className="badge bg-secondary">
                                {label.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-warning" onClick={() => setEditing(!editing)}>
                        <i className="bi bi-pencil me-1"></i>
                        Modifier
                    </button>
                    <ExportButton siteId={siteId} siteName={site?.name} />
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <i className="bi bi-trash me-1"></i>
                        Supprimer
                    </button>
                </div>
            </div>

            {editing && (
                <EntityFormCard
                    isCreating={false}
                    editingItem={site}
                    onSubmit={handleSave}
                    onCancel={() => {
                        setEditing(false);
                        setFormData({
                            name: site.name,
                            labels: site.labels || [],
                            secretCode: site.secretCode || "",
                        });
                    }}
                    title="Modifier le site"
                >
                    {renderSiteForm()}
                </EntityFormCard>
            )}

            <hr />

            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 mb-0">Pages</h2>
                {!creatingPage && (
                    <button className="btn btn-success btn-sm" onClick={() => setCreatingPage(true)}>
                        <i className="bi bi-plus-circle me-1"></i>
                        Nouvelle page
                    </button>
                )}
            </div>

            {creatingPage && (
                <form onSubmit={handleCreatePage} className="card card-body mb-3">
                    <div className="row g-2 align-items-end">
                        <div className="col">
                            <label htmlFor="newPageName" className="form-label">
                                Nom de la page
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="newPageName"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                placeholder="Entrez le nom de la page"
                                required
                            />
                        </div>
                        <div className="col-auto d-flex gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => setCreatingPage(false)}>
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-success">
                                Créer
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {pages.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Aucune page pour ce site
                </div>
            ) : (
                <div className="list-group">
                    {pages.map((page) => (
                        <div key={page.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{page.name}</span>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => onNavigate({ view: "page", siteId, pageId: page.id })}
                                aria-label={`Ouvrir ${page.name}`}
                            >
                                <i className="bi bi-arrow-right me-1"></i>
                                Ouvrir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
