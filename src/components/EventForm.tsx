import { useState, useEffect } from 'react'
import { Button, Form, InputNumber, Space, Typography, Tooltip, DatePicker, Input, message } from 'antd'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import PortForm from './PortForm'
import type { Port, LaytimeCalculation } from '../types/laytime'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1e293b',
  },
  table: {
    width: 400,
    marginBottom: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 12,
    width: 140,
    textAlign: 'left',
  },
  tableCellValue: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 12,
    width: 260,
    textAlign: 'left',
  },
  tableCellLastRow: {
    borderBottomWidth: 0,
  },
  tableCellNoRight: {
    borderRightWidth: 0,
  },
  eventsTable: {
    width: 'auto',
    marginBottom: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventsTableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  eventsTableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 10,
  },
  portHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#1e293b',
  },
  summary: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#334155',
  },
  value: {
    color: '#0f172a',
  },
  demurrage: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#64748b',
  },
  deductionsTable: {
    width: 'auto',
    marginBottom: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deductionsHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1e293b',
  },
  summaryTable: {
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryTableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  summaryTableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    fontSize: 12,
    flex: 1,
  },
  summaryTableCellLast: {
    borderRightWidth: 0,
  },
  summaryTableValue: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  summaryTableDemurrage: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    textAlign: 'left',
    backgroundColor: '#f1f5f9',
    flex: 1,
  },
  tableHeaderCellLast: {
    borderRightWidth: 0,
  },
  tableValueCell: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#0f172a',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    textAlign: 'left',
    flex: 1,
  },
  tableValueCellLast: {
    borderRightWidth: 0,
  },
})

