import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Form,
    Modal,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    getSites,
    deleteSite,
    createSite,
    updateSite,
} from "../../services/SitesApiService";
import { getLabels } from "../../services/LabelsApiService";
import { toast } from "react-toastify";
import Select from "react-select";

const ERR_LOAD = "Erreur lors de la récupération des sites.";
const ERR_SAVE = "Erreur lors de la sauvegarde.";
const ERR_DELETE = "Erreur lors de la suppression.";
const CONFIM_DELETE = "Voulez-vous vraiment supprimer ce site ?";
const OK_SAVE = "Site enregistré !";
const OK_DELETE = "Site supprimé !";

function Sites() {
    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sites, setSites] = useState([]);
    const [labels, setLabels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [siteName, setSiteName] = useState("");
    const [labelsId, setLabelsId] = useState([]);
    const [editingSiteId, setEditingSiteId] = useState(null);
    const [editingSiteLabelsId, setEditingSiteLabelsId] = useState(null);

    // Init
    useEffect(() => {
        setLoading(true);
        getSites()
            .then(setSites)
            .catch((err) => {
                setError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const body = {
                name: siteName,
                labelsId: labelsId,
            };

            // Update
            if (editingSiteId) {
                const updated = await updateSite(editingSiteId, body);
                setSites(
                    sites.map((s) => (s.id === editingSiteId ? updated : s))
                );
            }
            // Create
            else {
                const newSite = await createSite(body);
                setSites([...sites, newSite]);
            }

            setError(null);
            toast.success(OK_SAVE);
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            toast.error(ERR_SAVE);
            handleCloseModal();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        const siteToEdit = sites.find((s) => s.id === id);
        if (!siteToEdit) return;

        setSiteName(siteToEdit.name);
        setEditingSiteId(id);

        const defaultLabels = siteToEdit.labels
            .map((label) => labels.find((l) => l.value === label.id))
            .filter(Boolean); // Évite les `undefined` si un id n'est pas trouvé

        setEditingSiteLabelsId(defaultLabels);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(CONFIM_DELETE)) return;

        try {
            deleteSite(id);
            setSites(sites.filter((s) => s.id !== id));
            toast.info(OK_DELETE);
        } catch (err) {
            setError(err.message);
            toast.error(ERR_DELETE);
        }
    };

    const handleOpenModal = () => {
        getLabels() // TODO à rework pour éviter les appels multiples, système d'event entre Labels.jsx et Sites.jsx ?
            .then((data) => {
                setLabels(
                    data.map(({ id, name }) => ({ value: id, label: name }))
                );
                setShowModal(true);
            })
            .catch((err) => {
                setError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => setLoading(false));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSiteName("");
        setEditingSiteId(null);
    };

    return (
        <>
            <h2>Liste de mes sites</h2>

            {loading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {!sites.length ? (
                <p>Aucun site trouvé.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom du site</th>
                            <th>Nombre de pages</th>
                            <th>Etiquettes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sites.map((site) => (
                            <tr key={site.id}>
                                <td>{site.name}</td>
                                <td>{site.pages.length}</td>
                                <td>
                                    {!site.labels.length ? (
                                        <>N/A</>
                                    ) : (
                                        <>
                                            {site.labels.map((label) => (
                                                <Badge
                                                    bg="secondary me-1"
                                                    key={label.id}
                                                >
                                                    {label.name}
                                                </Badge>
                                            ))}
                                        </>
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpdate(site.id)}
                                        className="me-2"
                                    >
                                        <i className="bi bi-pencil-square me-1"></i>
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(site.id)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Button variant="success" onClick={handleOpenModal}>
                <i className="bi bi-plus-circle me-1"></i>
                Créer
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingSiteId
                            ? "Modifier le site"
                            : "Créer un nouveau site"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nom du site"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Etiquettes</Form.Label>
                            {!labels.length ? (
                                <Form.Control
                                    type="text"
                                    placeholder="Aucune étiquette disponible pour ajout."
                                    readOnly
                                />
                            ) : (
                                <Select
                                    defaultValue={editingSiteLabelsId}
                                    isMulti
                                    name="colors"
                                    options={labels}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(newValue) => {
                                        setLabelsId(
                                            newValue
                                                ? newValue.map(
                                                      (opt) => opt.value
                                                  )
                                                : []
                                        );
                                    }}
                                />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button
                        variant={editingSiteId ? "primary" : "success"}
                        onClick={handleSubmit}
                    >
                        <i
                            className={`bi ${
                                editingSiteId ? "bi-floppy" : "bi-plus-circle"
                            } me-1`}
                        ></i>
                        {editingSiteId ? "Sauvegarder" : "Créer"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Sites;
