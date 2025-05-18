import { useEffect, useState } from "react";
import TeacherLayout from "../../components/TeacherLayout"
import UpsertPageForm from "./UpsertPageForm";

function Pages() {
    // Get all pages
    const [pages, setPages] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/pages')
            .then((response) => response.json())
            .then((data) => {
                console.debug(data);
                setPages(data);
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
                            <div>{page.name}</div>
                        );
                    })}
                </div>
                <hr></hr>
                <UpsertPageForm onPageAdded={handlePageAdded} />
            </TeacherLayout>
        </>
    )
}

export default Pages
