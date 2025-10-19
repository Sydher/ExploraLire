export default function Navbar({ mode, currentPage, onModeChange, onPageChange, onHomeClick }) {
    const getModeName = () => {
        if (!mode) return "Accueil";
        if (mode === "teacher") return "Mode Professeur";
        if (mode === "student") return "Mode Élève";
        return "";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <span className="navbar-brand mb-0 h1 me-3">ExploraLire</span>
                    <span className="text-white fs-5">
                        {mode === "teacher" && <i className="bi bi-person-gear me-2"></i>}
                        {mode === "student" && <i className="bi bi-person me-2"></i>}
                        {!mode && <i className="bi bi-house-door me-2"></i>}
                        {getModeName()}
                    </span>
                </div>

                <div className="d-flex gap-3 align-items-center">
                    {mode === "teacher" && (
                        <>
                            <div className="navbar-nav flex-row gap-2">
                                <button
                                    className={`nav-link btn btn-link text-white ${
                                        currentPage === "labels" ? "active" : ""
                                    }`}
                                    onClick={() => onPageChange("labels")}
                                    aria-current={currentPage === "labels" ? "page" : undefined}
                                >
                                    Labels
                                </button>
                                <button
                                    className={`nav-link btn btn-link text-white ${
                                        currentPage === "sites" ? "active" : ""
                                    }`}
                                    onClick={() => onPageChange("sites")}
                                    aria-current={currentPage === "sites" ? "page" : undefined}
                                >
                                    Sites
                                </button>
                                <button
                                    className={`nav-link btn btn-link text-white ${
                                        currentPage === "pages" ? "active" : ""
                                    }`}
                                    onClick={() => onPageChange("pages")}
                                    aria-current={currentPage === "pages" ? "page" : undefined}
                                >
                                    Pages
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        className="btn btn-outline-light"
                        onClick={onHomeClick}
                        title="Sélection du mode"
                        aria-label="Sélection du mode"
                    >
                        <i className="bi bi-house-door me-2"></i>
                        Sélection du mode
                    </button>
                </div>
            </div>
        </nav>
    );
}
