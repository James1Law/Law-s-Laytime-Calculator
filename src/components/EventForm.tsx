import { useState, useEffect } from 'react'
import { Button, Form, InputNumber, Card, Space, Typography } from 'antd'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import PortForm from './PortForm'
import type { Port, LaytimeCalculation } from '../types/laytime'

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
    width: 'auto',
    marginBottom: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    minWidth: 80,
  },
  summary: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f8fafc',
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
})

function LaytimePDF({ ports, allowedLaytime, demurrageRate: _demurrageRate, laytimeUsed, remainingLaytime, demurrageCost }: {
  ports: Port[]
  allowedLaytime: number
  demurrageRate: number
  laytimeUsed: number
  remainingLaytime: number
  demurrageCost: number
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Laytime Calculation Report</Text>
        {ports.map(port => (
          <View key={port.id} style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Port: {port.name} ({port.type})</Text>
            </View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Start Date</Text>
              <Text style={styles.tableCell}>Day</Text>
              <Text style={styles.tableCell}>Start Time</Text>
              <Text style={styles.tableCell}>End Date</Text>
              <Text style={styles.tableCell}>End Time</Text>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCell}>Counts</Text>
              <Text style={styles.tableCell}>Laytime %</Text>
              <Text style={styles.tableCell}>Duration (hrs)</Text>
            </View>
            {port.events.map(event => (
              <View style={styles.tableRow} key={event.id}>
                <Text style={styles.tableCell}>{event.startDate}</Text>
                <Text style={styles.tableCell}>{dayjs(event.startDate).format('dddd')}</Text>
                <Text style={styles.tableCell}>{event.startTime}</Text>
                <Text style={styles.tableCell}>{event.endDate}</Text>
                <Text style={styles.tableCell}>{event.endTime}</Text>
                <Text style={styles.tableCell}>{event.description}</Text>
                <Text style={styles.tableCell}>{event.counts ? 'Yes' : 'No'}</Text>
                <Text style={styles.tableCell}>{event.laytimePercent}%</Text>
                <Text style={styles.tableCell}>{typeof event.calculatedDuration === 'number' ? event.calculatedDuration.toFixed(2) : '-'}</Text>
              </View>
            ))}
            {/* Deductions Table */}
            {(port.deductions && port.deductions.length > 0) && (
              <>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Deduction Description</Text>
                  <Text style={styles.tableCell}>Duration (hrs)</Text>
                </View>
                {port.deductions.map(deduction => (
                  <View style={styles.tableRow} key={deduction.id}>
                    <Text style={styles.tableCell}>{deduction.description}</Text>
                    <Text style={styles.tableCell}>{deduction.durationHours.toFixed(2)}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ))}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total Laytime Used:</Text>
            <Text style={styles.value}>{laytimeUsed.toFixed(2)} hours</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Allowed Laytime:</Text>
            <Text style={styles.value}>{allowedLaytime.toFixed(2)} hours</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Remaining Laytime:</Text>
            <Text style={styles.value}>{remainingLaytime.toFixed(2)} hours</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Demurrage Cost:</Text>
            <Text style={demurrageCost > 0 ? styles.demurrage : styles.value}>
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

export default function EventForm({ initialCalculation, onClearCalculation }: { initialCalculation?: LaytimeCalculation, onClearCalculation?: () => void }) {
  const [ports, setPorts] = useState<Port[]>(initialCalculation?.ports || [])
  const [allowedLaytime, setAllowedLaytime] = useState(initialCalculation?.allowedLaytime || 0)
  const [demurrageRate, setDemurrageRate] = useState(initialCalculation?.demurrageRate || 0)

  useEffect(() => {
    if (initialCalculation) {
      setPorts(initialCalculation.ports || [])
      setAllowedLaytime(initialCalculation.allowedLaytime || 0)
      setDemurrageRate(initialCalculation.demurrageRate || 0)
    }
  }, [initialCalculation])

  const laytimeUsed = calculateLaytimeUsed(ports)
  const remainingLaytime = allowedLaytime - laytimeUsed
  const demurrageRatePerHour = demurrageRate / 24
  const demurrageCost = laytimeUsed > allowedLaytime
    ? (laytimeUsed - allowedLaytime) * demurrageRatePerHour
    : 0

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 dark:bg-zinc-900 py-10">
      <Card className="w-full max-w-4xl">
        <Space direction="vertical" size="large" className="w-full">
          <Card>
            <Typography.Title level={4} className="!mb-6">
              Laytime Settings
            </Typography.Title>
            <Space direction="horizontal" size="middle" className="w-full">
              <Form layout="vertical" className="w-full flex flex-row gap-4">
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
                  />
                </Form.Item>
              </Form>
            </Space>
          </Card>

          <PortForm onPortsChange={setPorts} initialPorts={ports} />

          <Card>
            <Typography.Title level={4} className="!mb-6">
              Summary
            </Typography.Title>
            <Space direction="vertical" size="middle" className="w-full">
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
                  ${demurrageCost.toFixed(2)}
                </Typography.Text>
                {demurrageRate > 0 && (
                  <Typography.Text type="secondary" className="ml-2">
                    (at ${demurrageRate.toFixed(2)}/day)
                  </Typography.Text>
                )}
              </Typography.Text>
            </Space>
          </Card>

          <Space className="w-full justify-end" size="middle">
            {initialCalculation && (
              <Button onClick={onClearCalculation} danger type="default">
                Clear Loaded Calculation
              </Button>
            )}
            <PDFDownloadLink
              document={
                <LaytimePDF
                  ports={ports}
                  allowedLaytime={allowedLaytime}
                  demurrageRate={demurrageRate}
                  laytimeUsed={laytimeUsed}
                  remainingLaytime={remainingLaytime}
                  demurrageCost={demurrageCost}
                />
              }
              fileName="laytime-calculation.pdf"
            >
              {({ loading }) => (
                <Button type="primary" loading={loading} size="large">
                  Download PDF
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                const calculation: LaytimeCalculation = {
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  ports,
                  allowedLaytime,
                  demurrageRate,
                  laytimeUsed,
                  remainingLaytime,
                  demurrageCost,
                }
                const saved = JSON.parse(localStorage.getItem('calculations') || '[]')
                localStorage.setItem('calculations', JSON.stringify([...saved, calculation]))
                setPorts([])
                setAllowedLaytime(0)
                setDemurrageRate(0)
              }}
            >
              Save Calculation
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  )
}

export { LaytimePDF } 