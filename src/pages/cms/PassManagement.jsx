import { useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, message, Space, Popconfirm, Tag, Typography, Modal, Divider,
  Form, Input, Select, InputNumber, Row, Col, Tooltip,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CrownOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

const themeConfig = {
  'bg-green':  { label: 'Green (Trial)',     gradient: 'linear-gradient(135deg, #389e0d, #52c41a)' },
  'bg-orange': { label: 'Orange (Sharing)',  gradient: 'linear-gradient(135deg, #d46b08, #ffa940)' },
  'bg-dark':   { label: 'Dark (Adventure)', gradient: 'linear-gradient(135deg, #0D2E2A, #1F4529)' },
}

const DarkHeader = ({ title, extra, gradient }) => (
  <div style={{
    background: gradient || 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
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

const PassForm = ({ record, onCancel, onSubmit }) => {
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
      initialValues={record || { subtitle: 'Pass', price: 0, color_theme: 'bg-green' }} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Thông tin gói Pass</SectionLabel>
        <Row gutter={12} style={{ marginBottom: 14 }}>
          <Col span={14}>
            <Form.Item name="title" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên gói</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input placeholder="VD: ADVENTURE" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="subtitle" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Phụ đề</span>}
              style={{ marginBottom: 0 }}>
              <Input placeholder="VD: Pass" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="perks" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Quyền lợi</span>}
          style={{ marginBottom: 6 }}>
          <Input placeholder="Mô tả ngắn về quyền lợi..." />
        </Form.Item>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Giá & Giao diện</SectionLabel>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="price" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Giá bán (VNĐ)</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <InputNumber min={0} step={100000} style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v?.replace(/,/g, '')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="color_theme" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Màu chủ đạo</span>}
              style={{ marginBottom: 0 }}>
              <Select options={[
                { label: 'Green (Trial)',    value: 'bg-green' },
                { label: 'Orange (Sharing)', value: 'bg-orange' },
                { label: 'Dark (Adventure)', value: 'bg-dark' },
              ]} />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 24px', borderTop: '1px solid #f0f0f0',
        background: '#fafafa', borderRadius: '0 0 8px 8px',
      }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}
          style={{ background: '#1F4529', borderColor: '#1F4529' }}>
          {record ? 'Lưu thay đổi' : 'Tạo gói'}
        </Button>
      </div>
    </Form>
  )
}

const PassManagement = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const columns = [
    {
      title: 'Gói Pass', dataIndex: 'title',
      render: (_, record) => {
        const theme = themeConfig[record.color_theme] || {}
        return (
          <Space>
            <div style={{
              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
              background: theme.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CrownOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 13 }}>{record.title} <Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>{record.subtitle}</Text></Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.perks}</Text>
            </Space>
          </Space>
        )
      },
    },
    {
      title: 'Giá niêm yết', dataIndex: 'price', sorter: (a, b) => a.price - b.price, width: 160,
      render: (price) => (price ?? 0) === 0
        ? <Tag color="green" style={{ fontSize: 12 }}>Miễn phí</Tag>
        : <Text strong style={{ color: '#1F4529', fontSize: 13 }}>{(price ?? 0).toLocaleString('vi-VN')}đ</Text>,
    },
    {
      title: 'Theme', dataIndex: 'color_theme', width: 160, search: false,
      render: (_, record) => {
        const theme = themeConfig[record.color_theme] || {}
        return (
          <Space>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: theme.gradient }} />
            <Text style={{ fontSize: 12 }}>{theme.label}</Text>
          </Space>
        )
      },
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
          <Popconfirm title="Xóa gói Pass này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try { await adminApi.deletePass(record.id); message.success('Đã xóa gói Pass'); action?.reload() }
              catch (err) { console.error(err); message.error('Không thể xóa') }
            }}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa gói Pass">
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Adventure Pass</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Cấu hình các gói hội viên, giá cả và quyền lợi đi kèm.</Text>
      </div>

      <ProTable columns={columns} scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách gói Pass</Text>}
        request={async (params) => {
          try { const res = await adminApi.getAllPasses(params); const raw = res.data?.data; return { data: Array.isArray(raw) ? raw : [], success: true } }
          catch (err) { console.error(err); message.error('Không thể tải danh sách Pass'); return { data: [], success: false } }
        }}
        rowKey="id" search={false} pagination={false}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true) }}>Thêm gói mới</Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Add / Edit Modal */}
      <Modal title={null} open={modalVisit} onCancel={() => setModalVisit(false)}
        centered width={Math.min(600, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader title={currentRecord ? 'Cập nhật gói Pass' : 'Tạo gói Pass mới'} />
        <PassForm key={currentRecord?.id ?? 'new'} record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) { await adminApi.updatePass(currentRecord.id, values); message.success('Đã cập nhật gói Pass') }
            else { await adminApi.createPass(values); message.success('Đã tạo gói Pass mới') }
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
        {currentRecord?.id && (() => {
          const theme = themeConfig[currentRecord.color_theme]
          return (
            <>
              <DarkHeader
                title="Chi tiết gói Pass"
                gradient={theme?.gradient}
                extra={
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CrownOutlined style={{ color: '#fff', fontSize: 20 }} />
                  </div>
                }
              />
              <div style={{ padding: '24px 28px' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                    {currentRecord.title} <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>{currentRecord.subtitle}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1F4529', marginTop: 4 }}>
                    {(currentRecord.price ?? 0) === 0 ? <Tag color="green">Miễn phí</Tag> : `${(currentRecord.price ?? 0).toLocaleString('vi-VN')}đ`}
                  </div>
                </div>

                <Divider style={{ margin: '0 0 14px' }} />
                <SectionLabel>Chi tiết</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                  {[
                    { label: 'Theme', value: theme?.label || currentRecord.color_theme },
                    { label: 'ID gói', value: `#${currentRecord.id}` },
                    { label: 'Quyền lợi', value: currentRecord.perks || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} style={label === 'Quyền lợi' ? { gridColumn: '1 / -1' } : {}}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
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
          )
        })()}
      </Modal>
    </>
  )
}

export default PassManagement
