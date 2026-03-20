import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Space, message, Modal, Divider,
  Typography, Popconfirm, Form, Input, InputNumber, Tooltip, Select, Tag,
} from 'antd'
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, DollarOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography
const { TextArea } = Input

const DarkHeader = ({ title, extra }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
    padding: '18px 24px', borderRadius: '8px 8px 0 0',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <div style={{ width: 4, height: 20, background: '#8bc34a', borderRadius: 4 }} />
    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, flex: 1 }}>{title}</span>
    {extra}
  </div>
)

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '0.6px',
    textTransform: 'uppercase', color: '#1a3d2e',
    borderLeft: '3px solid #4caf50', paddingLeft: 8,
    marginBottom: 12, marginTop: 4,
  }}>{children}</div>
)

const IncludedTag = ({ value }) => value
  ? <Tag icon={<CheckCircleOutlined />} color="success">Đã bao gồm</Tag>
  : <Tag icon={<CloseCircleOutlined />} color="error">Không bao gồm</Tag>

/* ─── Form ─── */
const CostDetailForm = ({ record, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleFinish = async (values) => {
    setLoading(true)
    try { await onSubmit(values) }
    catch (err) { console.error(err); message.error('Có lỗi xảy ra') }
    finally { setLoading(false) }
  }

  return (
    <Form form={form} layout="vertical" requiredMark={false}
      initialValues={record ?? { isIncluded: true, sortOrder: 1 }} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Loại chi phí</SectionLabel>
        <Form.Item name="isIncluded"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái</span>}
          rules={[{ required: true }]} style={{ marginBottom: 14 }}>
          <Select options={[
            { value: true,  label: 'Đã bao gồm trong giá tour' },
            { value: false, label: 'Không bao gồm (khách tự túc)' },
          ]} />
        </Form.Item>

        <SectionLabel>Nội dung</SectionLabel>
        <Form.Item name="content"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Mô tả chi phí</span>}
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          style={{ marginBottom: 14 }}>
          <TextArea placeholder="VD: Xe khứ hồi, Bữa sáng ngày 1..." autoSize={{ minRows: 2, maxRows: 5 }} />
        </Form.Item>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Cài đặt</SectionLabel>
        <Form.Item name="sortOrder"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Thứ tự hiển thị</span>}
          style={{ marginBottom: 0 }}>
          <InputNumber min={1} style={{ width: 120 }} />
        </Form.Item>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 24px', borderTop: '1px solid #f0f0f0',
        background: '#fafafa', borderRadius: '0 0 8px 8px',
      }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}
          style={{ background: '#1F4529', borderColor: '#1F4529' }}>
          {record ? 'Lưu thay đổi' : 'Thêm mục'}
        </Button>
      </div>
    </Form>
  )
}

/* ─── Main ─── */
const TourCostDetailManagement = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [tourName, setTourName] = useState(null)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'isIncluded',
      width: 160,
      search: false,
      render: (val) => <IncludedTag value={val} />,
    },
    {
      title: 'Nội dung chi phí',
      dataIndex: 'content',
      ellipsis: true,
      render: (val) => <Text style={{ fontSize: 13 }}>{val}</Text>,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      width: 80,
      search: false,
      sorter: (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      render: (val) => <Text style={{ fontSize: 13 }}>#{val ?? '—'}</Text>,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 90,
      render: (_, record, __, action) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />}
              onClick={() => { setCurrentRecord(record); setModalOpen(true) }} />
          </Tooltip>
          <Popconfirm title="Xóa mục này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try { await adminApi.deleteTourCostDetail(record.id); message.success('Đã xóa'); action?.reload() }
              catch (err) { console.error(err); message.error('Không thể xóa') }
            }}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Tooltip title="Quay lại danh sách Tour">
            <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/cms/tours')} />
          </Tooltip>
          <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
            Chi phí bao gồm / không bao gồm{tourName ? `: ${tourName}` : ` #${tourId}`}
          </Title>
        </div>
        <Text style={{ color: '#888', fontSize: 13, paddingLeft: 32 }}>
          Quản lý danh sách chi phí đã bao gồm và không bao gồm trong giá tour.
        </Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách chi phí</Text>}
        request={async () => {
          try {
            const res = await adminApi.getTourCostDetails(tourId)
            const raw = res.data?.data
            if (Array.isArray(raw) && raw[0]?.tourName) setTourName(raw[0].tourName)
            return { data: Array.isArray(raw) ? raw : [], success: true }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách chi phí')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalOpen(true) }}>
            Thêm mục chi phí
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#aaa' }}>
              <DollarOutlined style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 4 }}>Chưa có mục chi phí nào</div>
              <div style={{ fontSize: 12 }}>Nhấn "Thêm mục chi phí" để thêm.</div>
            </div>
          ),
        }}
      />

      <Modal title={null} open={modalOpen} onCancel={() => setModalOpen(false)}
        centered width={Math.min(560, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader
          title={currentRecord ? 'Chỉnh sửa chi phí' : 'Thêm mục chi phí'}
          extra={
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DollarOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
          }
        />
        <CostDetailForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (values) => {
            if (currentRecord) {
              await adminApi.updateTourCostDetail(currentRecord.id, values)
              message.success('Đã cập nhật')
            } else {
              await adminApi.createTourCostDetail({ ...values, tourId: Number(tourId) })
              message.success('Đã thêm mục mới')
            }
            setModalOpen(false)
            actionRef.current?.reload()
          }}
        />
      </Modal>
    </>
  )
}

export default TourCostDetailManagement
