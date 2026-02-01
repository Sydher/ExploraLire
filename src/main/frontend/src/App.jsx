import { useState } from "react";
import ProfessorHome from "./pages/professor/ProfessorHome";
import SiteView from "./pages/professor/SiteView";
import PageView from "./pages/professor/PageView";
import StudentView from "./pages/student/StudentView";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
    const [mode, setMode] = useState(null);
    const [nav, setNav] = useState({ view: "home" });

    const navigate = (newNav) => setNav(newNav);

    const handleHomeClick = () => {
        setMode(null);
        setNav({ view: "home" });
    };

    if (!mode) {
        return (
            <div className="App">
                <Navbar mode={null} onHomeClick={handleHomeClick} />
                <HomePage onSelectMode={(m) => { setMode(m); setNav({ view: "home" }); }} />
            </div>
        );
    }

    return (
        <div className="App">
            <Navbar mode={mode} onHomeClick={handleHomeClick} />

            <main>
                {mode === "teacher" ? (
                    <>
                        {nav.view === "home" && <ProfessorHome onNavigate={navigate} />}
                        {nav.view === "site" && (
                            <SiteView
                                siteId={nav.siteId}
                                onNavigate={navigate}
                                onBack={() => navigate({ view: "home" })}
                            />
                        )}
                        {nav.view === "page" && (
                            <PageView
                                siteId={nav.siteId}
                                pageId={nav.pageId}
                                onBack={() => navigate({ view: "site", siteId: nav.siteId })}
                            />
                        )}
                    </>
                ) : (
                    <StudentView />
                )}
            </main>
        </div>
    );
}

export default App;
