import { useState } from 'react';
import {
  Row, Col, Card, Avatar, Button, Typography, Descriptions, Divider,
  Form, Input, message, Tag, Badge, Space, Tabs
} from 'antd';
import {
  UserOutlined, EditOutlined, LockOutlined, SaveOutlined, CloseOutlined,
  MailOutlined, PhoneOutlined, IdcardOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CURRENT_USER = {
  id: 1,
  name: 'Kiên Đỗ',
  username: 'kien.admin',
  email: 'kien@toong.vn',
  phone: '0933227878',
  role: 'admin',
  roleLabel: 'Quản trị viên',
  status: 'active',
  last_login: new Date(Date.now() - 3600000).toLocaleString('vi-VN'),
  joined: '01/01/2025',
};

const roleConfig = {
  admin:   { color: 'red',    gradient: 'linear-gradient(135deg, #cf1322, #ff4d4f)' },
  manager: { color: 'orange', gradient: 'linear-gradient(135deg, #d46b08, #ffa940)' },
  staff:   { color: 'blue',   gradient: 'linear-gradient(135deg, #1677ff, #69b1ff)' },
};

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [pwForm] = Form.useForm();
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields();
      setSavingInfo(true);
      await new Promise(r => setTimeout(r, 600)); // simulate API
      console.log('Updated info:', values);
      message.success('Đã cập nhật thông tin cá nhân');
      setEditing(false);
    } catch {}
    setSavingInfo(false);
  };

  const handleChangePassword = async () => {
    try {
      const values = await pwForm.validateFields();
      if (values.new_password !== values.confirm_password) {
        return message.error('Mật khẩu xác nhận không khớp!');
      }
      setSavingPw(true);
      await new Promise(r => setTimeout(r, 600));
      console.log('Change password:', values);
      message.success('Đã đổi mật khẩu thành công');
      pwForm.resetFields();
    } catch {}
    setSavingPw(false);
  };

  const themeGradient = roleConfig[CURRENT_USER.role]?.gradient || 'linear-gradient(135deg, #0D2E2A, #1F4529)';

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
            {/* Cover gradient */}
            <div style={{ height: 100, background: themeGradient }} />

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginTop: -40, paddingBottom: 24 }}>
              <Avatar
                size={80}
                style={{
                  background: themeGradient,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: 32,
                }}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: 12 }}>
                <Title level={5} style={{ margin: 0 }}>{CURRENT_USER.name}</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>@{CURRENT_USER.username}</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Tag color={roleConfig[CURRENT_USER.role]?.color} style={{ fontSize: 12 }}>
                  {CURRENT_USER.roleLabel}
                </Tag>
                <Badge status="success" text={<Text style={{ fontSize: 12 }}>Đang hoạt động</Text>} />
              </div>

              <Divider style={{ margin: '16px 0 12px' }} />

              <div style={{ textAlign: 'left', padding: '0 20px' }}>
                {[
                  { icon: <MailOutlined />, label: CURRENT_USER.email },
                  { icon: <PhoneOutlined />, label: CURRENT_USER.phone },
                  { icon: <IdcardOutlined />, label: `ID: #${CURRENT_USER.id}` },
                  { icon: <CheckCircleOutlined />, label: `Tham gia: ${CURRENT_USER.joined}` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#999', fontSize: 14 }}>{item.icon}</span>
                    <Text style={{ fontSize: 13, color: '#555' }}>{item.label}</Text>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: '12px 0 8px' }} />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Đăng nhập lần cuối: {CURRENT_USER.last_login}
              </Text>
            </div>
          </Card>
        </Col>

        {/* ── Right: Edit tabs ── */}
        <Col xs={24} md={16}>
          <Card
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            styles={{ body: { padding: '0' } }}
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
                            <Descriptions.Item label="Họ và tên">{CURRENT_USER.name}</Descriptions.Item>
                            <Descriptions.Item label="Tên đăng nhập">{CURRENT_USER.username}</Descriptions.Item>
                            <Descriptions.Item label="Email">{CURRENT_USER.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{CURRENT_USER.phone}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                              <Tag color={roleConfig[CURRENT_USER.role]?.color}>{CURRENT_USER.roleLabel}</Tag>
                            </Descriptions.Item>
                          </Descriptions>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => { form.setFieldsValue(CURRENT_USER); setEditing(true); }}
                          >
                            Chỉnh sửa thông tin
                          </Button>
                        </>
                      ) : (
                        <Form form={form} layout="vertical" initialValues={CURRENT_USER}>
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                                <Input placeholder="Nhập họ và tên..." />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input placeholder="email@toong.vn" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name="phone" label="Số điện thoại">
                                <Input placeholder="09xxxxxxxx" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Space>
                            <Button type="primary" icon={<SaveOutlined />} loading={savingInfo} onClick={handleSaveInfo}>
                              Lưu thay đổi
                            </Button>
                            <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>
                              Hủy
                            </Button>
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
                          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                        >
                          <Input.Password placeholder="••••••••" />
                        </Form.Item>

                        <div style={{ padding: '10px 14px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, marginBottom: 16, fontSize: 12, color: '#875800' }}>
                          💡 Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                        </div>

                        <Button
                          type="primary"
                          icon={<LockOutlined />}
                          loading={savingPw}
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
  );
};

export default Profile;
