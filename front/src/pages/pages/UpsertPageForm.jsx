import { useState } from "react";
import { Button, Form } from "react-bootstrap";

// TODO séparer create & update ?
function UpsertPageForm({onPageAdded}) {
  const [pageName, setPageName] = useState('');
  const [pageContent, setPageContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: pageName, content: pageContent }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.debug(data);
      onPageAdded(data); // Appeler la fonction de rappel pour mettre à jour la liste des pages
      setPageName(''); // Réinitialiser le champ du formulaire
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Nom</Form.Label>
        <Form.Control type="text" placeholder="Nom de la page" value={pageName} onChange={(e) => setPageName(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formContent">
        <Form.Label>Contenu</Form.Label>
        <Form.Control type="text" placeholder="Contenu de la page" value={pageContent} onChange={(e) => setPageContent(e.target.value)} />
      </Form.Group>

      <Button variant="secondary" type="button">
        Annuler
      </Button>
      <Button variant="primary" type="submit">
        Enregistrer
      </Button>
    </Form>
  );
}

export default UpsertPageForm;
