import { useEffect, useState } from "react";
import Labels from "./Labels";
import Sites from "./Sites";
import { Spinner } from "react-bootstrap";
import { getLabels } from "../../services/LabelsApiService";
import { toast } from "react-toastify";
import { useError } from "../../context/ErrorContext";

const ERR_LOAD = "Erreur lors de la récupération des étiquettes.";

function MainSites() {
    // States
    const [loading, setLoading] = useState(false);
    const [labels, setLabels] = useState([]);

    // Contexts
    const { showError } = useError();

    // Init
    useEffect(() => {
        setLoading(true);
        getLabels()
            .then(setLabels)
            .catch((err) => {
                showError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => setLoading(false));
    }, []);

    // View
    return (
        <>
            <h1>Gestion des sites</h1>

            {loading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            )}

            {!loading && (
                <>
                    <Sites labels={labels}></Sites>
                    <hr></hr>
                    <Labels labels={labels} setLabels={setLabels}></Labels>
                </>
            )}
        </>
    );
}

export default MainSites;
