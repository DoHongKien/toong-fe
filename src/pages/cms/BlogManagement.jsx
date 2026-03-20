import { useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Space, Tag, message, Popconfirm, Modal, Divider,
  Typography, Form, Input, Select, Row, Col, Tooltip,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'
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

const BlogForm = ({ record, onCancel, onSubmit }) => {
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
      initialValues={record || { status: 'draft' }} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px', maxHeight: 520, overflowY: 'auto' }}>
        <SectionLabel>Thông tin bài viết</SectionLabel>
        <Form.Item name="title" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tiêu đề</span>}
          rules={[{ required: true }]} style={{ marginBottom: 14 }}>
          <Input placeholder="Nhập tiêu đề bài viết..." />
        </Form.Item>
        <Row gutter={12} style={{ marginBottom: 14 }}>
          <Col span={16}>
            <Form.Item name="slug" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>URL Slug</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input placeholder="kinh-nghiem-trekking-ta-nang" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Select options={[{ value: 'published', label: 'Đã đăng' }, { value: 'draft', label: 'Bản nháp' }]} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="thumbnail" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Ảnh thumbnail</span>}
          style={{ marginBottom: 6 }}>
          <Input placeholder="https://..." />
        </Form.Item>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Nội dung</SectionLabel>
        <Form.Item name="content" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Nội dung (HTML)</span>}
          rules={[{ required: true }]} style={{ marginBottom: 0 }}>
          <TextArea placeholder="<p>Nội dung...</p>" autoSize={{ minRows: 6, maxRows: 12 }}
            style={{ fontFamily: 'monospace', fontSize: 12 }} />
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
          {record ? 'Lưu thay đổi' : 'Tạo bài viết'}
        </Button>
      </div>
    </Form>
  )
}

const BlogManagement = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const columns = [
    {
      title: 'Bài viết', dataIndex: 'title', ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Tác giả: {record.author}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 120,
      valueEnum: { published: { text: 'Đã đăng', status: 'Success' }, draft: { text: 'Bản nháp', status: 'Default' } },
      render: (_, record) => (
        <Tag color={record.status === 'published' ? 'green' : 'default'} style={{ fontSize: 12 }}>
          {record.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Ngày đăng', dataIndex: 'publishedAt', valueType: 'date', search: false, width: 120,
      render: (_, record) => record.publishedAt
        ? new Date(record.publishedAt).toLocaleDateString('vi-VN')
        : <Text type="secondary">—</Text>,
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
          <Popconfirm title="Xóa bài viết này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try { await adminApi.deleteBlogPost(record.id); message.success('Đã xóa bài viết'); action?.reload() }
              catch (err) { console.error(err); message.error('Không thể xóa') }
            }}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa bài viết">
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Blog / Tin tức</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Viết và quản lý các bài viết kinh nghiệm, tin tức cho trang web.</Text>
      </div>

      <ProTable columns={columns} scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách bài viết</Text>}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getAllBlogPosts({ page: current, limit: pageSize, ...rest })
            const raw = res.data?.data?.data
            return { data: Array.isArray(raw) ? raw : [], success: true, total: res.data?.data?.pagination?.total ?? 0 }
          } catch (err) { console.error(err); message.error('Không thể tải danh sách bài viết'); return { data: [], success: false } }
        }}
        rowKey="id" search={{ labelWidth: 'auto' }} pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true) }}>Viết bài mới</Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Add / Edit Modal */}
      <Modal title={null} open={modalVisit} onCancel={() => setModalVisit(false)}
        centered width={Math.min(720, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader title={currentRecord ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          extra={currentRecord && (
            <Tag color={currentRecord.status === 'published' ? 'green' : 'default'} style={{ fontSize: 11 }}>
              {currentRecord.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
            </Tag>
          )} />
        <BlogForm key={currentRecord?.id ?? 'new'} record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) { await adminApi.updateBlogPost(currentRecord.id, values); message.success('Đã cập nhật bài viết') }
            else { await adminApi.createBlogPost(values); message.success('Đã tạo bài viết mới') }
            setModalVisit(false)
            window.location.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal title={null} open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered width={Math.min(680, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        {currentRecord?.id && (
          <>
            <DarkHeader title="Chi tiết bài viết"
              extra={<Tag color={currentRecord.status === 'published' ? 'green' : 'default'} style={{ fontSize: 11 }}>
                {currentRecord.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
              </Tag>} />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <FileTextOutlined style={{ fontSize: 22, color: '#4caf50', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>{currentRecord.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontFamily: 'monospace' }}>{currentRecord.slug}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {[
                  { label: 'Tác giả', value: currentRecord.author || '—' },
                  { label: 'Ngày đăng', value: currentRecord.publishedAt ? new Date(currentRecord.publishedAt).toLocaleDateString('vi-VN') : '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {currentRecord.thumbnail && (
                <>
                  <Divider style={{ margin: '0 0 14px' }} />
                  <SectionLabel>Thumbnail</SectionLabel>
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={currentRecord.thumbnail} alt={currentRecord.title}
                      style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                  </div>
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

export default BlogManagement
