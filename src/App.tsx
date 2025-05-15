import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import EventForm from './components/EventForm'
import SavedCalculations from './components/SavedCalculations'
import LandingPage from './components/LandingPage'
import type { LaytimeCalculation } from './types/laytime'
import './App.css'

function AppContent() {
  const [selectedCalculation, setSelectedCalculation] = useState<LaytimeCalculation | undefined>(undefined)
  const navigate = useNavigate()
  const location = useLocation()

  const isNewCalculation = location.pathname === '/new-calculation'
  const isSavedCalculations = location.pathname === '/saved-calculations'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="flex flex-col gap-2">
          <a
            href="/"
            className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); navigate('/') }}
          >
            Home
          </a>
          <a
            href="/new-calculation"
            className={`nav-link${isNewCalculation ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); navigate('/new-calculation') }}
          >
            New Calculation
          </a>
          <a
            href="/saved-calculations"
            className={`nav-link${isSavedCalculations ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); navigate('/saved-calculations') }}
          >
            Saved Calculations
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-stretch min-h-screen">
        <header className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <h1 className="text-lg font-bold" style={{ color: '#1c1c1c', fontWeight: 700, letterSpacing: 0.5 }}>{"Law's Laytime Calculator"}</h1>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/new-calculation" 
              element={
                <div className="card-panel">
                  <EventForm 
                    initialCalculation={selectedCalculation} 
                    onClearCalculation={() => setSelectedCalculation(undefined)}
                    onSaved={() => navigate('/saved-calculations')}
                  />
                </div>
              } 
            />
            <Route 
              path="/saved-calculations" 
              element={
                <div className="card-panel">
                  <SavedCalculations 
                    onOpenCalculation={calc => { 
                      setSelectedCalculation(calc); 
                      navigate('/new-calculation');
                    }} 
                  />
                </div>
              } 
            />
            <Route 
              path="/calculation/:id" 
              element={
                <div className="card-panel">
                  <EventForm 
                    initialCalculation={selectedCalculation} 
                    onClearCalculation={() => setSelectedCalculation(undefined)}
                    onSaved={() => navigate('/saved-calculations')}
                  />
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
