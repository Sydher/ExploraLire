import { useState } from 'react'
import LabelManagement from './pages/LabelManagement'
import SiteManagement from './pages/SiteManagement'
import PageManagement from './pages/PageManagement'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('sites')

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">ExploraLire</span>
          <div className="navbar-nav">
            <button
              className={`nav-link btn btn-link ${currentPage === 'sites' ? 'active' : ''}`}
              onClick={() => setCurrentPage('sites')}
              aria-current={currentPage === 'sites' ? 'page' : undefined}
            >
              Sites
            </button>
            <button
              className={`nav-link btn btn-link ${currentPage === 'pages' ? 'active' : ''}`}
              onClick={() => setCurrentPage('pages')}
              aria-current={currentPage === 'pages' ? 'page' : undefined}
            >
              Pages
            </button>
            <button
              className={`nav-link btn btn-link ${currentPage === 'labels' ? 'active' : ''}`}
              onClick={() => setCurrentPage('labels')}
              aria-current={currentPage === 'labels' ? 'page' : undefined}
            >
              Labels
            </button>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'sites' && <SiteManagement />}
        {currentPage === 'pages' && <PageManagement />}
        {currentPage === 'labels' && <LabelManagement />}
      </main>
    </div>
  )
}

export default App
