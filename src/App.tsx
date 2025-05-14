import { useState } from 'react'
import { Tabs } from 'antd'
import EventForm from './components/EventForm'
import SavedCalculations from './components/SavedCalculations'
import './App.css'

function App() {
  const [selectedCalculation, setSelectedCalculation] = useState(null)
  const [activeTab, setActiveTab] = useState('new')

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Law's Laytime Calculator</h1>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          items={[{
            key: 'new',
            label: 'New Calculation',
            children: <EventForm initialCalculation={selectedCalculation} onClearCalculation={() => setSelectedCalculation(null)} />
          }, {
            key: 'saved',
            label: 'Saved Calculations',
            children: <SavedCalculations onOpenCalculation={calc => { setSelectedCalculation(calc); setActiveTab('new') }} />
          }]}
        />
      </main>
    </div>
  )
}

export default App
