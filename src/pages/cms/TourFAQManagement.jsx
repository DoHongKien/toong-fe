import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Space, message, Modal, Divider,
  Typography, Popconfirm, Form, Input, InputNumber, Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined, PlusOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, QuestionCircleOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography
const { TextArea } = Input

/* ─── Shared helpers ─── */
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

/* ─── FAQ Form ─── */
const TourFAQForm = ({ record, tourId, onCancel, onSubmit }) => {
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
      initialValues={record || { sortOrder: 1 }} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Nội dung câu hỏi</SectionLabel>
        <Form.Item name="question"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Câu hỏi</span>}
          rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
          style={{ marginBottom: 14 }}>
          <TextArea placeholder="Nhập câu hỏi thường gặp..." autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item name="answer"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Câu trả lời</span>}
          rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
          style={{ marginBottom: 6 }}>
          <TextArea placeholder="Nhập nội dung trả lời..." autoSize={{ minRows: 4, maxRows: 8 }} />
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
          {record ? 'Lưu thay đổi' : 'Thêm câu hỏi'}
        </Button>
      </div>
    </Form>
  )
}

/* ─── Main ─── */
const TourFAQManagement = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [tourName, setTourName] = useState(null)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.question}</Text>
          <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{record.answer}</Text>
        </Space>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      sorter: (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      width: 90,
      search: false,
      render: (val) => <Text style={{ fontSize: 13 }}>#{val ?? '—'}</Text>,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 110,
      render: (_, record, __, action) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />}
              onClick={() => { setCurrentRecord(record); setShowDetail(true) }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />}
              onClick={() => { setCurrentRecord(record); setModalVisit(true) }} />
          </Tooltip>
          <Popconfirm title="Xóa câu hỏi này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try { await adminApi.deleteTourFaq(record.id); message.success('Đã xóa câu hỏi'); action?.reload() }
              catch (err) { console.error(err); message.error('Không thể xóa') }
            }}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa câu hỏi">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Tooltip title="Quay lại danh sách Tour">
            <Button
              icon={<ArrowLeftOutlined />}
              size="small"
              onClick={() => navigate('/cms/tours')}
              style={{ flexShrink: 0 }}
            />
          </Tooltip>
          <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
            FAQ theo Tour{tourName ? `: ${tourName}` : ` #${tourId}`}
          </Title>
        </div>
        <Text style={{ color: '#888', fontSize: 13, paddingLeft: 32 }}>
          Quản lý câu hỏi thường gặp hiển thị trong trang chi tiết tour này.
        </Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách câu hỏi</Text>}
        request={async () => {
          try {
            const res = await adminApi.getTourFaqs(tourId)
            const raw = res.data?.data
            if (Array.isArray(raw) && raw[0]?.tourName) setTourName(raw[0].tourName)
            return { data: Array.isArray(raw) ? raw : [], success: true }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách FAQ')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 20 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true) }}>
            Thêm câu hỏi
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#aaa' }}>
              <QuestionCircleOutlined style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                Chưa có câu hỏi nào
              </div>
              <div style={{ fontSize: 12 }}>Nhấn "Thêm câu hỏi" để tạo FAQ đầu tiên cho tour này.</div>
            </div>
          ),
        }}
      />

      {/* Add / Edit Modal */}
      <Modal title={null} open={modalVisit} onCancel={() => setModalVisit(false)}
        centered width={Math.min(600, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader
          title={currentRecord ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi FAQ mới'}
          extra={
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <QuestionCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
          }
        />
        <TourFAQForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          tourId={tourId}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) {
              await adminApi.updateTourFaq(currentRecord.id, values)
              message.success('Đã cập nhật câu hỏi')
            } else {
              await adminApi.createTourFaq({ ...values, tourId: Number(tourId) })
              message.success('Đã thêm câu hỏi mới')
            }
            setModalVisit(false)
            actionRef.current?.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal title={null} open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered width={Math.min(600, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        {currentRecord?.id && (
          <>
            <DarkHeader
              title="Chi tiết câu hỏi"
              extra={<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>#{currentRecord.sortOrder}</span>}
            />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <QuestionCircleOutlined style={{ fontSize: 20, color: '#4caf50', marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4 }}>
                  {currentRecord.question}
                </div>
              </div>
              <Divider style={{ margin: '0 0 14px' }} />
              <SectionLabel>Câu trả lời</SectionLabel>
              <div style={{
                background: '#f7f8fa', borderRadius: 8, padding: '14px 16px',
                fontSize: 13, color: '#555', lineHeight: 1.7, border: '1px solid #eee',
              }}>
                {currentRecord.answer}
              </div>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              padding: '14px 24px', borderTop: '1px solid #f0f0f0',
              background: '#fafafa', borderRadius: '0 0 8px 8px',
            }}>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
              <Button type="primary" icon={<EditOutlined />}
                style={{ background: '#1F4529', borderColor: '#1F4529' }}
                onClick={() => { setShowDetail(false); setModalVisit(true) }}>
                Chỉnh sửa
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default TourFAQManagement
