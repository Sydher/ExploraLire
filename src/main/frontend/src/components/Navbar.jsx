export default function Navbar({ mode, onHomeClick }) {
    const getModeName = () => {
        if (!mode) return "Accueil";
        if (mode === "teacher") return "Mode Professeur";
        if (mode === "student") return "Mode Élève";
        return "";
    };

    const getBgClass = () => {
        if (!mode) return "bg-warning";
        if (mode === "student") return "bg-success navbar-dark";
        return "bg-primary navbar-dark";
    };

    return (
        <nav className={`navbar navbar-expand-lg ${getBgClass()}`}>
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <span className={`navbar-brand mb-0 h1 me-3 ${!mode ? "text-dark" : ""}`}>ExploraLire</span>
                    <span className={`fs-5 ${!mode ? "text-dark" : "text-white"}`}>
                        {mode === "teacher" && <i className="bi bi-person-gear me-2"></i>}
                        {mode === "student" && <i className="bi bi-person me-2"></i>}
                        {!mode && <i className="bi bi-house-door me-2"></i>}
                        {getModeName()}
                    </span>
                </div>

                <div className="d-flex gap-3 align-items-center">
                    <button
                        className={`btn ${!mode ? "btn-outline-dark" : "btn-outline-light"}`}
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
