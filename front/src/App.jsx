import { useState } from "react";
import LabelManagement from "./pages/professor/LabelManagement";
import SiteManagement from "./pages/professor/SiteManagement";
import PageManagement from "./pages/professor/PageManagement";
import StudentView from "./pages/student/StudentView";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
    const [mode, setMode] = useState(null);
    const [currentPage, setCurrentPage] = useState("sites");

    if (!mode) {
        return (
            <div className="App">
                <Navbar mode={null} />
                <HomePage onSelectMode={setMode} />
            </div>
        );
    }

    return (
        <div className="App">
            <Navbar
                mode={mode}
                currentPage={currentPage}
                onModeChange={setMode}
                onPageChange={setCurrentPage}
                onHomeClick={() => setMode(null)}
            />

            <main>
                {mode === "teacher" ? (
                    <>
                        {currentPage === "labels" && <LabelManagement />}
                        {currentPage === "sites" && <SiteManagement />}
                        {currentPage === "pages" && <PageManagement />}
                    </>
                ) : (
                    <StudentView />
                )}
            </main>
        </div>
    );
}

export default App;
