import { useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { getSites, deleteSite, createSite, updateSite } from "../../services/SitesApiService";
import { toast } from "react-toastify";
import Select from "react-select";
import { useError } from "../../context/ErrorContext";

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;
const CONFIM_DELETE = import.meta.env.VITE_SITES_CONFIM_DELETE;
const OK_SAVE = import.meta.env.VITE_INFO_SAVE;
const OK_DELETE = import.meta.env.VITE_INFO_DELETE;

function Sites({ labels }) {
    // States
    const [loading, setLoading] = useState(false);
    const [sites, setSites] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [labelsOptions, setLabelsOptions] = useState([]);
    const [siteName, setSiteName] = useState("");
    const [labelsId, setLabelsId] = useState([]);
    const [editingSiteId, setEditingSiteId] = useState(null);
    const [editingSiteLabelsId, setEditingSiteLabelsId] = useState(null);

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
        formatLabels();
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
                setSites(sites.map((s) => (s.id === editingSiteId ? updated : s)));
            }
            // Create
            else {
                const newSite = await createSite(body);
                setSites([...sites, newSite]);
            }

            showError(null);
            toast.success(OK_SAVE);
            handleCloseModal();
        } catch (err) {
            showError(err.message);
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

        formatLabels();
        const defaultLabels = siteToEdit.labels
            .map((label) => labelsOptions.find((l) => l.value === label.id))
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
            showError(err.message);
            toast.error(ERR_DELETE);
        }
    };

    const handleOpenModal = () => {
        formatLabels();
        setShowModal(true);
    };

    const formatLabels = () => {
        setLabelsOptions(labels.map(({ id, name }) => ({ value: id, label: name })));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSiteName("");
        setEditingSiteId(null);
    };

    // View
    return (
        <>
            <h2>Liste de mes sites</h2>

            {loading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            )}

            {!sites.length ? (
                <p>Aucun site trouvé.</p>
            ) : (
                <SitesTable sites={sites} handleUpdate={handleUpdate} handleDelete={handleDelete} />
            )}

            <Button variant="success" onClick={handleOpenModal}>
                <i className="bi bi-plus-circle me-1"></i>
                Créer
            </Button>

            <SitesModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleSubmit={handleSubmit}
                siteName={siteName}
                setSiteName={setSiteName}
                labels={labels}
                labelsOptions={labelsOptions}
                editingSiteId={editingSiteId}
                selectedLabels={editingSiteLabelsId}
                setSelectedLabels={(newValue) =>
                    setLabelsId(newValue ? newValue.map((opt) => opt.value) : [])
                }
            />
        </>
    );
}

function SitesTable({ sites, handleUpdate, handleDelete }) {
    // View
    return (
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
                                        <Badge bg="secondary me-1" key={label.id}>
                                            {label.name}
                                        </Badge>
                                    ))}
                                </>
                            )}
                        </td>
                        <td>
                            <Button variant="primary" onClick={() => handleUpdate(site.id)} className="me-2">
                                <i className="bi bi-pencil-square me-1"></i>
                                Modifier
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(site.id)}>
                                <i className="bi bi-trash me-1"></i>
                                Supprimer
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function SitesModal({
    showModal,
    handleCloseModal,
    handleSubmit,
    siteName,
    setSiteName,
    labels,
    labelsOptions,
    editingSiteId,
    selectedLabels,
    setSelectedLabels,
}) {
    // View
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{editingSiteId ? "Modifier le site" : "Créer un nouveau site"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nom</Form.Label>
                        {/* TODO rendre nom obligatoire */}
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
                                defaultValue={selectedLabels}
                                isMulti
                                name="colors"
                                options={labelsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(newValue) => {
                                    setSelectedLabels(newValue ? newValue : []);
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
                <Button variant={editingSiteId ? "primary" : "success"} onClick={handleSubmit}>
                    <i className={`bi ${editingSiteId ? "bi-floppy" : "bi-plus-circle"} me-1`}></i>
                    {editingSiteId ? "Sauvegarder" : "Créer"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Sites;
