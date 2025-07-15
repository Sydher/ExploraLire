import TeacherLayout from "../../components/TeacherLayout";
import Labels from "./Labels";
import Sites from "./Sites";

function MainSites() {
    return (
        <>
            <TeacherLayout>
                <h1>Gestion des sites</h1>
                <Sites></Sites>
                <hr></hr>
                <Labels></Labels>
            </TeacherLayout>
        </>
    );
}

export default MainSites;
