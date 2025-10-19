import { useState } from "react";

export default function AccessCodeModal({ siteName, onVerify, onCancel }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const isValid = await onVerify(code);
            if (!isValid) {
                setError("Code incorrect. Veuillez réessayer.");
                setCode("");
            }
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
            console.error("Erreur lors de la vérification du code:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="modal show d-block"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="accessCodeModalLabel"
                aria-modal="true"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="accessCodeModalLabel">
                                <i className="bi bi-lock-fill me-2"></i>
                                Site protégé
                            </h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <p className="mb-3">
                                    Le site <strong>{siteName}</strong> est protégé par un code secret.
                                    Veuillez entrer le code pour y accéder.
                                </p>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="accessCode" className="form-label">
                                        Code secret
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="accessCode"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Entrez le code"
                                        required
                                        autoFocus
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onCancel}
                                    disabled={loading}
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Vérification...
                                        </>
                                    ) : (
                                        "Valider"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
        </>
    );
}
