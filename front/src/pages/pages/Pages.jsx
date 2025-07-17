import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useError } from "../../context/ErrorContext";
import { createPage, deletePage, updatePage } from "../../services/PagesApiService";
import { attachPage, getSite } from "../../services/SitesApiService";
import Loader from "../../components/Loader";
import { Editor } from "../../components/Editor";

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;
const CONFIM_DELETE = import.meta.env.VITE_PAGES_CONFIM_DELETE;
const OK_SAVE = import.meta.env.VITE_INFO_SAVE;
const OK_DELETE = import.meta.env.VITE_INFO_DELETE;

function Pages({ siteId }) {
    // States
    const [loading, setLoading] = useState(false);
    const [site, setSite] = useState(null);
    const [pages, setPages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pageName, setPageName] = useState("");
    const [pageContent, setPageContent] = useState(null);
    const [editingPageId, setEditingPageId] = useState(null);
    const [editorData, setEditorData] = useState({});

    // Contexts
    const { showError } = useError();

    // Init
    useEffect(() => {
        setLoading(true);
        getSite(siteId)
            .then((site) => {
                setSite(site);
                setPages(site.pages);
            })
            .catch((err) => {
                showError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Update
            if (editingPageId) {
                const updated = await updatePage(editingPageId, {
                    name: pageName,
                    content: pageContent,
                });
                setPages(pages.map((s) => (s.id === editingPageId ? updated : s)));
            }
            // Create
            else {
                const newPage = await createPage({ name: pageName, content: pageContent });
                setPages([...pages, newPage]);
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
        try {
            const parsedContent = JSON.parse(pages.find((p) => p.id === id).content);
            setEditorData(parsedContent);
            setEditingPageId(id);
            setShowModal(true);
        } catch (error) {
            showError(err.message);
            toast.error(ERR_SAVE);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(CONFIM_DELETE)) return;

        try {
            deletePage(id);
            setPages(pages.filter((s) => s.id !== id));
            toast.info(OK_DELETE);
        } catch (err) {
            showError(err.message);
            toast.error(ERR_DELETE);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPageName("");
        setPageContent(null);
        setEditingPageId(null);
    };

    const handleSaveEditor = async (dataToSave) => {
        console.debug(JSON.stringify(dataToSave));
        console.debug(dataToSave);

        setLoading(true);

        try {
            const pageTitle = dataToSave.root.props.title; // TODO gérer si nom de page pas saisie !
            const pageCont = JSON.stringify(dataToSave);

            // Update
            if (editingPageId) {
                const updated = await updatePage(editingPageId, {
                    name: pageTitle,
                    content: pageCont,
                });
                setPages(pages.map((s) => (s.id === editingPageId ? updated : s)));
            }
            // Create
            else {
                const newPage = await createPage({ name: pageTitle, content: pageCont });
                const siteUpdated = await attachPage(siteId, { pagesId: [newPage.id] });
                setPages([...pages, newPage]);
                setSite(siteUpdated);
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

    // View
    return (
        <>
            {site && (
                <>
                    <h2>{site.name} - Liste des pages</h2>

                    <Loader loading={loading} />

                    {!pages.length ? (
                        <p>Aucune page trouvée.</p>
                    ) : (
                        <PagesTable pages={pages} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                    )}

                    <Button variant="success" onClick={() => setShowModal(true)}>
                        <i className="bi bi-plus-circle me-1"></i>
                        Créer
                    </Button>

                    <PagesModal
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        handleSubmit={handleSubmit}
                        editingPageId={editingPageId}
                        editorData={editorData}
                        handleSaveEditor={handleSaveEditor}
                    />
                </>
            )}
        </>
    );
}

function PagesTable({ pages, handleUpdate, handleDelete }) {
    // View
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {pages.map((page) => (
                    <tr key={page.id}>
                        <td>{page.name}</td>
                        <td>
                            <Button variant="primary" onClick={() => handleUpdate(page.id)} className="me-2">
                                <i className="bi bi-pencil-square me-1"></i>
                                Modifier
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(page.id)}>
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

function PagesModal({
    showModal,
    handleCloseModal,
    handleSubmit,
    editingPageId,
    editorData,
    handleSaveEditor,
}) {
    // View
    return (
        <Modal show={showModal} fullscreen={true} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{editingPageId ? "Modifier la page" : "Créer une nouvelle page"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Editor initialData={editorData} onSave={handleSaveEditor} isEditing={editingPageId} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Annuler
                </Button>
                {/* TODO coder le bouton d'en bas ? */}
                <Button variant={editingPageId ? "primary" : "success"} onClick={handleSubmit} disabled>
                    <i className={`bi ${editingPageId ? "bi-floppy" : "bi-plus-circle"} me-1`}></i>
                    {editingPageId ? "Sauvegarder" : "Créer"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Pages;
