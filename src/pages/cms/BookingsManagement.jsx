import { useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Tag, Space, message, Typography, Popconfirm, Badge,
  Modal, Divider, Form, Input, Select, InputNumber, Tooltip,
} from 'antd'
import { EyeOutlined, EditOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography

const paymentLabel = {
  BANK_TRANSFER: 'Chuyển khoản',
  CASH:          'Tiền mặt',
  MOMO:          'Momo',
  VNPAY:         'VNPay',
  bank_transfer: 'Chuyển khoản',
  cash:          'Tiền mặt',
  momo:          'Momo',
}

const statusConfig = {
  PENDING:   { badgeStatus: 'default',    label: 'Chờ xác nhận', tagColor: 'default'   },
  CONFIRMED: { badgeStatus: 'processing', label: 'Đã xác nhận',  tagColor: 'blue'      },
  DEPOSITED: { badgeStatus: 'processing', label: 'Đã cọc',       tagColor: 'cyan'      },
  PAID:      { badgeStatus: 'success',    label: 'Đã tất toán',  tagColor: 'green'     },
  CANCELLED: { badgeStatus: 'error',      label: 'Đã hủy',       tagColor: 'red'       },
  pending:   { badgeStatus: 'default',    label: 'Chờ xác nhận', tagColor: 'default'   },
  confirmed: { badgeStatus: 'processing', label: 'Đã xác nhận',  tagColor: 'blue'      },
  deposited: { badgeStatus: 'processing', label: 'Đã cọc',       tagColor: 'cyan'      },
  paid:      { badgeStatus: 'success',    label: 'Đã tất toán',  tagColor: 'green'     },
  cancelled: { badgeStatus: 'error',      label: 'Đã hủy',       tagColor: 'red'       },
}

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

/* ─── Edit Form ─── */
const BookingForm = ({ record, onCancel, onSubmit }) => {
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
      initialValues={record ? { status: record.status, depositAmount: record.depositAmount, internalNote: record.internalNote } : {}}
      onFinish={handleFinish}
    >
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Trạng thái đơn hàng</SectionLabel>
        <Form.Item
          name="status"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái</span>}
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          style={{ marginBottom: 14 }}
        >
          <Select
            options={[
              { label: 'Chờ xác nhận', value: 'PENDING'   },
              { label: 'Đã xác nhận',  value: 'CONFIRMED' },
              { label: 'Đã cọc',       value: 'DEPOSITED' },
              { label: 'Đã tất toán',  value: 'PAID'      },
              { label: 'Đã hủy',       value: 'CANCELLED' },
            ]}
          />
        </Form.Item>

        <Divider style={{ margin: '14px 0 10px' }} />
        <SectionLabel>Thanh toán &amp; Ghi chú</SectionLabel>

        <Form.Item
          name="depositAmount"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Số tiền đã cọc (VNĐ)</span>}
          style={{ marginBottom: 14 }}
        >
          <InputNumber
            min={0} style={{ width: '100%' }}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(val) => val.replace(/,/g, '')}
          />
        </Form.Item>
        <Form.Item
          name="internalNote"
          label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Ghi chú nội bộ</span>}
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea placeholder="Nhập ghi chú cho nhân viên..." autoSize={{ minRows: 2, maxRows: 4 }} />
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
          Lưu thay đổi
        </Button>
      </div>
    </Form>
  )
}

