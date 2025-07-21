import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useError } from "../context/ErrorContext";
import { Outlet } from "react-router";
import { Alert } from "react-bootstrap";

const TeacherLayout = () => {
    return (
        <>
            <TeacherNavBar />

            <Container className="mt-3">
                <ErrorBoundary />
                <main>
                    <Outlet />
                </main>
            </Container>
        </>
    );
};

const TeacherNavBar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">ExploraLire</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Accueil</Nav.Link>
                        <Nav.Link href="/gestion/sites">Mes Sites</Nav.Link>
                        <Nav.Link href="/gestion/pages">Mes Pages</Nav.Link>
                        <Nav.Link href="/gestion/exemple">Exemple</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

function ErrorBoundary() {
    const { error, clearError } = useError();

    if (!error) return null;

    return (
        <Alert variant="danger" onClose={clearError} dismissible>
            {error}
        </Alert>
    );
}

export default TeacherLayout;