function LaytimePDF({ ports, allowedLaytime, demurrageRate: _demurrageRate, laytimeUsed, remainingLaytime, demurrageCost, vesselName, owner, charterer, cargoName, voyageNo, cpDate, blDate }: {
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
}) {
  const refNo = `LT-${Date.now().toString().slice(-6)}`
  const today = dayjs().format('DD MMM YY')

  // Prepare summary fields for easier rendering
  const summaryFields = [
    { label: 'Vessel Name', value: vesselName || '-' },
    { label: 'Owner', value: owner || '-' },
    { label: 'Charterer', value: charterer || '-' },
    { label: 'Cargo Name', value: cargoName || '-' },
    { label: 'Voyage No.', value: voyageNo || '-' },
    { label: 'B/L Date', value: blDate ? dayjs(blDate).format('DD MMM YY') : '-' },
    { label: 'CP Date', value: cpDate ? dayjs(cpDate).format('DD MMM YY') : '-' },
    { label: 'Laytime Allowed', value: `${allowedLaytime.toFixed(2)} hours` },
    { label: 'Total Laytime Used', value: `${laytimeUsed.toFixed(2)} hours` },
    { label: 'Demurrage Rate', value: `$${_demurrageRate.toFixed(2)}/day` },
    { label: 'Demurrage Cost', value: `$${demurrageCost.toFixed(2)}`, isDemurrage: demurrageCost > 0 },
  ]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Laytime Calculation Report</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Ref. No.: {refNo}</Text>
          <Text style={styles.infoText}>Ref. Date: {today}</Text>
        </View>

        {/* Horizontal Main Details Table */}
        <View style={styles.summaryTable}>
          <View style={styles.summaryTableRow}>
            {summaryFields.slice(0, 7).map((field, idx, arr) => (
              <Text
                style={
                  idx === arr.length - 1
                    ? [styles.tableHeaderCell, styles.tableHeaderCellLast]
                    : [styles.tableHeaderCell]
                }
                key={field.label}
              >
                {field.label}
              </Text>
            ))}
          </View>
          <View style={styles.summaryTableRow}>
            {summaryFields.slice(0, 7).map((field, idx, arr) => (
              <Text
                style={
                  idx === arr.length - 1
                    ? [styles.tableValueCell, styles.tableValueCellLast]
                    : [styles.tableValueCell]
                }
                key={field.label}
              >
                {field.value}
              </Text>
            ))}
          </View>
        </View>

        {/* Port Events Tables */}
        {ports.map(port => (
          <View key={port.id}>
            <Text style={styles.portHeader}>
              {port.name} ({port.type === 'loading' ? 'Loading' : 'Discharging'})
            </Text>
            <View style={styles.eventsTable}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Day</Text>
                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Time</Text>
                <Text style={[styles.tableHeaderCell, { width: '35%' }]}>Event</Text>
                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Counts</Text>
                <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Laytime</Text>
                <Text style={[styles.tableHeaderCell, styles.tableHeaderCellLast, { width: '10%' }]}>Demurrage</Text>
              </View>
              {port.events.map(event => (
                <View style={styles.tableRow} key={event.id}>
                  <Text style={[styles.tableValueCell, { width: '15%' }]}>
                    {dayjs(event.startDate).format('DD MMM YY')}
                  </Text>
                  <Text style={[styles.tableValueCell, { width: '10%' }]}>
                    {dayjs(event.startDate).format('ddd')}
                  </Text>
                  <Text style={[styles.tableValueCell, { width: '10%' }]}>
                    {event.startTime}
                  </Text>
                  <Text style={[styles.tableValueCell, { width: '35%' }]}>
                    {event.description}
                  </Text>
                  <Text style={[styles.tableValueCell, { width: '10%' }]}>
                    {event.counts ? 'Yes' : 'No'}
                  </Text>
                  <Text style={[styles.tableValueCell, { width: '10%' }]}>
                    {event.counts ? `${event.laytimePercent}%` : '0%'}
                  </Text>
                  <Text style={[styles.tableValueCell, styles.tableValueCellLast, { width: '10%' }]}>
                    {event.counts && typeof event.calculatedDuration === 'number' && event.calculatedDuration > 0 ? 'Yes' : 'No'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Deductions Table */}
            {port.deductions && port.deductions.length > 0 && (
              <>
                <Text style={styles.deductionsHeader}>Deductions</Text>
                <View style={styles.deductionsTable}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableHeaderCell, { width: '70%' }]}>Description</Text>
                    <Text style={[styles.tableHeaderCell, styles.tableHeaderCellLast, { width: '30%' }]}>Duration (hours)</Text>
                  </View>
                  {port.deductions.map(deduction => (
                    <View style={styles.tableRow} key={deduction.id}>
                      <Text style={[styles.tableValueCell, { width: '70%' }]}>
                        {deduction.description}
                      </Text>
                      <Text style={[styles.tableValueCell, styles.tableValueCellLast, { width: '30%' }]}>
                        {deduction.durationHours.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ))}

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          <View style={styles.summaryTableRow}>
            <Text style={styles.tableHeaderCell}>Laytime Allowed</Text>
            <Text style={styles.tableHeaderCell}>Total Laytime Used</Text>
            <Text style={styles.tableHeaderCell}>Demurrage Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.tableHeaderCellLast]}>Demurrage Cost</Text>
          </View>
          <View style={styles.summaryTableRow}>
            <Text style={styles.tableValueCell}>
              {allowedLaytime.toFixed(2)} hours
            </Text>
            <Text style={styles.tableValueCell}>
              {laytimeUsed.toFixed(2)} hours
            </Text>
            <Text style={styles.tableValueCell}>
              ${_demurrageRate.toFixed(2)}/day
            </Text>
            <Text style={[
              styles.tableValueCell,
              styles.tableValueCellLast,
              demurrageCost > 0 ? styles.summaryTableDemurrage : {}
            ]}>
              ${demurrageCost.toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

function calculateLaytimeUsed(ports: Port[]): number {
  return ports.reduce((total, port) => {
    const eventTotal = port.events.reduce((portTotal, event) => {
      if (event.counts && typeof event.calculatedDuration === 'number') {
        return portTotal + event.calculatedDuration
      }
      return portTotal
    }, 0)
    const deductionTotal = (port.deductions || []).reduce((sum, d) => sum + d.durationHours, 0)
    return total + Math.max(0, eventTotal - deductionTotal)
  }, 0)
}

export default function EventForm({ initialCalculation, onClearCalculation, onSaved }: { initialCalculation?: LaytimeCalculation, onClearCalculation?: () => void, onSaved?: () => void }) {
  const [ports, setPorts] = useState<Port[]>(initialCalculation?.ports || [])
  const [allowedLaytime, setAllowedLaytime] = useState(initialCalculation?.allowedLaytime || 0)
  const [demurrageRate, setDemurrageRate] = useState(initialCalculation?.demurrageRate || 0)
  const [vesselName, setVesselName] = useState('')
  const [owner, setOwner] = useState('')
  const [charterer, setCharterer] = useState('')
  const [cargoName, setCargoName] = useState('')
  const [voyageNo, setVoyageNo] = useState('')
  const [cpDate, setCpDate] = useState(null as any)
  const [blDate, setBlDate] = useState(null as any)
  const navigate = useNavigate();
  const { id } = useParams();

  const ukNumberFormat = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  useEffect(() => {
    if (initialCalculation) {
      setPorts(initialCalculation.ports || [])
      setAllowedLaytime(initialCalculation.allowedLaytime || 0)
      setDemurrageRate(initialCalculation.demurrageRate || 0)
      setVesselName(initialCalculation.vesselName || '')
      setOwner(initialCalculation.owner || '')
      setCharterer(initialCalculation.charterer || '')
      setCargoName(initialCalculation.cargoName || '')
      setVoyageNo(initialCalculation.voyageNo || '')
      setCpDate(initialCalculation.cpDate ? dayjs(initialCalculation.cpDate) : null)
      setBlDate(initialCalculation.blDate ? dayjs(initialCalculation.blDate) : null)
    }
  }, [initialCalculation])

  const laytimeUsed = calculateLaytimeUsed(ports)
  const remainingLaytime = allowedLaytime - laytimeUsed
  const demurrageRatePerHour = demurrageRate / 24
  const demurrageCost = laytimeUsed > allowedLaytime
    ? (laytimeUsed - allowedLaytime) * demurrageRatePerHour
    : 0

  const handleSave = () => {
    const calculation: LaytimeCalculation = {
      id: id || Date.now().toString(),
      timestamp: new Date().toISOString(),
      ports,
      allowedLaytime,
      demurrageRate,
      laytimeUsed,
      remainingLaytime,
      demurrageCost,
      vesselName,
      owner,
      charterer,
      cargoName,
      voyageNo,
      cpDate: cpDate ? cpDate.toISOString() : undefined,
      blDate: blDate ? blDate.toISOString() : undefined,
    }
    // Remove old key if present
    localStorage.removeItem('calculations')
    let saved: LaytimeCalculation[] = []
    try {
      const raw = localStorage.getItem('laytime_calculations')
      if (raw) saved = JSON.parse(raw)
      if (!Array.isArray(saved)) saved = []
    } catch {
      saved = []
    }
    localStorage.setItem('laytime_calculations', JSON.stringify([...saved, calculation]))
    message.success('Calculation saved successfully')
    setPorts([])
    setAllowedLaytime(0)
    setDemurrageRate(0)
    setVesselName('')
    setOwner('')
    setCharterer('')
    setCargoName('')
    setVoyageNo('')
    setCpDate(null)
    setBlDate(null)
    if (onSaved) onSaved();
    navigate(`/calculation/${calculation.id}`);
  }

  return (
    <div className="w-full">
      <div className="card-panel">
        <div className="card-panel" style={{ marginBottom: 0, boxShadow: 'none', border: 'none', padding: 0 }}>
          <div className="section-title flex items-center gap-2">
            Laytime Settings
            <Tooltip title="Details as per charterparty">
              <InfoCircleOutlined style={{ fontSize: 12, color: '#64748b', cursor: 'pointer', marginLeft: 6, transform: 'translateY(-3px)' }} />
            </Tooltip>
          </div>
          <div className="flex flex-row gap-4">
            <Form layout="vertical" className="w-full">
              <div style={{ display: 'flex', gap: 16 }}>
                <Form.Item label="Vessel Name" className="flex-1 !mb-0">
                  <Input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="Vessel Name" size="large" />
                </Form.Item>
                <Form.Item label="Owner" className="flex-1 !mb-0">
                  <Input value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner" size="large" />
                </Form.Item>
                <Form.Item label="Charterer" className="flex-1 !mb-0">
                  <Input value={charterer} onChange={e => setCharterer(e.target.value)} placeholder="Charterer" size="large" />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <Form.Item label="Cargo Name" className="flex-1 !mb-0">
                  <Input value={cargoName} onChange={e => setCargoName(e.target.value)} placeholder="Cargo Name" size="large" />
                </Form.Item>
                <Form.Item label="Voyage No." className="flex-1 !mb-0">
                  <Input value={voyageNo} onChange={e => setVoyageNo(e.target.value)} placeholder="Voyage No." size="large" />
                </Form.Item>
                <Form.Item label="CP Date" className="flex-1 !mb-0">
                  <DatePicker value={cpDate} onChange={setCpDate} className="w-full" size="large" format="DD MMM YYYY" />
                </Form.Item>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <Form.Item label="B/L Date" className="flex-1 !mb-0">
                  <DatePicker value={blDate} onChange={setBlDate} className="w-full" size="large" format="DD MMM YYYY" />
                </Form.Item>
                <Form.Item label="Allowed Laytime (hours)" className="flex-1 !mb-0">
                  <InputNumber
                    value={allowedLaytime}
                    onChange={value => setAllowedLaytime(Number(value))}
                    min={0}
                    className="w-full"
                    size="large"
                    placeholder="Allowed Laytime (hours)"
                  />
                </Form.Item>
                <Form.Item label="Demurrage Rate (USD/day)" className="flex-1 !mb-0">
                  <InputNumber
                    value={demurrageRate}
                    onChange={value => setDemurrageRate(Number(value))}
                    min={0}
                    className="w-full"
                    size="large"
                    placeholder="Demurrage Rate (USD/day)"
                    formatter={value => typeof value === 'number' ? ukNumberFormat.format(value) : (value ? ukNumberFormat.format(Number(value)) : '')}
                    parser={value => value ? Number(value.replace(/,/g, '')) : 0}
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>

        <PortForm onPortsChange={setPorts} initialPorts={ports} />

        <div className="card-panel" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '2px solid #e0e0e0' }}>
          <div className="section-title" style={{ marginBottom: '1.5rem' }}>
            Summary
          </div>
          <div className="flex flex-col gap-4">
            <Typography.Text>
              <Typography.Text strong>Total Laytime Used:</Typography.Text>{' '}
              {laytimeUsed.toFixed(2)} hours
            </Typography.Text>
            <Typography.Text>
              <Typography.Text strong>Remaining Laytime:</Typography.Text>{' '}
              {remainingLaytime.toFixed(2)} hours
            </Typography.Text>
            <Typography.Text>
              <Typography.Text strong>Demurrage Cost:</Typography.Text>{' '}
              <Typography.Text type={demurrageCost > 0 ? 'danger' : undefined} strong>
                ${ukNumberFormat.format(demurrageCost)}
              </Typography.Text>
              {demurrageRate > 0 && (
                <Typography.Text type="secondary" className="ml-2">
                  (at ${ukNumberFormat.format(demurrageRate)}/day)
                </Typography.Text>
              )}
            </Typography.Text>
          </div>
        </div>

        <Space className="w-full justify-end" size="middle">
          <PDFDownloadLink
            document={
              <LaytimePDF
                ports={ports}
                allowedLaytime={allowedLaytime}
                demurrageRate={demurrageRate}
                laytimeUsed={laytimeUsed}
                remainingLaytime={remainingLaytime}
                demurrageCost={demurrageCost}
                vesselName={vesselName}
                owner={owner}
                charterer={charterer}
                cargoName={cargoName}
                voyageNo={voyageNo}
                cpDate={cpDate?.toISOString()}
                blDate={blDate?.toISOString()}
              />
            }
            fileName={`laytime-report-${vesselName || 'unnamed'}-${voyageNo || 'novoyage'}.pdf`}
            className="ant-btn ant-btn-primary ant-btn-lg"
            onClick={() => {
              // Add a small delay to ensure the PDF is generated
              return new Promise(resolve => setTimeout(resolve, 100));
            }}
          >
            {({ loading, error }) => (
              <Button
                type="primary"
                size="large"
                loading={loading}
                disabled={loading || !!error}
                onClick={(e) => {
                  if (error) {
                    e.preventDefault();
                    message.error('Failed to generate PDF. Please try again.');
                  }
                }}
              >
                {error ? 'Error' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
          >
            Save Calculation
          </Button>
        </Space>
      </div>
    </div>
  )
}

export { LaytimePDF } 