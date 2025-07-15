import { useEffect, useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import Labels from "./Labels";
import Sites from "./Sites";
import { Alert, Spinner } from "react-bootstrap";
import { getLabels } from "../../services/LabelsApiService";
import { toast } from "react-toastify";

const ERR_LOAD = "Erreur lors de la récupération des étiquettes.";

function MainSites() {
    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [labels, setLabels] = useState([]);

    // Init
    useEffect(() => {
        setLoading(true);
        getLabels()
            .then(setLabels)
            .catch((err) => {
                if (err.message === "Failed to fetch") { // TODO gestionnaire d'erreur (voir todo)
                    setError(
                        "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard."
                    );
                } else {
                    setError(err.message);
                }
                toast.error(ERR_LOAD);
            })
            .finally(() => setLoading(false));
    }, []);

    // View
    return (
        <>
            <TeacherLayout>
                <h1>Gestion des sites</h1>

                {loading && (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </Spinner>
                )}
                {error && <Alert variant="danger">{error}</Alert>}

                {(!error && !loading) && (
                    <>
                        <Sites labels={labels}></Sites>
                        <hr></hr>
                        <Labels labels={labels} setLabels={setLabels}></Labels>
                    </>
                )}
            </TeacherLayout>
        </>
    );
}

export default MainSites;
