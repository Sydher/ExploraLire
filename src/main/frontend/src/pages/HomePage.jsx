export default function HomePage({ onSelectMode }) {
    return (
        <div className="container">
            <div className="row justify-content-center mt-4">
                <div className="col-lg-8">
                    <div className="text-center mb-2">
                        <h1 className="display-3 fw-bold text-primary mb-3">
                            <img src="/ExploraLire Logo.png" alt="" width="235" height="149" className="me-3" />
                            ExploraLire
                        </h1>
                        <p className="lead text-muted">
                            Plateforme d'apprentissage de la lecture de textes composites pour les élèves de
                            CM1/CM2
                        </p>
                    </div>

                    <div className="row g-4 mt-2">
                        <div className="col-md-6">
                            <div
                                className="card h-100 shadow-sm hover-shadow"
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelectMode("teacher")}
                            >
                                <div className="card-body text-center p-5">
                                    <h2 className="card-title h3 mb-3">
                                        <i className="bi bi-person-gear me-2"></i>
                                        Mode Professeur
                                    </h2>
                                    <p className="card-text text-muted">
                                        Créez et gérez des sites web pédagogiques pour vos élèves. Organisez
                                        les contenus avec des pages, des images et des catégories.
                                    </p>
                                    <button className="btn btn-primary btn-lg mt-3">
                                        Accéder à la gestion
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div
                                className="card h-100 shadow-sm hover-shadow"
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelectMode("student")}
                            >
                                <div className="card-body text-center p-5">
                                    <h2 className="card-title h3 mb-3">
                                        <i className="bi bi-person me-2"></i>
                                        Mode Élève
                                    </h2>
                                    <p className="card-text text-muted">
                                        Découvrez et explorez les sites créés par votre professeur. Naviguez
                                        entre les pages pour trouver des informations.
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
                                            Créez des sites thématiques avec plusieurs pages. Utilisez
                                            l'éditeur visuel pour composer vos contenus avec des titres,
                                            textes, images et mise en forme.
                                        </p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h4 className="h6 text-success">
                                            <i className="bi bi-2-circle me-2"></i>
                                            Pour les élèves
                                        </h4>
                                        <p className="small text-muted mb-0">
                                            Parcourez les différents sites et pages pour rechercher des
                                            informations. Apprenez à naviguer dans plusieurs sources
                                            documentaires.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-5 mb-4 text-muted small">
                        <p className="mb-1">
                            Licence{" "}
                            <a
                                href="https://creativecommons.org/licenses/by-nc/4.0/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                CC BY-NC 4.0
                            </a>
                            &nbsp;&copy; 2025 - 2026 ExploraLire
                        </p>
                        <p className="mb-1">
                            Créé par{" "}
                            <a href="https://github.com/Sydher" target="_blank" rel="noopener noreferrer">
                                Sydher
                            </a>
                        </p>
                        <p className="mb-0">
                            <a href="#TODO_DONATION" target="_blank" rel="noopener noreferrer">
                                Soutenir le projet
                            </a>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
