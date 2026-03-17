import { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Tag, Badge, message, Popconfirm, Space, Modal, Descriptions, Divider, Typography, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const STAFF_DATA = [
  { id: 1, name: 'Kiên Đỗ',       email: 'kien@toong.vn',   role: 'admin',   status: 'active' },
  { id: 2, name: 'Nguyễn Văn A',  email: 'vana@toong.vn',   role: 'staff',   status: 'active' },
  { id: 3, name: 'Trần Thị B',    email: 'thib@toong.vn',   role: 'manager', status: 'locked' },
];

const roleConfig = {
  admin:   { label: 'Quản trị viên', color: 'red'    },
  manager: { label: 'Quản lý',       color: 'orange' },
  staff:   { label: 'Nhân viên',     color: 'blue'   },
};

const avatarColors = {
  admin:   'linear-gradient(135deg, #cf1322, #ff4d4f)',
  manager: 'linear-gradient(135deg, #d46b08, #ffa940)',
  staff:   'linear-gradient(135deg, #1677ff, #69b1ff)',
};

const StaffManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      render: (_, record) => (
        <Space>
          <Avatar
            size={36}
            style={{ background: avatarColors[record.role], flexShrink: 0 }}
            icon={<UserOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
          </Space>
        </Space>
      ),
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 140,
      valueType: 'select',
      valueEnum: {
        admin:   { text: 'Quản trị viên', status: 'Error'   },
        manager: { text: 'Quản lý',       status: 'Warning' },
        staff:   { text: 'Nhân viên',     status: 'Default' },
      },
      render: (_, record) => {
        const r = roleConfig[record.role] || {};
        return <Tag color={r.color} style={{ fontSize: 12 }}>{r.label}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        active: { text: 'Hoạt động', status: 'Success' },
        locked: { text: 'Bị khóa',   status: 'Error'   },
      },
      render: (_, record) => (
        <Badge
          status={record.status === 'active' ? 'success' : 'error'}
          text={<Text style={{ fontSize: 12 }}>{record.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}</Text>}
        />
      ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 130,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { setCurrentRecord(record); setShowDetail(true); }}
          />
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => { setCurrentRecord(record); setModalVisit(true); }}
          />
          <Popconfirm
            title={record.status === 'active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
            description={`Bạn có chắc muốn ${record.status === 'active' ? 'khóa' : 'mở khóa'} nhân viên này?`}
            onConfirm={() => message.success(record.status === 'active' ? 'Đã khóa tài khoản' : 'Đã mở khóa thành công')}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ danger: record.status === 'active' }}
          >
            <Button
              size="small"
              danger={record.status === 'active'}
              style={record.status !== 'active' ? { color: '#1F4529', borderColor: '#1F4529' } : {}}
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Nhân viên</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Quản lý tài khoản, vai trò và quyền truy cập của đội ngũ nhân sự.</Text>
      </div>

      {/* ── Table ── */}
      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách nhân sự</Text>}
        request={async (params) => {
          console.log(params);
          return { data: STAFF_DATA, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true); }}
          >
            Thêm nhân viên
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Add / Edit Modal ── */}
      <ModalForm
        title={currentRecord ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { role: 'staff', status: 'active' }}
        onFinish={async (values) => {
          console.log(values);
          message.success(currentRecord ? 'Cập nhật thành công' : 'Thêm mới thành công');
          return true;
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Tạo tài khoản', resetText: 'Hủy' } }}
      >
        <ProFormText
          name="name"
          label="Họ và tên"
          placeholder="Nhập tên nhân viên..."
          rules={[{ required: true }]}
        />
        <ProFormText
          name="email"
          label="Địa chỉ Email"
          placeholder="email@toong.vn"
          rules={[{ required: true, type: 'email' }]}
        />
        <ProFormSelect
          name="role"
          label="Vai trò hệ thống"
          valueEnum={{ admin: 'Quản trị viên', manager: 'Quản lý', staff: 'Nhân viên' }}
          rules={[{ required: true }]}
        />
        {!currentRecord && (
          <ProFormText.Password
            name="password"
            label="Mật khẩu khởi tạo"
            placeholder="Nhập mật khẩu..."
            rules={[{ required: true, min: 6 }]}
          />
        )}
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Hồ sơ: ${currentRecord.name}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered
        width={580}
        footer={null}
        destroyOnClose
      >
        {currentRecord?.id && (
          <>
            {/* Summary strip */}
            <div style={{
              background: avatarColors[currentRecord.role] || 'linear-gradient(135deg, #0D2E2A, #1F4529)',
              borderRadius: 8, padding: '16px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <Avatar
                size={56}
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }}
                icon={<UserOutlined style={{ fontSize: 28 }} />}
              />
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{currentRecord.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{currentRecord.email}</div>
                <div style={{ marginTop: 4 }}>
                  <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: 11 }}>
                    {roleConfig[currentRecord.role]?.label}
                  </Tag>
                </div>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Mã nhân viên">#{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={currentRecord.status === 'active' ? 'success' : 'error'}
                  text={currentRecord.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên" span={2}>{currentRecord.name}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{currentRecord.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò" span={2}>
                <Tag color={roleConfig[currentRecord.role]?.color}>
                  {roleConfig[currentRecord.role]?.label}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => { setShowDetail(false); setModalVisit(true); }}
              >
                Sửa thông tin
              </Button>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default StaffManagement;
