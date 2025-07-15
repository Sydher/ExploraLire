import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import MainSites from './pages/sites/MainSites.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />

      <Route path="sites">
        <Route index element={<MainSites />} />
        <Route path="sites" element={<MainSites />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
