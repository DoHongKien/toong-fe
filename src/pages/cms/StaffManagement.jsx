import { useState, useRef } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Tag, Badge, message, Popconfirm, Space, Modal, Descriptions, Divider, Typography, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, LockOutlined, UnlockOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Title, Text } = Typography;

// Map role code → hiển thị (dùng role.name từ API làm label chính)
const roleColorMap = {
  SUPER_ADMIN:  'red',
  SALE_MANAGER: 'orange',
  EDITOR:       'blue',
  ADMIN:        'red',
  MANAGER:      'orange',
  STAFF:        'blue',
};

const avatarGradientMap = {
  SUPER_ADMIN:  'linear-gradient(135deg, #cf1322, #ff4d4f)',
  SALE_MANAGER: 'linear-gradient(135deg, #d46b08, #ffa940)',
  EDITOR:       'linear-gradient(135deg, #1677ff, #69b1ff)',
  ADMIN:        'linear-gradient(135deg, #cf1322, #ff4d4f)',
  MANAGER:      'linear-gradient(135deg, #d46b08, #ffa940)',
  STAFF:        'linear-gradient(135deg, #1677ff, #69b1ff)',
};

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #0D2E2A, #1F4529)';

const StaffManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      render: (_, record) => {
        const roleCode = record.role?.code || 'STAFF';
        return (
          <Space>
            <Avatar
              size={36}
              style={{ background: avatarGradientMap[roleCode] || DEFAULT_GRADIENT, flexShrink: 0 }}
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 13 }}>{record.fullName}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      width: 140,
      render: (val) => <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>{val}</Text>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 160,
      search: false,
      render: (_, record) => {
        const code = record.role?.code || 'STAFF';
        return (
          <Tag color={roleColorMap[code] || 'default'} style={{ fontSize: 12 }}>
            {record.role?.name || code}
          </Tag>
        );
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
      title: 'Đăng nhập lần cuối',
      dataIndex: 'lastLogin',
      valueType: 'dateTime',
      search: false,
      width: 160,
      render: (_, record) => record.lastLogin
        ? new Date(record.lastLogin).toLocaleString('vi-VN')
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 130,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true); }} />
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true); }} />
          <Popconfirm
            title={record.status === 'active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
            description={`Bạn có chắc muốn ${record.status === 'active' ? 'khóa' : 'mở khóa'} nhân viên này?`}
            onConfirm={async () => {
              try {
                const newStatus = record.status === 'active' ? 'locked' : 'active';
                await adminApi.updateEmployeeStatus(record.id, newStatus);
                message.success(record.status === 'active' ? 'Đã khóa tài khoản' : 'Đã mở khóa thành công');
                actionRef.current?.reload();
              } catch (err) {
                console.error(err);
                message.error('Không thể cập nhật trạng thái');
              }
            }}
            okText="Xác nhận" cancelText="Hủy"
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
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Nhân viên</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Quản lý tài khoản, vai trò và quyền truy cập của đội ngũ nhân sự.</Text>
      </div>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách nhân sự</Text>}
        request={async (params) => {
          try {
            const res = await adminApi.getAllEmployees(params);
            const raw = res.data?.data?.data;
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: res.data?.data?.pagination?.total ?? 0,
            };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách nhân viên');
            return { data: [], success: false };
          }
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

      <ModalForm
        title={currentRecord ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord ? {
          fullName: currentRecord.fullName,
          email: currentRecord.email,
          role_id: currentRecord.role?.id,
        } : { role_id: 3 }}
        onFinish={async (values) => {
          try {
            if (currentRecord) {
              await adminApi.updateEmployee(currentRecord.id, values);
              message.success('Cập nhật thành công');
            } else {
              await adminApi.createEmployee(values);
              message.success('Thêm nhân viên thành công');
            }
            setModalVisit(false);
            actionRef.current?.reload();
            return true;
          } catch (err) {
            console.error(err);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
            return false;
          }
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Tạo tài khoản', resetText: 'Hủy' } }}
      >
        <ProFormText name="fullName" label="Họ và tên" placeholder="Nhập tên nhân viên..." rules={[{ required: true }]} />
        <ProFormText name="username" label="Tên đăng nhập" placeholder="username" rules={[{ required: !currentRecord }]} />
        <ProFormText name="email" label="Địa chỉ Email" placeholder="email@toong.vn" rules={[{ required: true, type: 'email' }]} />
        <ProFormSelect
          name="role_id"
          label="Vai trò hệ thống"
          placeholder="Chọn vai trò..."
          rules={[{ required: true }]}
          options={[
            { label: 'Quản trị viên', value: 1 },
            { label: 'Quản lý kinh doanh', value: 2 },
            { label: 'Biên tập viên', value: 3 },
          ]}
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

      <Modal
        title={currentRecord ? `Hồ sơ: ${currentRecord.fullName}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered width={580} footer={null} destroyOnClose
      >
        {currentRecord?.id && (
          <>
            <div style={{
              background: avatarGradientMap[currentRecord.role?.code] || DEFAULT_GRADIENT,
              borderRadius: 8, padding: '16px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <Avatar
                size={56}
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }}
                icon={<UserOutlined style={{ fontSize: 28 }} />}
              />
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{currentRecord.fullName}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{currentRecord.email}</div>
                <div style={{ marginTop: 4 }}>
                  <Tag color="rgba(255,255,255,0.2)" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: 11 }}>
                    {currentRecord.role?.name}
                  </Tag>
                </div>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Mã nhân viên">#{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge status={currentRecord.status === 'active' ? 'success' : 'error'}
                  text={currentRecord.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'} />
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập" span={2}>{currentRecord.username}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{currentRecord.email}</Descriptions.Item>
              <Descriptions.Item label="Đăng nhập lần cuối" span={2}>
                {currentRecord.lastLogin ? new Date(currentRecord.lastLogin).toLocaleString('vi-VN') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {currentRecord.createdAt ? new Date(currentRecord.createdAt).toLocaleString('vi-VN') : '—'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => { setShowDetail(false); setModalVisit(true); }}>
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
