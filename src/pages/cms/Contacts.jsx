import { useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Space, message, Modal, Badge, Divider,
  Typography, Popconfirm, Select, Form, Tooltip,
} from 'antd'
import {
  EyeOutlined, CheckCircleOutlined, DeleteOutlined, MailOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Text, Title } = Typography

const statusConfig = {
  new:       { badgeStatus: 'processing', label: 'Mới'        },
  contacted: { badgeStatus: 'success',    label: 'Đã liên hệ' },
  resolved:  { badgeStatus: 'default',    label: 'Đã xử lý'   },
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

/* ─── Main ─── */
const Contacts = () => {
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [updating, setUpdating] = useState(false)
  const actionRef = useRef()

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true)
    try {
      await adminApi.updateContactStatus(id, status)
      message.success('Đã cập nhật trạng thái')
      actionRef.current?.reload()
      setShowDetail(false)
    } catch (err) {
      console.error(err)
      message.error('Không thể cập nhật trạng thái')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteContact = async (id) => {
    try {
      await adminApi.deleteContact(id)
      message.success('Đã xóa liên hệ')
      actionRef.current?.reload()
    } catch (err) {
      console.error(err)
      message.error('Không thể xóa liên hệ')
    }
  }

  const columns = [
    {
      title: 'Người gửi',
      dataIndex: 'full_name',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.full_name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.phone} · {record.email}</Text>
        </Space>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      ellipsis: true,
      search: false,
      render: (msg) => <Text style={{ fontSize: 13 }} ellipsis>{msg}</Text>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        new:       { text: 'Mới',        status: 'Processing' },
        contacted: { text: 'Đã liên hệ', status: 'Success'    },
        resolved:  { text: 'Đã xử lý',  status: 'Default'    },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || {}
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />
      },
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
          {record.status === 'new' && (
            <Popconfirm
              title="Đánh dấu đã liên hệ?"
              onConfirm={() => handleUpdateStatus(record.id, 'contacted')}
              okText="Xác nhận" cancelText="Hủy"
            >
              <Tooltip title="Đánh dấu đã liên hệ">
                <Button size="small" style={{ color: '#1F4529', borderColor: '#1F4529' }} icon={<CheckCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm
            title="Xóa liên hệ này?" description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteContact(record.id)}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa liên hệ">
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Hộp thư Liên hệ</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Các yêu cầu tư vấn từ khách hàng gửi qua form liên hệ trên trang web.</Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách tin nhắn</Text>}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getAllContacts({ page: current, limit: pageSize, ...rest })
            const raw = res.data?.data?.data ?? res.data?.data
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: res.data?.data?.pagination?.total ?? res.data?.pagination?.total ?? 0,
            }
          } catch (err) {
            console.error(err)
            message.error('Không thể tải danh sách liên hệ')
            return { data: [], success: false }
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Detail Modal */}
      <Modal
        title={null}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered
        width={Math.min(600, window.innerWidth * 0.95)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {currentRecord?.id && (
          <>
            <DarkHeader
              title={`Tin nhắn từ: ${currentRecord.full_name}`}
              extra={
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MailOutlined style={{ color: '#fff', fontSize: 20 }} />
                </div>
              }
            />

            <div style={{ padding: '24px 28px' }}>
              {/* Contact info */}
              <SectionLabel>Thông tin liên hệ</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {[
                  { label: 'Họ và tên',    value: currentRecord.full_name },
                  { label: 'Số điện thoại', value: currentRecord.phone },
                  { label: 'Email',         value: currentRecord.email },
                  { label: 'Ngày gửi',      value: new Date(currentRecord.created_at).toLocaleString('vi-VN') },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: '0 0 14px' }} />

              {/* Message content */}
              <SectionLabel>Nội dung tư vấn</SectionLabel>
              <div style={{
                background: '#f7f8fa', borderRadius: 8, padding: '14px 16px',
                fontSize: 13, color: '#555', lineHeight: 1.7, border: '1px solid #eee',
                marginBottom: 16,
              }}>
                {currentRecord.message}
              </div>

              {/* Status update */}
              {currentRecord.status !== 'resolved' && (
                <>
                  <Divider style={{ margin: '0 0 14px' }} />
                  <SectionLabel>Cập nhật trạng thái</SectionLabel>
                  <Form layout="inline">
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Select
                        placeholder="Chọn trạng thái mới"
                        style={{ width: 200 }}
                        loading={updating}
                        onChange={(val) => handleUpdateStatus(currentRecord.id, val)}
                        options={[
                          { label: 'Đã liên hệ', value: 'contacted' },
                          { label: 'Đã xử lý',   value: 'resolved'  },
                        ]}
                      />
                    </Form.Item>
                  </Form>
                </>
              )}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              padding: '14px 24px', borderTop: '1px solid #f0f0f0',
              background: '#fafafa', borderRadius: '0 0 8px 8px',
            }}>
              <Badge
                status={statusConfig[currentRecord.status]?.badgeStatus}
                text={<Text style={{ fontSize: 12 }}>{statusConfig[currentRecord.status]?.label}</Text>}
                style={{ marginRight: 'auto', alignSelf: 'center' }}
              />
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default Contacts
