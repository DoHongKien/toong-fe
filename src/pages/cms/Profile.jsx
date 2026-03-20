import { useState, useEffect } from 'react'
import {
  Row, Col, Card, Avatar, Button, Typography, Descriptions, Divider,
  Form, Input, message, Tag, Badge, Space, Tabs, Spin,
} from 'antd'
import {
  UserOutlined, EditOutlined, LockOutlined, SaveOutlined, CloseOutlined,
  MailOutlined, IdcardOutlined, CheckCircleOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

const roleConfig = {
  SUPER_ADMIN:  { color: 'red',    label: 'Quản trị viên',       gradient: 'linear-gradient(135deg, #cf1322, #ff4d4f)' },
  ADMIN:        { color: 'red',    label: 'Quản trị viên',       gradient: 'linear-gradient(135deg, #cf1322, #ff4d4f)' },
  SALE_MANAGER: { color: 'orange', label: 'Quản lý kinh doanh',  gradient: 'linear-gradient(135deg, #d46b08, #ffa940)' },
  MANAGER:      { color: 'orange', label: 'Quản lý',            gradient: 'linear-gradient(135deg, #d46b08, #ffa940)' },
  EDITOR:       { color: 'blue',   label: 'Biên tập viên',       gradient: 'linear-gradient(135deg, #1677ff, #69b1ff)' },
  STAFF:        { color: 'blue',   label: 'Nhân viên',           gradient: 'linear-gradient(135deg, #1677ff, #69b1ff)' },
}

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()
  const [pwForm] = Form.useForm()
  const [savingInfo, setSavingInfo] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    adminApi.getProfile()
      .then(res => {
        const data = res.data?.data
        setUser(data)
      })
      .catch(err => {
        console.error(err)
        // fallback: đọc từ localStorage nếu API chưa có
        const stored = localStorage.getItem('toong_cms_user')
        if (stored) {
          try { setUser(JSON.parse(stored)) } catch {}
        }
      })
      .finally(() => setLoadingUser(false))
  }, [])

  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields()
      setSavingInfo(true)
      await adminApi.updateProfile(values)
      setUser(prev => ({ ...prev, ...values }))
      message.success('Đã cập nhật thông tin cá nhân')
      setEditing(false)
    } catch (err) {
      if (err?.errorFields) return // validation error — antd đã hiển thị
      console.error(err)
      message.error('Không thể cập nhật thông tin, vui lòng thử lại')
    } finally {
      setSavingInfo(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      const values = await pwForm.validateFields()
      if (values.new_password !== values.confirm_password) {
        return message.error('Mật khẩu xác nhận không khớp!')
      }
      setSavingPw(true)
      await adminApi.changePassword({
        currentPassword: values.current_password,
        newPassword: values.new_password,
      })
      message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!')
      setTimeout(() => {
        localStorage.removeItem('toong_cms_token')
        localStorage.removeItem('toong_cms_user')
        window.location.href = '/cms/login'
      }, 1000)
    } catch (err) {
      if (err?.errorFields) return
      console.error(err)
      const msg = err?.response?.data?.message || 'Đổi mật khẩu thất bại, vui lòng thử lại'
      message.error(msg)
    } finally {
      setSavingPw(false)
    }
  }

  const roleCode = user?.role?.code || user?.roleCode || 'STAFF'
  const roleInfo = roleConfig[roleCode] || { color: 'default', label: roleCode, gradient: 'linear-gradient(135deg, #0D2E2A, #1F4529)' }

  if (loadingUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Hồ sơ cá nhân</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Xem và cập nhật thông tin tài khoản của bạn.</Text>
      </div>

      <Row gutter={[20, 20]} align="top">
        {/* ── Left: Profile card ── */}
        <Col xs={24} md={8}>
          <Card
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
          >
            <div style={{ height: 100, background: roleInfo.gradient }} />

            <div style={{ textAlign: 'center', marginTop: -40, paddingBottom: 24 }}>
              <Avatar
                size={80}
                style={{
                  background: roleInfo.gradient,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: 32,
                }}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: 12 }}>
                <Title level={5} style={{ margin: 0 }}>{user?.fullName || user?.name || '—'}</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>@{user?.username || '—'}</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Tag color={roleInfo.color} style={{ fontSize: 12 }}>{roleInfo.label}</Tag>
                <Badge
                  status={user?.status === 'active' ? 'success' : 'error'}
                  text={<Text style={{ fontSize: 12 }}>{user?.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}</Text>}
                />
              </div>

              <Divider style={{ margin: '16px 0 12px' }} />

              <div style={{ textAlign: 'left', padding: '0 20px' }}>
                {[
                  { icon: <MailOutlined />,       label: user?.email || '—' },
                  { icon: <IdcardOutlined />,      label: `ID: #${user?.id || '—'}` },
                  { icon: <CheckCircleOutlined />, label: `Tham gia: ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#999', fontSize: 14 }}>{item.icon}</span>
                    <Text style={{ fontSize: 13, color: '#555' }}>{item.label}</Text>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: '12px 0 8px' }} />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Đăng nhập lần cuối: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : '—'}
              </Text>
            </div>
          </Card>
        </Col>

        {/* ── Right: Edit tabs ── */}
        <Col xs={24} md={16}>
          <Card
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            styles={{ body: { padding: 0 } }}
          >
            <Tabs
              defaultActiveKey="info"
              style={{ padding: '0 24px' }}
              items={[
                {
                  key: 'info',
                  label: <span><UserOutlined /> Thông tin cá nhân</span>,
                  children: (
                    <div style={{ paddingBottom: 24 }}>
                      {!editing ? (
                        <>
                          <Descriptions column={1} bordered size="small" style={{ marginBottom: 20 }}>
                            <Descriptions.Item label="Họ và tên">{user?.fullName || user?.name || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Tên đăng nhập">{user?.username || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                              <Tag color={roleInfo.color}>{roleInfo.label}</Tag>
                            </Descriptions.Item>
                          </Descriptions>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{ background: '#1F4529', borderColor: '#1F4529' }}
                            onClick={() => {
                              form.setFieldsValue({
                                fullName: user?.fullName || user?.name,
                                email: user?.email,
                              })
                              setEditing(true)
                            }}
                          >
                            Chỉnh sửa thông tin
                          </Button>
                        </>
                      ) : (
                        <Form form={form} layout="vertical">
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                                <Input placeholder="Nhập họ và tên..." />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
                                <Input placeholder="email@toong.vn" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Space>
                            <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              loading={savingInfo}
                              style={{ background: '#1F4529', borderColor: '#1F4529' }}
                              onClick={handleSaveInfo}
                            >
                              Lưu thay đổi
                            </Button>
                            <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>Hủy</Button>
                          </Space>
                        </Form>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'password',
                  label: <span><LockOutlined /> Đổi mật khẩu</span>,
                  children: (
                    <div style={{ paddingBottom: 24, maxWidth: 440 }}>
                      <Form form={pwForm} layout="vertical">
                        <Form.Item
                          name="current_password"
                          label="Mật khẩu hiện tại"
                          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                        >
                          <Input.Password placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item
                          name="new_password"
                          label="Mật khẩu mới"
                          rules={[{ required: true, min: 8, message: 'Mật khẩu ít nhất 8 ký tự' }]}
                        >
                          <Input.Password placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item
                          name="confirm_password"
                          label="Xác nhận mật khẩu mới"
                          dependencies={['new_password']}
                          rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) return Promise.resolve()
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                              },
                            }),
                          ]}
                        >
                          <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <div style={{
                          padding: '10px 14px', background: '#fffbe6',
                          border: '1px solid #ffe58f', borderRadius: 6,
                          marginBottom: 16, fontSize: 12, color: '#875800',
                        }}>
                          Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                        </div>

                        <Button
                          type="primary"
                          icon={<LockOutlined />}
                          loading={savingPw}
                          style={{ background: '#1F4529', borderColor: '#1F4529' }}
                          onClick={handleChangePassword}
                        >
                          Đổi mật khẩu
                        </Button>
                      </Form>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile
