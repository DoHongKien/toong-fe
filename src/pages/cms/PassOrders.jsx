import { useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Badge, Space, message, Typography, Button, Modal,
  Tag, Descriptions, Divider, Popconfirm, Form, Select, Tooltip,
} from 'antd'
import {
  EyeOutlined, CheckCircleOutlined, DeleteOutlined, CrownOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography

const statusConfig = {
  pending:   { badgeStatus: 'default', label: 'Chờ thanh toán' },
  paid:      { badgeStatus: 'success', label: 'Đã kích hoạt'   },
  cancelled: { badgeStatus: 'error',   label: 'Đã hủy'         },
}

const passColor = {
  TRIAL:     '#389e0d',
  SHARING:   '#d46b08',
  ADVENTURE: '#0D2E2A',
}

/* ─── Shared helpers ─── */
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

/* ─── Activate Form ─── */
const ActivateForm = ({ record, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleFinish = async (values) => {
    setLoading(true)
    try { await onSubmit(values) }
    catch (err) { console.error(err); message.error('Có lỗi xảy ra') }
    finally { setLoading(false) }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ status: record?.status }}
      onFinish={handleFinish}
    >
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Cập nhật trạng thái</SectionLabel>
        <Form.Item
          name="status"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái mới</span>}
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          style={{ marginBottom: 14 }}
        >
          <Select
            options={[
              { label: 'Đã nhận tiền & Kích hoạt thẻ', value: 'paid'      },
              { label: 'Hủy đơn hàng',                  value: 'cancelled' },
            ]}
          />
        </Form.Item>
        <div style={{
          padding: '10px 14px', background: '#fffbe6',
          border: '1px solid #ffe58f', borderRadius: 6,
          fontSize: 13, color: '#875800',
        }}>
          Sau khi kích hoạt, khách hàng sẽ nhận được quyền lợi thành viên ngay lập tức.
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 24px', borderTop: '1px solid #f0f0f0',
        background: '#fafafa', borderRadius: '0 0 8px 8px',
      }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}
          style={{ background: '#1F4529', borderColor: '#1F4529' }}>
          Xác nhận kích hoạt
        </Button>
      </div>
    </Form>
  )
}

/* ─── Main ─── */
const PassOrders = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      copyable: true,
      width: 120,
      render: (code) => <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>{code}</Text>,
    },
    {
      title: 'Hội viên',
      dataIndex: 'customer',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{`${record.last_name} ${record.first_name}`}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>ID: #{record.id}</Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'Gói Pass',
      dataIndex: 'pass_title',
      width: 140,
      render: (_, record) => (
        <Space>
          <CrownOutlined style={{ color: passColor[record.pass_title] || '#1F4529' }} />
          <Tag color={passColor[record.pass_title] || 'default'} style={{ fontSize: 12 }}>
            {record.pass_title}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      width: 140,
      search: false,
      render: (amount) => (
        (amount ?? 0) === 0
          ? <Tag color="green" style={{ fontSize: 12 }}>Miễn phí</Tag>
          : <Text strong style={{ color: '#1F4529', fontSize: 13 }}>{(amount ?? 0).toLocaleString('vi-VN')}đ</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        pending:   { text: 'Chờ thanh toán', status: 'Default'  },
        paid:      { text: 'Đã kích hoạt',   status: 'Success'  },
        cancelled: { text: 'Đã hủy',          status: 'Error'    },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || {}
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />
      },
    },
    {
      title: 'Ngày mua',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
      width: 150,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => { setCurrentRecord(record); setShowDetail(true) }}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Kích hoạt thẻ">
              <Button
                size="small"
                style={{ color: '#1F4529', borderColor: '#1F4529' }}
                icon={<CheckCircleOutlined />}
                onClick={() => { setCurrentRecord(record); setModalVisit(true) }}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Xóa đơn hàng này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try {
                message.success('Đã xóa đơn hàng')
                actionRef.current?.reload()
              } catch (err) {
                console.error(err)
                message.error('Không thể xóa đơn hàng')
              }
            }}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa đơn hàng">
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Đơn hàng Adventure Pass</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Theo dõi và kích hoạt thẻ hội viên cho khách hàng.</Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách đơn mua Pass</Text>}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getPassOrders({ page: current, limit: pageSize, ...rest })
            const raw = res.data?.data?.data ?? res.data?.data
            const total = res.data?.data?.pagination?.total ?? (Array.isArray(raw) ? raw.length : 0)
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total,
            }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách đơn mua Pass')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Activate Modal */}
      <Modal
        title={null}
        open={modalVisit}
        onCancel={() => setModalVisit(false)}
        centered
        width={Math.min(520, window.innerWidth * 0.96)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        <DarkHeader
          title={`Kích hoạt Pass: ${currentRecord?.order_code ?? ''}`}
          gradient={`linear-gradient(135deg, ${passColor[currentRecord?.pass_title] || '#0D2E2A'} 0%, rgba(0,0,0,0.55) 100%)`}
          extra={
            <Tag style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', fontSize: 12,
            }}>
              <CrownOutlined style={{ marginRight: 4 }} />
              {currentRecord?.pass_title}
            </Tag>
          }
        />
        <ActivateForm
          key={currentRecord?.id ?? 'activate'}
          record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            await adminApi.updatePassOrderStatus(currentRecord.id, values.status)
            message.success('Đã cập nhật trạng thái đơn hàng thành công!')
            setModalVisit(false)
            actionRef.current?.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={null}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered
        width={Math.min(580, window.innerWidth * 0.95)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {currentRecord?.id && (
          <>
            <DarkHeader
              title="Chi tiết đơn Pass"
              gradient={`linear-gradient(135deg, ${passColor[currentRecord.pass_title] || '#0D2E2A'} 0%, rgba(0,0,0,0.45) 100%)`}
              extra={
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Số tiền</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                    {(currentRecord.amount ?? 0) === 0 ? 'Miễn phí' : `${(currentRecord.amount ?? 0).toLocaleString('vi-VN')}đ`}
                  </div>
                </div>
              }
            />

            <div style={{ padding: '24px 28px' }}>
              {/* Pass + status strip */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f7f8fa', borderRadius: 8, padding: '12px 16px',
                border: '1px solid #eee', marginBottom: 16,
              }}>
                <Space>
                  <CrownOutlined style={{ color: passColor[currentRecord.pass_title] || '#1F4529', fontSize: 18 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>GÓI PASS</div>
                    <Tag color={passColor[currentRecord.pass_title]} style={{ fontWeight: 600 }}>
                      {currentRecord.pass_title}
                    </Tag>
                  </div>
                </Space>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 2 }}>TRẠNG THÁI</div>
                  <Badge
                    status={statusConfig[currentRecord.status]?.badgeStatus}
                    text={<Text style={{ fontWeight: 600 }}>{statusConfig[currentRecord.status]?.label}</Text>}
                  />
                </div>
              </div>

              <SectionLabel>Thông tin hội viên</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {[
                  { label: 'Hội viên',    value: `${currentRecord.last_name} ${currentRecord.first_name}` },
                  { label: 'Member ID',   value: `#${currentRecord.id}` },
                  { label: 'Mã đơn hàng', value: currentRecord.order_code },
                  { label: 'Ngày mua',    value: new Date(currentRecord.created_at).toLocaleString('vi-VN') },
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
              {currentRecord.status === 'pending' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  style={{ background: '#1F4529', borderColor: '#1F4529' }}
                  onClick={() => { setShowDetail(false); setModalVisit(true) }}
                >
                  Kích hoạt thẻ ngay
                </Button>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default PassOrders
