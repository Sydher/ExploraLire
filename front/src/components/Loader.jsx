import { Spinner } from "react-bootstrap";

function Loader({ loading }) {
    // View
    return (
        <>
            {loading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            )}
        </>
    );
}

export default Loader;
