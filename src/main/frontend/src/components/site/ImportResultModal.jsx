export default function ImportResultModal({ result, onClose }) {
    if (!result) return null;

    const { success, siteName, pagesImported, labelsCreated, errors } = result;

    return (
        <>
            <div
                className="modal show d-block"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="importResultModalLabel"
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="importResultModalLabel">
                                {success ? (
                                    <>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Import réussi
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-x-circle-fill text-danger me-2"></i>
                                        Erreur d'import
                                    </>
                                )}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Fermer"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {success ? (
                                <>
                                    <p>
                                        Le site <strong>{siteName}</strong> a été importé avec succès.
                                    </p>
                                    <ul className="list-unstyled mb-0">
                                        <li>
                                            <i className="bi bi-file-earmark me-2"></i>
                                            {pagesImported} page{pagesImported > 1 ? "s" : ""} importée
                                            {pagesImported > 1 ? "s" : ""}
                                        </li>
                                        {labelsCreated && labelsCreated.length > 0 && (
                                            <li>
                                                <i className="bi bi-tag me-2"></i>
                                                {labelsCreated.length} label
                                                {labelsCreated.length > 1 ? "s" : ""} créé
                                                {labelsCreated.length > 1 ? "s" : ""} :{" "}
                                                {labelsCreated.join(", ")}
                                            </li>
                                        )}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <p>L'import a échoué pour les raisons suivantes :</p>
                                    <ul className="text-danger mb-0">
                                        {errors &&
                                            errors.map((error, index) => (
                                                <li key={index}>
                                                    <strong>{error.field}</strong> : {error.message}
                                                </li>
                                            ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={onClose}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
        </>
    );
}
