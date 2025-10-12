import { useState } from 'react'
import LabelManagement from './pages/LabelManagement'
import SiteManagement from './pages/SiteManagement'
import PageManagement from './pages/PageManagement'
import StudentView from './pages/student/StudentView'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  const [mode, setMode] = useState(null)
  const [currentPage, setCurrentPage] = useState('sites')

  if (!mode) {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">ExploraLire</span>
          </div>
        </nav>
        <HomePage onSelectMode={setMode} />
      </div>
    )
  }

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <button
            className="navbar-brand mb-0 h1 btn btn-link text-white text-decoration-none"
            onClick={() => setMode(null)}
            style={{ cursor: 'pointer' }}
            title="Retour à l'accueil"
          >
            <i className="bi bi-house-door me-2"></i>
            ExploraLire
          </button>

          <div className="d-flex gap-3 align-items-center">
            {mode === 'teacher' && (
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
            )}

            <div className="btn-group" role="group" aria-label="Sélection du mode">
              <button
                type="button"
                className={`btn ${mode === 'teacher' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setMode('teacher')}
              >
                <i className="bi bi-person-gear me-2"></i>
                Mode Professeur
              </button>
              <button
                type="button"
                className={`btn ${mode === 'student' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => setMode('student')}
              >
                <i className="bi bi-person me-2"></i>
                Mode Élève
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {mode === 'teacher' ? (
          <>
            {currentPage === 'sites' && <SiteManagement />}
            {currentPage === 'pages' && <PageManagement />}
            {currentPage === 'labels' && <LabelManagement />}
          </>
        ) : (
          <StudentView />
        )}
      </main>
    </div>
  )
}

export default App
