import { useState, useEffect } from 'react';
import * as siteService from '../../services/siteService';
import * as pageService from '../../services/pageService';

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;

export default function StudentView() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      fetchPages();
    }
  }, [selectedSite]);

  const fetchSites = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await siteService.getAllSites();
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0]);
      }
    } catch (error) {
      setError(ERR_LOAD);
      console.error('Erreur lors du chargement des sites :', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      setError(null);
      const allPages = await pageService.getAllPages();
      const filteredPages = allPages.filter((page) => page.site?.id === selectedSite.id);
      setPages(filteredPages);
      if (filteredPages.length > 0) {
        setSelectedPage(filteredPages[0]);
      } else {
        setSelectedPage(null);
      }
    } catch (error) {
      setError(ERR_LOAD);
      console.error('Erreur lors du chargement des pages :', error);
    }
  };

  const renderContent = (content) => {
    try {
      const layout = JSON.parse(content);
      if (!Array.isArray(layout)) return null;

      return layout.map((row, rowIndex) => (
        <div key={row.id || rowIndex} className="row mb-4">
          {row.columns?.map((column, colIndex) => {
            const colClass =
              row.columns.length === 1 ? 'col-12' : row.columns.length === 2 ? 'col-md-6' : 'col-md-4';
            return (
              <div key={column.id || colIndex} className={colClass}>
                {column.blocks?.map((block, blockIndex) => (
                  <div key={block.id || blockIndex} className="mb-3">
                    {renderBlock(block)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ));
    } catch (error) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case 'title':
        const TitleTag = block.level || 'h2';
        return <TitleTag>{block.text}</TitleTag>;
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: block.text }} />;
      case 'image':
        return (
          <img src={block.url} alt={block.alt} className="img-fluid rounded" style={{ maxWidth: '100%' }} />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <strong>Erreur :</strong> {error}
        </div>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="alert">
          Aucun site disponible pour le moment.
        </div>
      </div>
    );
  }

  return (
    <div className="student-view">
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-globe me-2"></i>
            {selectedSite?.name || 'Sélectionnez un site'}
          </span>
          <div className="navbar-nav ms-auto">
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="siteDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Changer de site
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="siteDropdown">
                {sites.map((site) => (
                  <li key={site.id}>
                    <button
                      className={`dropdown-item ${selectedSite?.id === site.id ? 'active' : ''}`}
                      onClick={() => setSelectedSite(site)}
                    >
                      {site.name}
                      {site.labels && site.labels.length > 0 && (
                        <div className="d-flex gap-1 mt-1">
                          {site.labels.map((label) => (
                            <span key={label.id} className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 border-end">
            <div className="list-group">
              {pages.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  Aucune page disponible pour ce site.
                </div>
              ) : (
                pages.map((page) => (
                  <button
                    key={page.id}
                    className={`list-group-item list-group-item-action ${
                      selectedPage?.id === page.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    {page.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="col-md-9 col-lg-10">
            {selectedPage ? (
              <div className="page-content">
                <h1 className="mb-4">{selectedPage.name}</h1>
                {selectedPage.content ? (
                  renderContent(selectedPage.content)
                ) : (
                  <div className="alert alert-info" role="alert">
                    Cette page est vide.
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                Sélectionnez une page dans le menu de gauche.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
