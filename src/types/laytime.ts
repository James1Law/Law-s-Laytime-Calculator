export interface Deduction {
  id: string
  description: string
  durationHours: number
}

export interface Port {
  id: string
  name: string
  type: 'loading' | 'discharging'
  events: PortEvent[]
  deductions?: Deduction[]
}

export interface PortEvent {
  id: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  description: string
  counts: boolean
  laytime: boolean
  laytimePercent: number
  calculatedDuration?: number
}

export interface LaytimeCalculation {
  id: string
  timestamp: string
  ports: Port[]
  allowedLaytime: number
  demurrageRate: number
  laytimeUsed: number
  remainingLaytime: number
  demurrageCost: number
  vesselName?: string
  owner?: string
  charterer?: string
  cargoName?: string
  voyageNo?: string
  cpDate?: string
  blDate?: string
} 