/* ─── Main ─── */
const BookingsManagement = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'bookingCode',
      copyable: true,
      width: 130,
      render: (code) => <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>{code}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{`${record.lastName} ${record.firstName}`}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.phone}</Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'Tour',
      dataIndex: 'tourName',
      ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}>{record.tourName}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            KH: {record.startDate ? new Date(record.startDate).toLocaleDateString('vi-VN') : '—'}
          </Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'Số người',
      dataIndex: 'quantity',
      width: 80,
      search: false,
      render: (qty) => <Text style={{ fontSize: 13 }}>{qty} người</Text>,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}>
            Tổng: <Text strong style={{ color: '#1F4529' }}>{(record.totalAmount ?? 0).toLocaleString('vi-VN')}đ</Text>
          </Text>
          <Text style={{ fontSize: 11 }}>
            Cọc: <Text style={{ color: '#52c41a' }}>{(record.depositAmount ?? 0).toLocaleString('vi-VN')}đ</Text>
          </Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'PT Thanh toán',
      dataIndex: 'paymentMethod',
      width: 120,
      render: (_, record) => (
        <Tag style={{ fontSize: 11 }}>{paymentLabel[record.paymentMethod] || record.paymentMethod}</Tag>
      ),
      search: false,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        PENDING:   { text: 'Chờ xác nhận', status: 'Default'    },
        CONFIRMED: { text: 'Đã xác nhận',  status: 'Processing' },
        DEPOSITED: { text: 'Đã cọc',       status: 'Processing' },
        PAID:      { text: 'Đã tất toán',  status: 'Success'    },
        CANCELLED: { text: 'Đã hủy',       status: 'Error'      },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || { badgeStatus: 'default', label: record.status }
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      search: false,
      width: 150,
      render: (_, record) => record.createdAt
        ? new Date(record.createdAt).toLocaleString('vi-VN')
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 120,
      render: (_, record, __, action) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => { setCurrentRecord(record); setShowDetail(true) }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => { setCurrentRecord(record); setModalVisit(true) }}
            />
          </Tooltip>
          {(record.status === 'PENDING' || record.status === 'pending') && (
            <Popconfirm
              title="Xác nhận đơn hàng?"
              description="Khách hàng đã chuyển cọc?"
              onConfirm={async () => {
                try {
                  await adminApi.updateBookingStatus(record.id, 'CONFIRMED')
                  message.success('Đã xác nhận đơn hàng')
                  action?.reload()
                } catch (err) {
                  console.error(err)
                  message.error('Không thể xác nhận')
                }
              }}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Tooltip title="Xác nhận đơn">
                <Button size="small" style={{ color: '#1F4529', borderColor: '#1F4529' }} icon={<CheckCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Booking</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Theo dõi trạng thái đặt chỗ, thông tin khách hàng và xác nhận thanh toán.</Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách đơn đặt tour</Text>}
        scroll={{ x: 'max-content' }}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getAllBookings({ page: current, limit: pageSize, ...rest })
            const raw = res.data?.data?.data
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: res.data?.data?.pagination?.total ?? 0,
            }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách booking')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Edit Modal */}
      <Modal
        title={null}
        open={modalVisit}
        onCancel={() => setModalVisit(false)}
        centered
        width={Math.min(580, window.innerWidth * 0.96)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        <DarkHeader
          title={`Cập nhật đơn: ${currentRecord?.bookingCode ?? ''}`}
          extra={
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace' }}>
              {currentRecord?.bookingCode}
            </span>
          }
        />
        <BookingForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            await adminApi.updateBooking(currentRecord.id, values)
            message.success('Cập nhật trạng thái đơn hàng thành công')
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
        width={Math.min(680, window.innerWidth * 0.96)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {currentRecord?.id && (
          <>
            <DarkHeader
              title="Chi tiết Booking"
              extra={
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Mã đơn</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'monospace' }}>
                    {currentRecord.bookingCode}
                  </div>
                </div>
              }
            />

            <div style={{ padding: '24px 28px' }}>
              {/* Status + Amount strip */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f7f8fa', borderRadius: 8, padding: '12px 16px',
                border: '1px solid #eee', marginBottom: 16,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>TRẠNG THÁI</div>
                  <Badge
                    status={statusConfig[currentRecord.status]?.badgeStatus}
                    text={<Text style={{ fontWeight: 600 }}>{statusConfig[currentRecord.status]?.label || currentRecord.status}</Text>}
                  />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>TỔNG GIÁ TRỊ</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1F4529' }}>
                    {(currentRecord.totalAmount ?? 0).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>

              <SectionLabel>Thông tin khách hàng</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {[
                  { label: 'Họ tên',        value: `${currentRecord.lastName} ${currentRecord.firstName}` },
                  { label: 'Số điện thoại', value: currentRecord.phone },
                  { label: 'Email',          value: currentRecord.email },
                  { label: 'Số người',       value: `${currentRecord.quantity} người` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: '0 0 14px' }} />
              <SectionLabel>Thông tin Tour &amp; Thanh toán</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {[
                  { label: 'Tên Tour',        value: currentRecord.tourName },
                  { label: 'Ngày khởi hành',  value: currentRecord.startDate ? new Date(currentRecord.startDate).toLocaleDateString('vi-VN') : '—' },
                  { label: 'Đã cọc',           value: `${(currentRecord.depositAmount ?? 0).toLocaleString('vi-VN')}đ`, highlight: '#52c41a' },
                  { label: 'Còn lại',          value: `${(currentRecord.remainingAmount ?? 0).toLocaleString('vi-VN')}đ`, highlight: (currentRecord.remainingAmount ?? 0) > 0 ? '#fa8c16' : '#52c41a' },
                  { label: 'Phương thức TT',   value: paymentLabel[currentRecord.paymentMethod] || currentRecord.paymentMethod },
                  { label: 'Ngày đặt',         value: currentRecord.createdAt ? new Date(currentRecord.createdAt).toLocaleString('vi-VN') : '—' },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: highlight || '#333', fontWeight: highlight ? 600 : 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {currentRecord.internalNote && (
                <>
                  <Divider style={{ margin: '0 0 14px' }} />
                  <SectionLabel>Ghi chú nội bộ</SectionLabel>
                  <div style={{
                    background: '#fffbe6', border: '1px solid #ffe58f',
                    borderRadius: 8, padding: '12px 16px',
                    fontSize: 13, color: '#875800',
                  }}>
                    {currentRecord.internalNote}
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
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ background: '#1F4529', borderColor: '#1F4529' }}
                onClick={() => { setShowDetail(false); setModalVisit(true) }}
              >
                Cập nhật đơn
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default BookingsManagement
