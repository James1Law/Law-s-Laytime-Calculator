import { Table, Button, Space, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import type { LaytimeCalculation } from '../types/laytime'
import dayjs from 'dayjs'

interface SavedCalculationsProps {
  onOpenCalculation?: (calc: LaytimeCalculation) => void
}

export default function SavedCalculations({ onOpenCalculation }: SavedCalculationsProps) {
  const navigate = useNavigate()
  let saved: LaytimeCalculation[] = []
  try {
    const raw = localStorage.getItem('laytime_calculations')
    if (raw) saved = JSON.parse(raw)
    if (!Array.isArray(saved)) saved = []
  } catch {
    saved = []
  }

  const handleDelete = (id: string) => {
    const updatedSaved = saved.filter(calc => calc.id !== id)
    localStorage.setItem('laytime_calculations', JSON.stringify(updatedSaved))
    // Force a re-render
    window.location.reload()
  }

  const columns: ColumnsType<LaytimeCalculation> = [
    {
      title: 'Calculation No.',
      dataIndex: 'id',
      key: 'id',
      render: (_: string, __: any, index: number) => index + 1,
      width: 120,
    },
    {
      title: 'Vessel Name',
      dataIndex: 'vesselName',
      key: 'vesselName',
      width: 150,
    },
    {
      title: 'Charterer',
      dataIndex: 'charterer',
      key: 'charterer',
      width: 150,
    },
    {
      title: 'Voyage No.',
      dataIndex: 'voyageNo',
      key: 'voyageNo',
      width: 120,
    },
    {
      title: 'CP Date',
      dataIndex: 'cpDate',
      key: 'cpDate',
      render: (date: string) => date ? dayjs(date).format('DD MMM YYYY') : '-',
      width: 120,
    },
    {
      title: 'Allowed Laytime (hrs)',
      dataIndex: 'allowedLaytime',
      key: 'allowedLaytime',
      render: (value: number) => value.toFixed(2),
      width: 150,
    },
    {
      title: 'Demurrage Rate (USD/day)',
      dataIndex: 'demurrageRate',
      key: 'demurrageRate',
      render: (value: number) => value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      width: 180,
    },
    {
      title: 'Demurrage Cost (USD)',
      dataIndex: 'demurrageCost',
      key: 'demurrageCost',
      render: (value: number) => (
        <span style={{ color: value > 0 ? '#dc2626' : 'inherit', fontWeight: value > 0 ? 'bold' : 'normal' }}>
          ${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
      width: 150,
    },
    {
      title: 'Saved On',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: LaytimeCalculation) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => {
              if (onOpenCalculation) onOpenCalculation(record);
              navigate(`/calculation/${record.id}`);
            }}
          >
            Open
          </Button>
          <Popconfirm
            title="Delete calculation"
            description="Are you sure you want to delete this calculation?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="w-full">
      <div className="card-panel" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <div className="section-title mb-6">Saved Calculations</div>
        {saved.length === 0 ? (
          <div className="text-zinc-500">No saved calculations.</div>
        ) : (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Table
              dataSource={saved}
              columns={columns}
              rowKey="id"
              scroll={{ x: 'max-content' }}
              pagination={false}
              size="middle"
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
} 