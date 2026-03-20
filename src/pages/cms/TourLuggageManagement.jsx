import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Space, message, Modal, Divider,
  Typography, Popconfirm, Form, Input, InputNumber, Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined,
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

/* ─── Form ─── */
const LuggageForm = ({ record, onCancel, onSubmit }) => {
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
      initialValues={record ?? { sortOrder: 1 }} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Trang bị</SectionLabel>
        <Form.Item name="name"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên (viết tắt)</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          style={{ marginBottom: 14 }}>
          <Input placeholder="VD: GIÀY, BA LÔ, ÁO MƯA..." style={{ textTransform: 'uppercase' }} />
        </Form.Item>

        <Form.Item name="detail"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Mô tả chi tiết</span>}
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          style={{ marginBottom: 14 }}>
          <TextArea placeholder="Mô tả yêu cầu cụ thể về trang bị này..." autoSize={{ minRows: 3, maxRows: 6 }} />
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
          {record ? 'Lưu thay đổi' : 'Thêm hành lý'}
        </Button>
      </div>
    </Form>
  )
}

/* ─── Main ─── */
const TourLuggageManagement = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [tourName, setTourName] = useState(null)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Tên trang bị',
      dataIndex: 'name',
      width: 140,
      render: (val) => (
        <span style={{
          fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
          color: '#1F4529', letterSpacing: '0.5px',
        }}>{val}</span>
      ),
    },
    {
      title: 'Mô tả chi tiết',
      dataIndex: 'detail',
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
              try { await adminApi.deleteTourLuggage(record.id); message.success('Đã xóa'); action?.reload() }
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
            Hành lý & Trang bị cần mang{tourName ? `: ${tourName}` : ` #${tourId}`}
          </Title>
        </div>
        <Text style={{ color: '#888', fontSize: 13, paddingLeft: 32 }}>
          Quản lý danh sách trang bị, hành lý cần chuẩn bị cho tour này.
        </Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách trang bị</Text>}
        request={async () => {
          try {
            const res = await adminApi.getTourLuggages(tourId)
            const raw = res.data?.data
            if (Array.isArray(raw) && raw[0]?.tourName) setTourName(raw[0].tourName)
            return { data: Array.isArray(raw) ? raw : [], success: true }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách hành lý')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalOpen(true) }}>
            Thêm hành lý
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#aaa' }}>
              <TagsOutlined style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 4 }}>Chưa có trang bị nào</div>
              <div style={{ fontSize: 12 }}>Nhấn "Thêm hành lý" để bắt đầu.</div>
            </div>
          ),
        }}
      />

      <Modal title={null} open={modalOpen} onCancel={() => setModalOpen(false)}
        centered width={Math.min(560, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader
          title={currentRecord ? 'Chỉnh sửa trang bị' : 'Thêm hành lý / trang bị'}
          extra={
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TagsOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
          }
        />
        <LuggageForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (values) => {
            if (currentRecord) {
              await adminApi.updateTourLuggage(currentRecord.id, values)
              message.success('Đã cập nhật')
            } else {
              await adminApi.createTourLuggage({ ...values, tourId: Number(tourId) })
              message.success('Đã thêm hành lý mới')
            }
            setModalOpen(false)
            actionRef.current?.reload()
          }}
        />
      </Modal>
    </>
  )
}

export default TourLuggageManagement
