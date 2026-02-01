import { useState } from "react";
import { exportSite, downloadSiteAsFile } from "../../services/siteService";

export default function ExportButton({ siteId, siteName }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);

        try {
            const exportData = await exportSite(siteId);
            downloadSiteAsFile(exportData, siteName);
        } catch (err) {
            console.error("Erreur lors de l'export:", err);
            setError(import.meta.env.VITE_ERR_EXPORT || "Erreur lors de l'export du site.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleExport}
                className="btn btn-sm btn-outline-secondary me-2"
                disabled={loading}
                aria-label={`Exporter le site ${siteName}`}
                title="Exporter le site"
            >
                {loading ? (
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                ) : (
                    <i className="bi bi-download"></i>
                )}
            </button>
            {error && (
                <span className="text-danger small" role="alert">
                    {error}
                </span>
            )}
        </>
    );
}
