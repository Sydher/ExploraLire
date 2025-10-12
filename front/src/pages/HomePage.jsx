export default function HomePage({ onSelectMode }) {
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-3 fw-bold text-primary mb-3">
              <i className="bi bi-book-half me-3"></i>
              ExploraLire
            </h1>
            <p className="lead text-muted">
              Plateforme d'apprentissage de la lecture de textes composites pour les élèves de CM1/CM2
            </p>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm hover-shadow" style={{ cursor: 'pointer' }} onClick={() => onSelectMode('teacher')}>
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-person-gear display-1 text-primary"></i>
                  </div>
                  <h2 className="card-title h3 mb-3">Mode Professeur</h2>
                  <p className="card-text text-muted">
                    Créez et gérez des sites web pédagogiques pour vos élèves. Organisez les contenus avec des pages, des images et des labels.
                  </p>
                  <button className="btn btn-primary btn-lg mt-3">
                    Accéder à la gestion
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm hover-shadow" style={{ cursor: 'pointer' }} onClick={() => onSelectMode('student')}>
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-person display-1 text-success"></i>
                  </div>
                  <h2 className="card-title h3 mb-3">Mode Élève</h2>
                  <p className="card-text text-muted">
                    Découvrez et explorez les sites créés par votre professeur. Naviguez entre les pages pour trouver des informations.
                  </p>
                  <button className="btn btn-success btn-lg mt-3">
                    Commencer l'exploration
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="card bg-light border-0">
              <div className="card-body p-4">
                <h3 className="h5 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Comment ça marche ?
                </h3>
                <div className="row text-start">
                  <div className="col-md-6 mb-3">
                    <h4 className="h6 text-primary">
                      <i className="bi bi-1-circle me-2"></i>
                      Pour les professeurs
                    </h4>
                    <p className="small text-muted mb-0">
                      Créez des sites thématiques avec plusieurs pages. Utilisez l'éditeur visuel pour composer vos contenus avec des titres, textes, images et mise en forme.
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h4 className="h6 text-success">
                      <i className="bi bi-2-circle me-2"></i>
                      Pour les élèves
                    </h4>
                    <p className="small text-muted mb-0">
                      Parcourez les différents sites et pages pour rechercher des informations. Apprenez à naviguer dans plusieurs sources documentaires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
