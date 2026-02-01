import { useState } from "react";
import { downloadSiteAsZip } from "../../services/siteService";

export default function ExportButton({ siteId, siteName }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);

        try {
            await downloadSiteAsZip(siteId, siteName);
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
                className="btn btn-info"
                disabled={loading}
                aria-label={`Exporter le site ${siteName}`}
            >
                {loading ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                        ></span>
                        Export en cours...
                    </>
                ) : (
                    <>
                        <i className="bi bi-download me-1"></i>
                        Exporter
                    </>
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
