export default function EntityFormCard({
    isCreating,
    editingItem,
    onSubmit,
    onCancel,
    title,
    children,
}) {
    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title h5">{title}</h2>
                <form onSubmit={onSubmit}>
                    {children}

                    <div className="d-flex gap-2">
                        <button type="button" onClick={onCancel} className="btn btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isCreating ? "Sauvegarder la nouvelle page" : "Sauvegarder les modifications"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
