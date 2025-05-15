import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import { Layout } from 'antd'
import EventForm from './components/EventForm'
import SavedCalculations from './components/SavedCalculations'
import LandingPage from './components/LandingPage'
import type { LaytimeCalculation } from './types/laytime'
import './App.css'

const { Sider, Content } = Layout

function AppContent() {
  const [selectedCalculation, setSelectedCalculation] = useState<LaytimeCalculation | undefined>(undefined)
  const navigate = useNavigate()
  const location = useLocation()

  const isNewCalculation = location.pathname === '/new-calculation'
  const isSavedCalculations = location.pathname === '/saved-calculations'

  return (
    <Layout className="min-h-screen bg-background">
      <Sider 
        width={240} 
        className="sidebar"
        breakpoint="lg"
        collapsedWidth={64}
      >
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
      </Sider>
      <Layout>
        <Content className="flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-lg font-bold" style={{ color: '#1c1c1c', fontWeight: 700, letterSpacing: 0.5 }}>{"Law's Laytime Calculator"}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/new-calculation" 
                  element={
                    <div className="card-panel">
                      <EventForm 
                        initialCalculation={selectedCalculation} 
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
                      <CalculationLoader onSaved={() => navigate('/saved-calculations')} />
                    </div>
                  } 
                />
              </Routes>
            </div>
          </main>
        </Content>
      </Layout>
    </Layout>
  )
}

function CalculationLoader({ onSaved }: { onSaved: () => void }) {
  const { id } = useParams();
  let calculation;
  try {
    const raw = localStorage.getItem('laytime_calculations');
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        calculation = saved.find((c: any) => c.id === id);
      }
    }
  } catch {
    calculation = undefined;
  }
  return <EventForm initialCalculation={calculation} onSaved={onSaved} />;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
