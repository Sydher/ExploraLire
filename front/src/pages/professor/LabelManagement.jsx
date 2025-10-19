import * as labelService from "../../services/labelService";
import useEntityManager from "../../hooks/useEntityManager";
import ErrorAlert from "../../components/common/ErrorAlert";
import EntityList from "../../components/common/EntityList";
import EntityFormCard from "../../components/common/EntityFormCard";
import { createLabelServiceAdapter } from "../../utils/serviceAdapter";

export default function LabelManagement() {
    const service = createLabelServiceAdapter(labelService);
    const {
        items: labels,
        editingItem: editingLabel,
        formData,
        setFormData,
        isCreating,
        error,
        setError,
        handleCreate,
        handleUpdate,
        handleDelete,
        startEdit,
        cancelEdit,
        startCreate,
    } = useEntityManager(service, "labels", { name: "" });

    const columns = [{ key: "name", header: "Nom" }];

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="display-5">Gestion des Labels</h1>
                </div>
            </div>

            <ErrorAlert error={error} onClose={() => setError(null)} />

            <div className="row mb-3">
                <div className="col">
                    {!isCreating && !editingLabel && (
                        <button onClick={startCreate} className="btn btn-success">
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouveau Label
                        </button>
                    )}

                    {(isCreating || editingLabel) && (
                        <EntityFormCard
                            isCreating={isCreating}
                            editingItem={editingLabel}
                            onSubmit={isCreating ? handleCreate : handleUpdate}
                            onCancel={cancelEdit}
                            title={isCreating ? "Créer un label" : "Modifier le label"}
                        >
                            <div className="row g-3 align-items-end">
                                <div className="col-md-6">
                                    <label htmlFor="labelName" className="form-label">
                                        Nom du label
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="labelName"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        placeholder="Entrez le nom du label"
                                        required
                                    />
                                </div>
                            </div>
                        </EntityFormCard>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <EntityList
                        items={labels}
                        columns={columns}
                        onEdit={startEdit}
                        onDelete={(id) => handleDelete(id, "Êtes-vous sûr de vouloir supprimer ce label ?")}
                        emptyMessage="Aucun label pour le moment"
                    />
                </div>
            </div>
        </div>
    );
}
