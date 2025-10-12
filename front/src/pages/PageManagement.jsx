import { useState, useEffect } from 'react';
import * as pageService from '../services/pageService';
import * as siteService from '../services/siteService';
import BlockEditor from '../components/BlockEditor';

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;

export default function PageManagement() {
  const [pages, setPages] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({ name: '', content: [], site: null });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
    fetchSites();
  }, []);

  const fetchPages = async () => {
    try {
      setError(null);
      const data = await pageService.getAllPages();
      setPages(data);
    } catch (error) {
      setError(ERR_LOAD);
      console.error('Erreur lors du chargement des pages :', error);
    }
  };

  const fetchSites = async () => {
    try {
      const data = await siteService.getAllSites();
      setAllSites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sites :', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const dataToSave = {
        ...formData,
        content: JSON.stringify(formData.content),
      };
      await pageService.createPage(dataToSave);
      setFormData({ name: '', content: [], site: null });
      setIsCreating(false);
      fetchPages();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la création :', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const dataToSave = {
        ...formData,
        content: JSON.stringify(formData.content),
      };
      await pageService.updatePage(editingPage.id, dataToSave);
      setFormData({ name: '', content: [], site: null });
      setEditingPage(null);
      fetchPages();
    } catch (error) {
      setError(ERR_SAVE);
      console.error('Erreur lors de la modification :', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      try {
        setError(null);
        await pageService.deletePage(id);
        fetchPages();
      } catch (error) {
        setError(ERR_DELETE);
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };

  const startEdit = (page) => {
    setEditingPage(page);
    let parsedContent = [];
    try {
      parsedContent = page.content ? JSON.parse(page.content) : [];
    } catch (error) {
      console.error('Erreur lors du parsing du contenu:', error);
      parsedContent = [];
    }
    setFormData({
      name: page.name,
      content: parsedContent,
      site: page.site,
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setFormData({ name: '', content: [], site: null });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingPage(null);
    setFormData({ name: '', content: [], site: null });
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5">Gestion des Pages</h1>
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
          {!isCreating && !editingPage && (
            <button onClick={startCreate} className="btn btn-success">
              Nouvelle Page
            </button>
          )}

          {(isCreating || editingPage) && (
            <div className="card">
              <div className="card-body">
                <h2 className="card-title h5">
                  {isCreating ? 'Créer une page' : 'Modifier la page'}
                </h2>
                <form onSubmit={isCreating ? handleCreate : handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="pageName" className="form-label">
                      Nom de la page
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pageName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Entrez le nom de la page"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Contenu de la page
                    </label>
                    <BlockEditor
                      blocks={formData.content}
                      onChange={(blocks) => setFormData({ ...formData, content: blocks })}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pageSite" className="form-label">
                      Site associé
                    </label>
                    <select
                      className="form-select"
                      id="pageSite"
                      value={formData.site?.id || ''}
                      onChange={(e) => {
                        const siteId = e.target.value ? parseInt(e.target.value) : null;
                        setFormData({
                          ...formData,
                          site: siteId ? { id: siteId } : null,
                        });
                      }}
                      required
                      aria-required="true"
                    >
                      <option value="">Sélectionnez un site</option>
                      {allSites.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
          {pages.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Aucune page pour le moment
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Site</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td>{page.id}</td>
                      <td>{page.name}</td>
                      <td>{page.site?.name || '-'}</td>
                      <td className="text-end">
                        <button
                          onClick={() => startEdit(page)}
                          className="btn btn-sm btn-warning me-2"
                          aria-label={`Modifier la page ${page.name}`}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="btn btn-sm btn-danger"
                          aria-label={`Supprimer la page ${page.name}`}
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
