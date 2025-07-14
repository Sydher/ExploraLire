import { useEffect, useState } from "react";
import TeacherLayout from "../../components/TeacherLayout"

function Sites() {
    // Get all sites
    const [sites, setSites] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/sites')
            .then((response) => response.json())
            .then((data) => {
                console.debug(data);
                setSites(data);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }, []);

    return (
        <>
            <TeacherLayout>
                <h1>Liste de mes sites</h1>

                {sites || sites != undefined || sites.length === 0 ? (
                    <p>Aucun site trouvé.</p>
                ) : (
                    <ul>
                        {sites.map((site) => (
                            <li key={site.id}>{site.name}</li>
                        ))}
                    </ul>
                )}
                <hr></hr>
            </TeacherLayout>
        </>
    )
}

export default Sites
