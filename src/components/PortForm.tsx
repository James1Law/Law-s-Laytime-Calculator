import { useState, useEffect } from 'react'
import { Button, Input, Form, Select, Space, Typography, Divider, Switch, DatePicker, TimePicker, Table } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Port, PortEvent, Deduction } from '../types/laytime'
import { uuidv4 } from '../lib/uuid'
import dayjs from 'dayjs'

interface PortFormProps {
  onPortsChange: (ports: Port[]) => void
  initialPorts?: Port[]
}

export default function PortForm({ onPortsChange, initialPorts }: PortFormProps) {
  const [ports, setPorts] = useState<Port[]>(initialPorts || [])
  const [addPortForm] = Form.useForm()
  const [eventForm] = Form.useForm()
  const [countsTowardsLaytime, setCountsTowardsLaytime] = useState<{ [portId: string]: boolean }>({})

  useEffect(() => {
    if (initialPorts) {
      setPorts(initialPorts)
      onPortsChange(initialPorts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPorts])

  const calculateDuration = (startDate: string, startTime: string, endDate: string, endTime: string, percent: number) => {
    if (!startDate || !startTime || !endDate || !endTime) return 0
    const start = dayjs(`${startDate}T${startTime}`)
    const end = dayjs(`${endDate}T${endTime}`)
    const hours = end.diff(start, 'minute') / 60
    return hours * (percent / 100)
  }

  const handleAddPort = (values: { name: string; type: 'loading' | 'discharging' }) => {
    const newPort: Port = {
      id: uuidv4(),
      name: values.name,
      type: values.type,
      events: [],
    }
    const updatedPorts = [...ports, newPort]
    setPorts(updatedPorts)
    onPortsChange(updatedPorts)
    addPortForm.resetFields()
  }

  const handleRemovePort = (portId: string) => {
    const updatedPorts = ports.filter(port => port.id !== portId)
    setPorts(updatedPorts)
    onPortsChange(updatedPorts)
  }

  const eventColumns = [
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (date: string) => dayjs(date).format('DD-MMM-YYYY') },
    { title: 'Start Time', dataIndex: 'startTime', key: 'startTime' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date: string) => dayjs(date).format('DD-MMM-YYYY') },
    { title: 'End Time', dataIndex: 'endTime', key: 'endTime' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Counts', dataIndex: 'counts', key: 'counts', render: (counts: boolean) => (counts ? 'Yes' : 'No') },
    { title: 'Laytime %', dataIndex: 'laytimePercent', key: 'laytimePercent', render: (_: number, record: PortEvent) => record.counts ? `${record.laytimePercent}%` : '0%' },
    { title: 'Duration (hrs)', dataIndex: 'calculatedDuration', key: 'calculatedDuration', render: (_: number, record: PortEvent) => record.counts ? (record.calculatedDuration?.toFixed(2) ?? '-') : '0.00' },
  ]

  const handleAddEvent = (portId: string, values: any, eventForm?: any) => {
    const startDate = values.startDate.format('YYYY-MM-DD')
    const startTime = values.startTime.format('HH:mm')
    const endDate = values.endDate.format('YYYY-MM-DD')
    const endTime = values.endTime.format('HH:mm')
    const counts = !!values.counts
    const percent = counts ? (values.laytimePercent ?? 100) : 0
    const duration = calculateDuration(startDate, startTime, endDate, endTime, percent)
    const newEvent: PortEvent = {
      id: uuidv4(),
      startDate,
      startTime,
      endDate,
      endTime,
      description: values.description,
      counts,
      laytime: counts,
      laytimePercent: percent,
      calculatedDuration: duration,
    }
    const updatedPorts = ports.map(port => {
      if (port.id === portId) {
        return {
          ...port,
          events: [...port.events, newEvent],
        }
      }
      return port
    })
    setPorts(updatedPorts)
    onPortsChange(updatedPorts)
    setCountsTowardsLaytime(prev => ({ ...prev, [portId]: true }))
    if (eventForm) {
      eventForm.resetFields(['startDate', 'startTime', 'endDate', 'endTime', 'description', 'counts', 'laytimePercent'])
    }
  }

  const handleAddDeduction = (portId: string, values: any) => {
    const durationHours = Number(values.hours || 0)
    const newDeduction: Deduction = {
      id: uuidv4(),
      description: values.description,
      durationHours,
    }
    const updatedPorts = ports.map(port => {
      if (port.id === portId) {
        return {
          ...port,
          deductions: [...(port.deductions || []), newDeduction],
        }
      }
      return port
    })
    setPorts(updatedPorts)
    onPortsChange(updatedPorts)
  }

  const deductionColumns = [
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Duration (hrs)', dataIndex: 'durationHours', key: 'durationHours', render: (d: number) => d.toFixed(2) },
  ]

  return (
    <div className="space-y-6">
      <div className="card-panel">
        <div className="section-title">Add Port</div>
        <Form
          form={addPortForm}
          onFinish={handleAddPort}
          layout="vertical"
          size="large"
        >
          <div className="flex flex-row gap-4 items-end">
            <Form.Item
              name="name"
              label="Port Name"
              rules={[{ required: true, message: 'Please enter port name' }]}
              className="flex-1 !mb-0"
            >
              <Input placeholder="e.g., Dos Bocas" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Port Type"
              rules={[{ required: true, message: 'Please select port type' }]}
              className="flex-1 !mb-0"
            >
              <Select
                options={[
                  { value: 'loading', label: 'Loading' },
                  { value: 'discharging', label: 'Discharging' },
                ]}
              />
            </Form.Item>
            <Form.Item className="!mb-0 flex items-end" style={{ minWidth: 130 }}>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                Add Port
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      {ports.map(port => (
        <div key={port.id} className="card-panel">
          <div className="section-title flex items-center gap-2 mb-4">
            <span>{port.name}</span>
            <span className="text-sm font-normal text-gray-500">({port.type})</span>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemovePort(port.id)}
              style={{ marginLeft: 'auto' }}
            />
          </div>
          <div className="space-y-4">
            <Form
              onFinish={(values) => handleAddEvent(port.id, values, eventForm)}
              layout="vertical"
              size="large"
              initialValues={{ counts: true, laytimePercent: 100 }}
              form={eventForm}
            >
              <div className="flex flex-row gap-4">
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true, message: 'Please select start date' }]}
                  className="flex-1 !mb-0"
                >
                  <DatePicker className="w-full" format="DD-MMM-YYYY" />
                </Form.Item>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true, message: 'Please select start time' }]}
                  className="flex-1 !mb-0"
                >
                  <TimePicker className="w-full" format="HH:mm" />
                </Form.Item>
                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[{ required: true, message: 'Please select end date' }]}
                  className="flex-1 !mb-0"
                >
                  <DatePicker className="w-full" format="DD-MMM-YYYY" />
                </Form.Item>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[{ required: true, message: 'Please select end time' }]}
                  className="flex-1 !mb-0"
                >
                  <TimePicker className="w-full" format="HH:mm" />
                </Form.Item>
              </div>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input placeholder="e.g., Vessel arrived at berth" />
              </Form.Item>
              <Space direction="horizontal" size="large" className="w-full">
                <Form.Item
                  name="counts"
                  label="Counts towards laytime"
                  valuePropName="checked"
                  className="!mb-0"
                  initialValue={true}
                >
                  <Switch
                    defaultChecked
                    onChange={checked => {
                      setCountsTowardsLaytime(prev => ({ ...prev, [port.id]: checked }))
                      if (!checked) {
                        eventForm.setFieldsValue({ laytimePercent: 0 })
                      } else {
                        eventForm.setFieldsValue({ laytimePercent: 100 })
                      }
                    }}
                    checked={countsTowardsLaytime[port.id] !== false}
                  />
                </Form.Item>
                <Form.Item
                  name="laytimePercent"
                  label="Laytime %"
                  className="!mb-0"
                  initialValue={100}
                  rules={[{ required: true, message: 'Enter %' }]}
                >
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    suffix="%"
                    disabled={countsTowardsLaytime[port.id] === false}
                  />
                </Form.Item>
              </Space>
              <Form.Item className="!mb-0">
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  Add Event
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <Table
              dataSource={port.events.map(e => ({ ...e, key: e.id }))}
              columns={eventColumns}
              pagination={false}
              size="small"
            />

            <Divider />

            <Typography.Title level={5}>Deductions</Typography.Title>
            <Form layout="inline" onFinish={values => handleAddDeduction(port.id, values)}>
              <Form.Item name="description" rules={[{ required: true, message: 'Enter description' }]}> 
                <Input placeholder="e.g., Tank Wash" />
              </Form.Item>
              <Form.Item name="hours" rules={[{ required: true, message: 'Hours' }]}> 
                <Input type="number" min={0} step="any" placeholder="Hours (decimals allowed)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Add Deduction</Button>
              </Form.Item>
            </Form>
            <Table
              dataSource={(port.deductions || []).map(d => ({ ...d, key: d.id }))}
              columns={deductionColumns}
              pagination={false}
              size="small"
            />
          </div>
        </div>
      ))}
    </div>
  )
} 