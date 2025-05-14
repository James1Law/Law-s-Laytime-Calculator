import { PDFDownloadLink } from '@react-pdf/renderer'
import { LaytimePDF } from './EventForm'
import type { LaytimeCalculation } from '../types/laytime'

interface SavedCalculationsProps {
  onOpenCalculation?: (calc: LaytimeCalculation) => void
}

export default function SavedCalculations({ onOpenCalculation }: SavedCalculationsProps) {
  const saved = JSON.parse(localStorage.getItem('laytime_calculations') || '[]') as LaytimeCalculation[]

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 dark:bg-zinc-900 py-10">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-8 text-blue-900 dark:text-blue-200">Saved Calculations</h2>
        {saved.length === 0 && <div className="text-zinc-500 text-center">No saved calculations.</div>}
        <div className="space-y-6">
          {saved.map((calc: any) => (
            <div key={calc.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <div>
                  <div className="text-xs text-zinc-500">{new Date(calc.timestamp).toLocaleString()}</div>
                  <div className="font-semibold text-blue-900 dark:text-blue-200">Total Laytime Used: {calc.laytimeUsed.toFixed(2)} hrs</div>
                  <div className="font-semibold text-blue-900 dark:text-blue-200">Demurrage Cost: <span className={calc.demurrageCost > 0 ? 'text-red-600 font-bold' : ''}>${calc.demurrageCost.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-semibold"
                    onClick={() => onOpenCalculation && onOpenCalculation(calc)}
                  >
                    Open
                  </button>
                  <PDFDownloadLink
                    document={
                      <LaytimePDF
                        ports={calc.ports}
                        allowedLaytime={calc.allowedLaytime}
                        demurrageRate={calc.demurrageRate}
                        laytimeUsed={calc.laytimeUsed}
                        remainingLaytime={calc.remainingLaytime}
                        demurrageCost={calc.demurrageCost}
                      />
                    }
                    fileName={`laytime-calculation-${calc.id}.pdf`}
                  >
                    {({ loading }) => (
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-semibold"
                      >
                        {loading ? 'Generating PDF...' : 'Download PDF'}
                      </button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 