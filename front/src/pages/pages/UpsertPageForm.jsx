import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Editor } from "../../components/Editor";

function UpsertPageForm({ type, onPageAdded }) {
    // Form States
    const [pageName, setPageName] = useState("");
    const [pageContent, setPageContent] = useState("");

    // Editor States
    const [config, setConfig] = useState({});
    const [data, setData] = useState({});

    // Form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/pages", {
                method: type, // POST = create | PUT = update
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: pageName, content: pageContent }),
            });

            if (!response.ok) {
                console.error(response);
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.debug(data);
            onPageAdded(data); // Appeler la fonction de rappel pour mettre à jour la liste des pages
            setPageName(""); // Réinitialiser le champ du formulaire
            setPageContent(""); // Réinitialiser le champ du formulaire
        } catch (err) {
            console.error(err.message);
        }
    };

    // Save
    const handleSave = (dataToSave) => {
        console.warn("COUCOU");
        console.log(dataToSave);
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nom de la page"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContent">
                    <Form.Label>Contenu</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Contenu de la page"
                        value={pageContent}
                        onChange={(e) => setPageContent(e.target.value)}
                    />
                </Form.Group>

                <Button variant="secondary" type="button">
                    Annuler
                </Button>
                <Button variant="primary" type="submit">
                    Enregistrer
                </Button>
            </Form>

            <Editor setConfig={setConfig} setData={setData} onSave={handleSave} />
        </div>
    );
}

export default UpsertPageForm;
