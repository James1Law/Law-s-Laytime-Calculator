import { PDFDownloadLink } from '@react-pdf/renderer'
import { LaytimePDF } from './EventForm'
import type { LaytimeCalculation } from '../types/laytime'
import dayjs from 'dayjs'

interface SavedCalculationsProps {
  onOpenCalculation?: (calc: LaytimeCalculation) => void
}

export default function SavedCalculations({ onOpenCalculation }: SavedCalculationsProps) {
  const saved = JSON.parse(localStorage.getItem('laytime_calculations') || '[]') as LaytimeCalculation[]

  return (
    <div className="w-full">
      <div className="card-panel">
        <div className="section-title mb-6">Saved Calculations</div>
        {saved.length === 0 && <div className="text-zinc-500">No saved calculations.</div>}
        <div className="space-y-6">
          {saved.map((calc: any) => (
            <div key={calc.id} className="card-panel" style={{ marginBottom: 0 }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                <div>
                  <div className="text-xs text-zinc-500">{calc.timestamp ? dayjs(calc.timestamp).format('DD-MMM-YYYY') : ''}</div>
                  <div className="font-semibold" style={{ color: '#1c1c1c' }}>Total Laytime Used: {calc.laytimeUsed.toFixed(2)} hrs</div>
                  <div className="font-semibold" style={{ color: '#1c1c1c' }}>
                    Demurrage Cost: <span className={calc.demurrageCost > 0 ? 'text-red-600 font-bold' : ''}>${calc.demurrageCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="ant-btn ant-btn-primary"
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
                        className="ant-btn ant-btn-primary"
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