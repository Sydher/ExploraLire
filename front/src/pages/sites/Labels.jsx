import { useEffect, useState } from "react";
import TeacherLayout from "../../components/TeacherLayout"

function Labels() {
    // Get all labels
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

    // Refresh after add
    const handlePageAdded = (newPage) => {
        setPages([...pages, newPage]);
    };

    return (
        <>
            <TeacherLayout>
                <div>
                    {pages.map((page) => {
                        return (
                            <div id={page.id}>{page.name}</div>
                        );
                    })}
                </div>
                <hr></hr>
                <UpsertPageForm type="POST" onPageAdded={handlePageAdded} />
            </TeacherLayout>
        </>
    )
}

export default Sites
