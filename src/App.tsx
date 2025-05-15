import { useState } from 'react'
import EventForm from './components/EventForm'
import SavedCalculations from './components/SavedCalculations'
import type { LaytimeCalculation } from './types/laytime'
import './App.css'

function App() {
  const [selectedCalculation, setSelectedCalculation] = useState<LaytimeCalculation | undefined>(undefined)
  const [activeTab, setActiveTab] = useState('new')

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="flex flex-col gap-2">
          <a
            href="#"
            className={`nav-link${activeTab === 'new' ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); setActiveTab('new') }}
          >
            New Calculation
          </a>
          <a
            href="#"
            className={`nav-link${activeTab === 'saved' ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); setActiveTab('saved') }}
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
          <div className="card-panel">
            {activeTab === 'new' ? (
              <EventForm 
                initialCalculation={selectedCalculation} 
                onClearCalculation={() => setSelectedCalculation(undefined)}
                onSaved={() => setActiveTab('saved')}
              />
            ) : (
              <SavedCalculations onOpenCalculation={calc => { setSelectedCalculation(calc); setActiveTab('new') }} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
