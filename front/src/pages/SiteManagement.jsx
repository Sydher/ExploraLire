import { useState, useEffect } from 'react';
import * as siteService from '../services/siteService';
import * as labelService from '../services/labelService';

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;

export default function SiteManagement() {
  const [sites, setSites] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({ name: '', labels: [] });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSites();
    fetchLabels();
  }, []);

  const fetchSites = async () => {
    try {
      setError(null);
      const data = await siteService.getAllSites();
      setSites(data);
    } catch (error) {
      setError(ERR_LOAD);
      console.error('Erreur lors du chargement des sites :', error);
    }
  };

  const fetchLabels = async () => {
    try {
      const data = await labelService.getAllLabels();
      setAllLabels(data);
    } catch (error) {
      console.error('Erreur lors du chargement des labels :', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await siteService.createSite(formData);
      setFormData({ name: '', labels: [] });
      setIsCreating(false);
      fetchSites();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la création :', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await siteService.updateSite(editingSite.id, formData);
      setFormData({ name: '', labels: [] });
      setEditingSite(null);
      fetchSites();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la modification :', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      try {
        setError(null);
        await siteService.deleteSite(id);
        fetchSites();
      } catch (error) {
        setError(ERR_DELETE);
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };

  const startEdit = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      labels: site.labels || [],
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingSite(null);
    setFormData({ name: '', labels: [] });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingSite(null);
    setFormData({ name: '', labels: [] });
  };

  const handleLabelToggle = (label) => {
    const isSelected = formData.labels.some((l) => l.id === label.id);
    if (isSelected) {
      setFormData({
        ...formData,
        labels: formData.labels.filter((l) => l.id !== label.id),
      });
    } else {
      setFormData({
        ...formData,
        labels: [...formData.labels, { id: label.id }],
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5">Gestion des Sites</h1>
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
          {!isCreating && !editingSite && (
            <button onClick={startCreate} className="btn btn-success">
              Nouveau Site
            </button>
          )}

          {(isCreating || editingSite) && (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title h5">
                  {isCreating ? 'Créer un site' : 'Modifier le site'}
                </h2>
                <form onSubmit={isCreating ? handleCreate : handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="siteName" className="form-label">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="siteName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Entrez le nom du site"
                      required
                      aria-required="true"
                    />
                  </div>

                  <fieldset className="mb-3">
                    <legend className="form-label">Labels associés</legend>
                    {allLabels.length === 0 ? (
                      <p className="text-muted">Aucun label disponible</p>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {allLabels.map((label) => (
                          <div key={label.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`label-${label.id}`}
                              checked={formData.labels.some((l) => l.id === label.id)}
                              onChange={() => handleLabelToggle(label)}
                            />
                            <label className="form-check-label" htmlFor={`label-${label.id}`}>
                              {label.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </fieldset>

                  <div className="d-flex gap-2">
                    <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isCreating ? 'Créer' : 'Modifier'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          {sites.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Aucun site pour le moment
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Labels</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr key={site.id}>
                      <td>{site.id}</td>
                      <td>{site.name}</td>
                      <td>
                        {site.labels && site.labels.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {site.labels.map((label) => (
                              <span key={label.id} className="badge bg-secondary">
                                {label.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">Aucun label</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => startEdit(site)}
                          className="btn btn-sm btn-warning me-2"
                          aria-label={`Modifier le site ${site.name}`}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(site.id)}
                          className="btn btn-sm btn-danger"
                          aria-label={`Supprimer le site ${site.name}`}
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
