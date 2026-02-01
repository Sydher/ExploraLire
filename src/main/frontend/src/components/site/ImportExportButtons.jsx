import { useState, useRef } from "react";
import { importSite, importSiteFromZip } from "../../services/siteService";
import ImportResultModal from "./ImportResultModal";

export default function ImportExportButtons({ onImportSuccess }) {
    const [loading, setLoading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            let result;

            if (file.name.endsWith(".zip")) {
                result = await importSiteFromZip(file);
            } else {
                const content = await readFileContent(file);
                const importData = JSON.parse(content);
                result = await importSite(importData);
            }

            setImportResult(result);

            if (result.success && onImportSuccess) {
                onImportSuccess();
            }
        } catch (err) {
            console.error("Erreur lors de l'import:", err);
            setImportResult({
                success: false,
                errors: [
                    {
                        field: "fichier",
                        message:
                            err instanceof SyntaxError
                                ? "Le fichier n'est pas un JSON valide."
                                : err.message || "Erreur lors de la lecture du fichier.",
                    },
                ],
            });
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
            reader.readAsText(file);
        });
    };

    const handleCloseModal = () => {
        setImportResult(null);
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,.zip"
                style={{ display: "none" }}
                aria-hidden="true"
            />
            <button
                onClick={handleFileSelect}
                className="btn btn-outline-primary me-2"
                disabled={loading}
                aria-label="Importer un site depuis un fichier"
            >
                {loading ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        ></span>
                        Import en cours...
                    </>
                ) : (
                    <>
                        <i className="bi bi-upload me-2"></i>
                        Importer un site
                    </>
                )}
            </button>

            {importResult && <ImportResultModal result={importResult} onClose={handleCloseModal} />}
        </>
    );
}
