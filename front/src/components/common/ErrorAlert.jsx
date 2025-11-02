export default function ErrorAlert({ error, onClose }) {
    if (!error) return null;

    return (
        <div className="row mb-3">
            <div className="col">
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Erreur :</strong> {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Fermer l'alerte"
                    ></button>
                </div>
            </div>
        </div>
    );
}
