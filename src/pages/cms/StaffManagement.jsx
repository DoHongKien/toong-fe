import { useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import {
  Button, Tag, Badge, message, Popconfirm, Space, Modal, Divider,
  Typography, Avatar, Form, Input, Select, Row, Col, Tooltip,
} from 'antd'
import { PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

const roleColorMap = {
  SUPER_ADMIN: 'red', SALE_MANAGER: 'orange', EDITOR: 'blue',
  ADMIN: 'red', MANAGER: 'orange', STAFF: 'blue',
}

const avatarGradientMap = {
  SUPER_ADMIN:  'linear-gradient(135deg, #cf1322, #ff4d4f)',
  SALE_MANAGER: 'linear-gradient(135deg, #d46b08, #ffa940)',
  EDITOR:       'linear-gradient(135deg, #1677ff, #69b1ff)',
  ADMIN:        'linear-gradient(135deg, #cf1322, #ff4d4f)',
  MANAGER:      'linear-gradient(135deg, #d46b08, #ffa940)',
  STAFF:        'linear-gradient(135deg, #1677ff, #69b1ff)',
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #0D2E2A, #1F4529)'

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

const StaffForm = ({ record, onCancel, onSubmit }) => {
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
      initialValues={record ? { fullName: record.fullName, email: record.email, role_id: record.role?.id } : { role_id: 3 }}
      onFinish={handleFinish}>
      <div style={{ padding: '24px 28px' }}>
        <SectionLabel>Thông tin nhân viên</SectionLabel>
        <Form.Item name="fullName" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Họ và tên</span>}
          rules={[{ required: true }]} style={{ marginBottom: 14 }}>
          <Input placeholder="Nhập tên nhân viên..." />
        </Form.Item>
        <Row gutter={12} style={{ marginBottom: 14 }}>
          <Col span={12}>
            <Form.Item name="email" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Email</span>}
              rules={[{ required: true, type: 'email' }]} style={{ marginBottom: 0 }}>
              <Input placeholder="email@toong.vn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên đăng nhập</span>}
              rules={[{ required: !record }]} style={{ marginBottom: 0 }}>
              <Input placeholder="username" disabled={!!record} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="role_id" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Vai trò hệ thống</span>}
          rules={[{ required: true }]} style={{ marginBottom: 6 }}>
          <Select options={[
            { label: 'Quản trị viên', value: 1 },
            { label: 'Quản lý kinh doanh', value: 2 },
            { label: 'Biên tập viên', value: 3 },
          ]} />
        </Form.Item>

        {!record && (
          <>
            <Divider style={{ margin: '14px 0 10px' }} />
            <SectionLabel>Bảo mật</SectionLabel>
            <Form.Item name="password" label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Mật khẩu khởi tạo</span>}
              rules={[{ required: true, min: 6 }]} style={{ marginBottom: 0 }}>
              <Input.Password placeholder="Nhập mật khẩu..." />
            </Form.Item>
          </>
        )}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10,
        padding: '14px 24px', borderTop: '1px solid #f0f0f0',
        background: '#fafafa', borderRadius: '0 0 8px 8px',
      }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}
          style={{ background: '#1F4529', borderColor: '#1F4529' }}>
          {record ? 'Lưu thay đổi' : 'Tạo tài khoản'}
        </Button>
      </div>
    </Form>
  )
}

