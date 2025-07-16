import { Routes, Route } from "react-router";
import { ErrorProvider } from "./context/ErrorContext.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import TeacherLayout from "./components/TeacherLayout.jsx";
import Home from "./pages/Home.jsx";
import MainSites from "./pages/sites/MainSites.jsx";

function App() {
    return (
        <ErrorProvider>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />

            <Routes>
                <Route element={<TeacherLayout />}>
                    <Route index element={<Home />} />
                    <Route path="gestion">
                        <Route path="sites" element={<MainSites />} />
                    </Route>
                </Route>
            </Routes>
        </ErrorProvider>
    );
}

export default App;
