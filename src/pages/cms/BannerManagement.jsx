import { useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Image, Space, message, Popconfirm, Tag, Modal, Divider,
  Typography, Form, Input, Select, InputNumber, Row, Col, Tooltip,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PictureOutlined, LinkOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography

/* ─── Shared helpers ─── */
const DarkHeader = ({ icon, title, extra }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
    padding: '18px 24px',
    borderRadius: '8px 8px 0 0',
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

const ModalFooter = ({ onCancel, submitLabel, loading }) => (
  <div style={{
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    padding: '14px 24px', borderTop: '1px solid #f0f0f0',
    background: '#fafafa', borderRadius: '0 0 8px 8px',
  }}>
    <Button onClick={onCancel}>Hủy</Button>
    <Button type="primary" htmlType="submit" loading={loading}
      style={{ background: '#1F4529', borderColor: '#1F4529' }}>
      {submitLabel}
    </Button>
  </div>
)

/* ─── Banner Form ─── */
const BannerForm = ({ record, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      await onSubmit({ ...values, is_active: values.is_active === 'true' || values.is_active === true })
    } catch (err) {
      console.error(err)
      message.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally { setLoading(false) }
  }

  return (
    <Form form={form} layout="vertical" requiredMark={false}
      initialValues={record ? { ...record, is_active: String(record.is_active) } : { is_active: 'true', sort_order: 1 }}
      onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Nội dung Banner</SectionLabel>
        <Form.Item name="title" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tiêu đề</span>}
          rules={[{ required: true }]} style={{ marginBottom: 14 }}>
          <Input placeholder="Nhập tiêu đề banner..." />
        </Form.Item>
        <Form.Item name="image_url" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>URL Hình ảnh</span>}
          rules={[{ required: true }]} style={{ marginBottom: 14 }}>
          <Input placeholder="https://..." prefix={<PictureOutlined style={{ color: '#ccc' }} />} />
        </Form.Item>
        <Form.Item name="link_url" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Đường dẫn liên kết</span>}
          style={{ marginBottom: 6 }}>
          <Input placeholder="/tours hoặc https://..." prefix={<LinkOutlined style={{ color: '#ccc' }} />} />
        </Form.Item>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Cài đặt hiển thị</SectionLabel>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="sort_order" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Thứ tự</span>}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="is_active" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái</span>}
              rules={[{ required: true }]}>
              <Select options={[
                { value: 'true', label: 'Hiển thị' },
                { value: 'false', label: 'Ẩn' },
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <ModalFooter onCancel={onCancel} submitLabel={record ? 'Lưu thay đổi' : 'Thêm mới'} loading={loading} />
    </Form>
  )
}

/* ─── Main component ─── */
const BannerManagement = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const columns = [
    {
      title: 'Banner',
      dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <Image src={record.image_url} width={64} height={40}
            style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.link_url}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Thứ tự', dataIndex: 'sort_order',
      sorter: (a, b) => a.sort_order - b.sort_order, width: 80, search: false,
    },
    {
      title: 'Trạng thái', dataIndex: 'is_active', width: 120,
      valueEnum: { true: { text: 'Hiển thị', status: 'Success' }, false: { text: 'Ẩn', status: 'Default' } },
      render: (_, record) => (
        <Tag color={record.is_active ? 'green' : 'default'} style={{ fontSize: 12 }}>
          {record.is_active ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác', valueType: 'option', key: 'option', width: 110,
      render: (_, record, __, action) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true) }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true) }} />
          </Tooltip>
          <Popconfirm title="Xóa banner này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try { await adminApi.deleteBanner(record.id); message.success('Đã xóa banner'); action?.reload() }
              catch (err) { console.error(err); message.error('Không thể xóa banner') }
            }}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa banner">
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Banner / Hero</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Cấu hình hình ảnh và liên kết hiển thị trên trang chủ.</Text>
      </div>

      <ProTable columns={columns} scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách Banner</Text>}
        request={async () => {
          try { const res = await adminApi.getAllBanners(); const raw = res.data?.data; return { data: Array.isArray(raw) ? raw : [], success: true } }
          catch (err) { console.error(err); message.error('Không thể tải danh sách banner'); return { data: [], success: false } }
        }}
        rowKey="id" search={false} pagination={false}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true) }}>Thêm banner</Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Add / Edit Modal */}
      <Modal title={null} open={modalVisit}
        onCancel={() => { setModalVisit(false) }}
        centered width={Math.min(560, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader title={currentRecord ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'} />
        <BannerForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) { await adminApi.updateBanner(currentRecord.id, values); message.success('Đã cập nhật banner') }
            else { await adminApi.createBanner(values); message.success('Đã thêm banner mới') }
            setModalVisit(false)
            window.location.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal title={null} open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered width={Math.min(560, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        {currentRecord?.id && (
          <>
            <DarkHeader title="Chi tiết Banner"
              extra={<Tag color={currentRecord.is_active ? 'green' : 'default'} style={{ fontSize: 11 }}>
                {currentRecord.is_active ? 'Hiển thị' : 'Ẩn'}
              </Tag>} />
            <div style={{ padding: '20px 24px' }}>
              {/* Image preview */}
              {currentRecord.image_url && (
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 16, border: '1px solid #eee' }}>
                  <img src={currentRecord.image_url} alt={currentRecord.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              <SectionLabel>Thông tin</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 12 }}>
                {[
                  { label: 'Tiêu đề', value: currentRecord.title },
                  { label: 'Thứ tự', value: `#${currentRecord.sort_order}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {currentRecord.link_url && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>Liên kết</div>
                  <div style={{ fontSize: 13, color: '#1890ff', fontWeight: 500, marginBottom: 12 }}>{currentRecord.link_url}</div>
                </>
              )}
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

export default BannerManagement
