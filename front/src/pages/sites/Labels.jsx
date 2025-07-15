import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import {
    getLabels,
    deleteLabel,
    createLabel,
    updateLabel,
} from "../../services/LabelsApiService";
import { toast } from "react-toastify";

const ERR_LOAD = "Erreur lors de la récupération des étiquettes.";
const ERR_SAVE = "Erreur lors de la sauvegarde.";
const ERR_DELETE = "Erreur lors de la suppression.";
const CONFIM_DELETE = "Voulez-vous vraiment supprimer cette étiquette ?";
const OK_SAVE = "Etiquette enregistrée !";
const OK_DELETE = "Etiquette supprimée !";

function Labels() {
    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [labels, setLabels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [labelName, setLabelName] = useState("");
    const [editingLabelId, setEditingLabelId] = useState(null);

    // Init
    useEffect(() => {
        setLoading(true);
        getLabels()
            .then(setLabels)
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
            // Update
            if (editingLabelId) {
                const updated = await updateLabel(editingLabelId, {
                    name: labelName,
                });
                setLabels(
                    labels.map((s) => (s.id === editingLabelId ? updated : s))
                );
            }
            // Create
            else {
                const newLabel = await createLabel({ name: labelName });
                setLabels([...labels, newLabel]);
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
        const labelToEdit = labels.find((s) => s.id === id);
        if (!labelToEdit) return;
        setLabelName(labelToEdit.name);
        setEditingLabelId(id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(CONFIM_DELETE)) return;

        try {
            deleteLabel(id);
            setLabels(labels.filter((s) => s.id !== id));
            toast.info(OK_DELETE);
        } catch (err) {
            setError(err.message);
            toast.error(ERR_DELETE);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLabelName("");
        setEditingLabelId(null);
    };

    return (
        <>
            <h2>Liste de mes étiquettes</h2>

            {loading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {!labels.length ? (
                <p>Aucune étiquette trouvée.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labels.map((label) => (
                            <tr key={label.id}>
                                <td>{label.name}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpdate(label.id)}
                                        className="me-2"
                                    >
                                        <i className="bi bi-pencil-square me-1"></i>
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(label.id)}
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

            <Button variant="success" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-1"></i>
                Créer
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingLabelId
                            ? "Modifier l'étiquette"
                            : "Créer une nouvelle étiquette"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nom de l'étiquette"
                                value={labelName}
                                onChange={(e) => setLabelName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button
                        variant={editingLabelId ? "primary" : "success"}
                        onClick={handleSubmit}
                    >
                        <i
                            className={`bi ${
                                editingLabelId ? "bi-floppy" : "bi-plus-circle"
                            } me-1`}
                        ></i>
                        {editingLabelId ? "Sauvegarder" : "Créer"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Labels;
