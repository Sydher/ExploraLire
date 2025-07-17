import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useError } from "../../context/ErrorContext";
import Loader from "../../components/Loader";
import { getSites } from "../../services/SitesApiService";
import { Form } from "react-bootstrap";
import Pages from "./Pages";

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;

function MainPages() {
    // States
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(0);

    // Contexts
    const { showError } = useError();

    // Init
    useEffect(() => {
        setLoading(true);
        getSites()
            .then(setSites)
            .catch((err) => {
                showError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => setLoading(false));
    }, []);

    // View
    return (
        <>
            <h1>Gestion des pages</h1>

            <Loader loading={loading} />

            {!sites.length ? (
                <p>Aucun site trouvé.</p>
            ) : (
                <>
                    <Form.Group controlId="formBasicSelect">
                        <Form.Label>Choisir un site</Form.Label>
                        {/* TODO ! Attention marche po ! */}
                        <Form.Select
                            aria-label="Choisir un site"
                            value={selectedSite}
                            onChange={(e) => setSelectedSite(Number(e.currentTarget.value))}
                        >
                            <option value="0">-- Choisir un site --</option>
                            {sites.map((site) => (
                                <option value={site.id} key={site.id}>
                                    {site.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {selectedSite !== 0 && <div className="mt-4"><Pages siteId={selectedSite} /></div>}
                </>
            )}

            {/* quand site sélectionné :<br />
            <ul>
                <li>liste des pages paginées avec actions</li>
                <li>bouton ajout page</li>
            </ul>
            pas de système de modal, mais une page complète pour la création ? comment on fait un retour
            arrière ? */}
            {/* {!loading && (
                <>
                    <Sites labels={labels}></Sites>
                    <hr></hr>
                    <Labels labels={labels} setLabels={setLabels}></Labels>
                </>
            )} */}
        </>
    );
}

export default MainPages;
