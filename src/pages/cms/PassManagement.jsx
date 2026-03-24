import { useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, message, Space, Popconfirm, Tag, Typography, Modal, Divider,
  Form, Input, InputNumber, Switch, Row, Col, Tooltip, DatePicker,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CrownOutlined, CheckOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'
import dayjs from 'dayjs'

const { Title, Text } = Typography

// ─── Viện render colorTheme hex → gradient mỡ ─────────────────────────────────
const hexToGradient = (hex) => {
  if (!hex) return 'linear-gradient(135deg, #1F4529, #47663B)'
  return `linear-gradient(135deg, ${hex}dd, ${hex}99)`
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

// ─── Form tạo / sửa gói Pass ──────────────────────────────────────────────────
const PassForm = ({ record, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const initialValues = record
    ? {
        ...record,
        validityDate: record.validityDate ? dayjs(record.validityDate) : null,
      }
    : { subtitle: 'Pass', price: 0, isSignature: false, colorTheme: '#1F4529' }

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        validityDate: values.validityDate ? values.validityDate.format('YYYY-MM-DD') : null,
      }
      await onSubmit(payload)
    } catch (err) {
      console.error(err)
      message.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" requiredMark={false}
      initialValues={initialValues} onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Thông tin gói Pass</SectionLabel>
        <Row gutter={12} style={{ marginBottom: 14 }}>
          <Col span={14}>
            <Form.Item name="title"
              label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên gói</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <Input placeholder="VD: ADVENTURE" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="subtitle"
              label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Phụ đề</span>}
              style={{ marginBottom: 0 }}>
              <Input placeholder="VD: Pass" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Giá &amp; Giao diện</SectionLabel>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name="price"
              label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Giá bán (VNĐ)</span>}
              rules={[{ required: true }]} style={{ marginBottom: 0 }}>
              <InputNumber min={0} step={100000} style={{ width: '100%' }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v?.replace(/,/g, '')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="colorTheme"
              label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Màu chủ đạo (hex)</span>}
              style={{ marginBottom: 0 }}>
              <Input placeholder="#1F4529" prefix={
                <Form.Item name="colorTheme" noStyle>
                  {(vals) => (
                    <div style={{
                      width: 16, height: 16, borderRadius: 3,
                      background: form.getFieldValue('colorTheme') || '#ccc',
                      border: '1px solid #eee',
                    }} />
                  )}
                </Form.Item>
              } />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Form.Item name="validityDate"
              label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Ngày hết hạn</span>}
              style={{ marginBottom: 0 }}>
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="isSignature" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Gói Signature</span>}
              valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="Signature" unCheckedChildren="Thường" />
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
  const tableRef = useRef()
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const columns = [
    {
      title: 'Gói Pass', dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <div style={{
            width: 40, height: 40, borderRadius: 8, flexShrink: 0,
            background: hexToGradient(record.colorTheme),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CrownOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <Space direction="vertical" size={0}>
            <Space size={6}>
              <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
              <Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>{record.subtitle}</Text>
              {record.isSignature && <Tag color="gold" style={{ fontSize: 10, padding: '0 5px' }}>Signature</Tag>}
            </Space>
            <Space size={4} wrap>
              {(record.features || []).slice(0, 2).map((f, i) => (
                <Text key={i} type="secondary" style={{ fontSize: 11 }}>
                  {f.isBold ? <strong>{f.content}</strong> : f.content}
                  {i < Math.min((record.features?.length ?? 0), 2) - 1 ? ' · ' : ''}
                </Text>
              ))}
              {(record.features?.length ?? 0) > 2 && (
                <Text type="secondary" style={{ fontSize: 11 }}>+{record.features.length - 2} khác</Text>
              )}
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Giá niêm yết', dataIndex: 'price', sorter: true, width: 160,
      render: (price) => (price ?? 0) === 0
        ? <Tag color="green" style={{ fontSize: 12 }}>Miễn phí</Tag>
        : <Text strong style={{ color: '#1F4529', fontSize: 13 }}>{(price ?? 0).toLocaleString('vi-VN')}đ</Text>,
    },
    {
      title: 'Hết hạn', dataIndex: 'validityDate', width: 130,
      render: (date) => date
        ? <Text style={{ fontSize: 12 }}>{new Date(date).toLocaleDateString('vi-VN')}</Text>
        : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
    },
    {
      title: 'Màu', dataIndex: 'colorTheme', width: 80, search: false,
      render: (color) => color ? (
        <Tooltip title={color}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: hexToGradient(color),
            border: '1px solid rgba(0,0,0,0.08)',
          }} />
        </Tooltip>
      ) : <Text type="secondary">—</Text>,
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

      <ProTable
        actionRef={tableRef}
        columns={columns}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách gói Pass</Text>}
        request={async (params) => {
          try {
            const res = await adminApi.getAllPasses({ page: params.current, limit: params.pageSize })
            const inner = res.data?.data
            const data  = Array.isArray(inner?.data) ? inner.data : Array.isArray(inner) ? inner : []
            const total = inner?.pagination?.total ?? data.length
            return { data, success: true, total }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách Pass')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={false}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
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
        <DarkHeader title={currentRecord ? 'Cập nhật gói Pass' : 'Tạo gói Pass mới'}
          gradient={hexToGradient(currentRecord?.colorTheme)} />
        <PassForm key={currentRecord?.id ?? 'new'} record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) { await adminApi.updatePass(currentRecord.id, values); message.success('Đã cập nhật gói Pass') }
            else { await adminApi.createPass(values); message.success('Đã tạo gói Pass mới') }
            setModalVisit(false)
            tableRef.current?.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal title={null} open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered width={Math.min(560, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        {currentRecord?.id && (() => {
          const gradient = hexToGradient(currentRecord.colorTheme)
          return (
            <>
              <DarkHeader
                title="Chi tiết gói Pass"
                gradient={gradient}
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
                  <Space align="center">
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                      {currentRecord.title}
                    </div>
                    <Text type="secondary" style={{ fontSize: 16 }}>{currentRecord.subtitle}</Text>
                    {currentRecord.isSignature && <Tag color="gold">Signature</Tag>}
                  </Space>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1F4529', marginTop: 4 }}>
                    {(currentRecord.price ?? 0) === 0
                      ? <Tag color="green">Miễn phí</Tag>
                      : `${(currentRecord.price ?? 0).toLocaleString('vi-VN')}đ`}
                  </div>
                  {currentRecord.validityDate && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Hết hạn: {new Date(currentRecord.validityDate).toLocaleDateString('vi-VN')}
                    </Text>
                  )}
                </div>

                <Divider style={{ margin: '0 0 14px' }} />

                {/* Features list */}
                {(currentRecord.features?.length ?? 0) > 0 && (
                  <>
                    <SectionLabel>Quyền lợi</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                      {currentRecord.features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <CheckOutlined style={{ color: '#4caf50', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                          <Text style={{
                            fontSize: 13,
                            fontWeight: f.isBold ? 700 : 400,
                            color: f.isBold ? '#1a1a1a' : '#555',
                          }}>{f.content}</Text>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <SectionLabel>Thông tin kỹ thuật</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                  {[
                    { label: 'Màu chủ đạo', value: currentRecord.colorTheme || '—' },
                    { label: 'ID gói', value: `#${currentRecord.id}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
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
