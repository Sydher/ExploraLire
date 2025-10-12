import { useState, useEffect } from 'react';
import * as labelService from '../services/labelService';

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;

export default function LabelManagement() {
  const [labels, setLabels] = useState([]);
  const [editingLabel, setEditingLabel] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setError(null);
      const data = await labelService.getAllLabels();
      setLabels(data);
    } catch (error) {
      setError(ERR_LOAD);
      console.error('Erreur lors du chargement des labels :', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await labelService.createLabel(formData);
      setFormData({ name: '' });
      setIsCreating(false);
      fetchLabels();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la création :', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await labelService.updateLabel(editingLabel.id, formData);
      setFormData({ name: '' });
      setEditingLabel(null);
      fetchLabels();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la modification :', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce label ?')) {
      try {
        setError(null);
        await labelService.deleteLabel(id);
        fetchLabels();
      } catch (error) {
        setError(ERR_DELETE);
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };

  const startEdit = (label) => {
    setEditingLabel(label);
    setFormData({ name: label.name });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingLabel(null);
    setFormData({ name: '' });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingLabel(null);
    setFormData({ name: '' });
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5">Gestion des Labels</h1>
        </div>
      </div>

      {error && (
        <div className="row mb-3">
          <div className="col">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Erreur :</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Fermer l'alerte"
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <div className="col">
          {!isCreating && !editingLabel && (
            <button onClick={startCreate} className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>
              Nouveau Label
            </button>
          )}

          {(isCreating || editingLabel) && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {isCreating ? 'Créer un label' : 'Modifier le label'}
                </h5>
                <form onSubmit={isCreating ? handleCreate : handleUpdate}>
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
                    <div className="col-md-6">
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn btn-secondary"
                        >
                          Annuler
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {isCreating ? 'Créer' : 'Modifier'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          {labels.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Aucun label pour le moment
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label) => (
                    <tr key={label.id}>
                      <td>{label.id}</td>
                      <td>{label.name}</td>
                      <td className="text-end">
                        <button
                          onClick={() => startEdit(label)}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(label.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