const StaffManagement = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const actionRef = useRef()

  const columns = [
    {
      title: 'Nhân viên', dataIndex: 'fullName',
      render: (_, record) => {
        const roleCode = record.role?.code || 'STAFF'
        return (
          <Space>
            <Avatar size={36} style={{ background: avatarGradientMap[roleCode] || DEFAULT_GRADIENT, flexShrink: 0 }}
              icon={<UserOutlined />} />
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 13 }}>{record.fullName}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
            </Space>
          </Space>
        )
      },
    },
    { title: 'Tên đăng nhập', dataIndex: 'username', width: 140, render: (val) => <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>{val}</Text> },
    {
      title: 'Vai trò', dataIndex: 'role', width: 160, search: false,
      render: (_, record) => {
        const code = record.role?.code || 'STAFF'
        return <Tag color={roleColorMap[code] || 'default'} style={{ fontSize: 12 }}>{record.role?.name || code}</Tag>
      },
    },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 130,
      valueEnum: { active: { text: 'Hoạt động', status: 'Success' }, locked: { text: 'Bị khóa', status: 'Error' } },
      render: (_, record) => (
        <Badge status={record.status === 'active' ? 'success' : 'error'}
          text={<Text style={{ fontSize: 12 }}>{record.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}</Text>} />
      ),
    },
    {
      title: 'Đăng nhập lần cuối', dataIndex: 'lastLogin', valueType: 'dateTime', search: false, width: 160,
      render: (_, record) => record.lastLogin
        ? new Date(record.lastLogin).toLocaleString('vi-VN')
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Thao tác', valueType: 'option', key: 'option', width: 130,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true) }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true) }} />
          </Tooltip>
          <Popconfirm
            title={record.status === 'active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
            description={`Bạn có chắc muốn ${record.status === 'active' ? 'khóa' : 'mở khóa'} nhân viên này?`}
            onConfirm={async () => {
              try {
                const newStatus = record.status === 'active' ? 'locked' : 'active'
                await adminApi.updateEmployeeStatus(record.id, newStatus)
                message.success(record.status === 'active' ? 'Đã khóa tài khoản' : 'Đã mở khóa thành công')
                actionRef.current?.reload()
              } catch (err) { console.error(err); message.error('Không thể cập nhật trạng thái') }
            }}
            okText="Xác nhận" cancelText="Hủy" okButtonProps={{ danger: record.status === 'active' }}>
            <Tooltip title={record.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
              <Button size="small"
                danger={record.status === 'active'}
                style={record.status !== 'active' ? { color: '#1F4529', borderColor: '#1F4529' } : {}}
                icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Nhân viên</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Quản lý tài khoản, vai trò và quyền truy cập của đội ngũ nhân sự.</Text>
      </div>

      <ProTable columns={columns} actionRef={actionRef} scroll={{ x: 'max-content' }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách nhân sự</Text>}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getAllEmployees({ page: current, limit: pageSize, ...rest })
            const raw = res.data?.data?.data
            return { data: Array.isArray(raw) ? raw : [], success: true, total: res.data?.data?.pagination?.total ?? 0 }
          } catch (err) { console.error(err); message.error('Không thể tải danh sách nhân viên'); return { data: [], success: false } }
        }}
        rowKey="id" search={{ labelWidth: 'auto' }} pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true) }}>Thêm nhân viên</Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* Add / Edit Modal */}
      <Modal title={null} open={modalVisit} onCancel={() => setModalVisit(false)}
        centered width={Math.min(580, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        <DarkHeader title={currentRecord ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          extra={currentRecord && (
            <Avatar size={32} style={{ background: avatarGradientMap[currentRecord.role?.code] || DEFAULT_GRADIENT }}
              icon={<UserOutlined />} />
          )} />
        <StaffForm key={currentRecord?.id ?? 'new'} record={currentRecord}
          onCancel={() => setModalVisit(false)}
          onSubmit={async (values) => {
            if (currentRecord) { await adminApi.updateEmployee(currentRecord.id, values); message.success('Cập nhật thành công') }
            else { await adminApi.createEmployee(values); message.success('Thêm nhân viên thành công') }
            setModalVisit(false)
            actionRef.current?.reload()
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal title={null} open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null) }}
        centered width={Math.min(580, window.innerWidth * 0.96)}
        footer={null} destroyOnClose styles={{ body: { padding: 0 } }}>
        {currentRecord?.id && (
          <>
            <DarkHeader
              title="Hồ sơ nhân viên"
              gradient={avatarGradientMap[currentRecord.role?.code] || DEFAULT_GRADIENT}
              extra={
                <Avatar size={40}
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }}
                  icon={<UserOutlined style={{ fontSize: 20 }} />} />
              }
            />
            <div style={{ padding: '24px 28px' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{currentRecord.fullName}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{currentRecord.email}</div>
                <div style={{ marginTop: 6 }}>
                  <Tag color={roleColorMap[currentRecord.role?.code] || 'default'}>{currentRecord.role?.name}</Tag>
                  <Badge status={currentRecord.status === 'active' ? 'success' : 'error'}
                    text={<Text style={{ fontSize: 12 }}>{currentRecord.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}</Text>} />
                </div>
              </div>

              <Divider style={{ margin: '0 0 14px' }} />
              <SectionLabel>Thông tin tài khoản</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                {[
                  { label: 'Tên đăng nhập', value: currentRecord.username },
                  { label: 'Mã nhân viên', value: `#${currentRecord.id}` },
                  { label: 'Đăng nhập lần cuối', value: currentRecord.lastLogin ? new Date(currentRecord.lastLogin).toLocaleString('vi-VN') : '—' },
                  { label: 'Ngày tạo', value: currentRecord.createdAt ? new Date(currentRecord.createdAt).toLocaleDateString('vi-VN') : '—' },
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
                Sửa thông tin
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default StaffManagement
