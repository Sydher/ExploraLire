import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import Pages from './pages/pages/Pages.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />

      <Route path="sites">
        <Route index element={<Pages />} />
        <Route path="pages" element={<Pages />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
