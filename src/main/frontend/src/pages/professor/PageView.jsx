import { useState, useEffect } from "react";
import * as pageService from "../../services/pageService";
import BlockEditor from "../../components/BlockEditor";
import ErrorAlert from "../../components/common/ErrorAlert";

export default function PageView({ siteId, pageId, onBack }) {
    const [page, setPage] = useState(null);
    const [formData, setFormData] = useState({ name: "", content: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPage();
    }, [pageId]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            const data = await pageService.getPageById(pageId);
            setPage(data);

            let parsedContent = [];
            try {
                parsedContent = data.content ? JSON.parse(data.content) : [];
            } catch {
                parsedContent = [];
            }

            setFormData({ name: data.name, content: parsedContent });
        } catch (err) {
            setError(import.meta.env.VITE_ERR_LOAD);
            console.error("Erreur lors du chargement de la page :", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await pageService.updatePage(pageId, {
                ...formData,
                content: JSON.stringify(formData.content),
                site: { id: siteId },
            });
            fetchPage();
        } catch (err) {
            setError(import.meta.env.VITE_ERR_SAVE);
            console.error("Erreur lors de la sauvegarde :", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) {
            try {
                await pageService.deletePage(pageId);
                onBack();
            } catch (err) {
                setError(import.meta.env.VITE_ERR_DELETE);
                console.error("Erreur lors de la suppression :", err);
            }
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

    return (
        <div className="container mt-4">
            <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
                <i className="bi bi-arrow-left me-2"></i>
                Retour
            </button>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="display-5 mb-1">{page?.name}</h1>
                    <span className="text-muted">Site : {page?.site?.name}</span>
                </div>
                <button className="btn btn-danger" onClick={handleDelete}>
                    <i className="bi bi-trash me-1"></i>
                    Supprimer
                </button>
            </div>

            <form onSubmit={handleSave}>
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

                <div className="d-flex gap-2 justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-check-lg me-1"></i>
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}
