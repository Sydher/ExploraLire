import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useError } from "../../context/ErrorContext";
import { createPage, deletePage, getPage, updatePage } from "../../services/PagesApiService";
import { attachPage, getSite } from "../../services/SitesApiService";
import Loader from "../../components/Loader";
import { Editor } from "../../components/Editor";
import { Render } from "@measured/puck";
import { EditorConfig } from "../../components/EditorConfig";

const ERR_LOAD = import.meta.env.VITE_ERR_LOAD;
const ERR_SAVE = import.meta.env.VITE_ERR_SAVE;
const ERR_DELETE = import.meta.env.VITE_ERR_DELETE;
const CONFIM_DELETE = import.meta.env.VITE_PAGES_CONFIM_DELETE;
const OK_SAVE = import.meta.env.VITE_INFO_SAVE;
const OK_DELETE = import.meta.env.VITE_INFO_DELETE;

function Exemple({ siteId }) {
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
        getPage(1)
            .then((page) => {
                const parsedContent = JSON.parse(page.content);
                setEditorData(parsedContent);
            })
            .catch((err) => {
                showError(err.message);
                toast.error(ERR_LOAD);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // View
    return (
        <>
            <Loader loading={loading} />
            <Render config={EditorConfig} data={editorData} />
        </>
    );
}

export default Exemple;
