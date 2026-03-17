import React, { useState } from 'react';
import { ProTable, ModalForm, ProFormSelect, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { Button, Tag, Space, message, Typography, Popconfirm, Badge, Modal, Descriptions, Divider } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const BOOKINGS_DATA = [
  {
    id: 1,
    booking_code: 'BK-10293',
    first_name: 'An',
    last_name: 'Nguyễn Văn',
    phone: '0912345678',
    quantity: 2,
    total_amount: 7000000,
    deposit_amount: 2000000,
    remaining_amount: 5000000,
    payment_method: 'bank_transfer',
    status: 'pending',
    created_at: Date.now() - 3600000,
  },
  {
    id: 2,
    booking_code: 'BK-10294',
    first_name: 'Bình',
    last_name: 'Lê Thị',
    phone: '0987654321',
    quantity: 1,
    total_amount: 3500000,
    deposit_amount: 3500000,
    remaining_amount: 0,
    payment_method: 'momo',
    status: 'paid',
    created_at: Date.now() - 86400000,
  },
  {
    id: 3,
    booking_code: 'BK-10295',
    first_name: 'Cường',
    last_name: 'Phạm Hữu',
    phone: '0911223344',
    quantity: 4,
    total_amount: 14000000,
    deposit_amount: 4000000,
    remaining_amount: 10000000,
    payment_method: 'cash',
    status: 'deposited',
    created_at: Date.now() - 43200000,
  },
];

const paymentLabel = { bank_transfer: 'Chuyển khoản', cash: 'Tiền mặt', momo: 'Momo' };
const statusConfig = {
  pending:   { color: 'default',   label: 'Chờ xác nhận' },
  deposited: { color: 'processing', label: 'Đã cọc' },
  paid:      { color: 'success',   label: 'Đã tất toán' },
  cancelled: { color: 'error',     label: 'Đã hủy' },
};

const BookingsManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'booking_code',
      copyable: true,
      width: 120,
      render: (code) => <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>{code}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{`${record.last_name} ${record.first_name}`}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.phone}</Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'Số người',
      dataIndex: 'quantity',
      valueType: 'digit',
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
            Tổng: <Text strong style={{ color: '#1F4529' }}>{record.total_amount.toLocaleString('vi-VN')}đ</Text>
          </Text>
          <Text style={{ fontSize: 11 }}>
            Cọc: <Text style={{ color: '#52c41a' }}>{record.deposit_amount.toLocaleString('vi-VN')}đ</Text>
          </Text>
        </Space>
      ),
      search: false,
    },
    {
      title: 'PT Thanh toán',
      dataIndex: 'payment_method',
      width: 120,
      render: (_, record) => (
        <Tag style={{ fontSize: 11 }}>{paymentLabel[record.payment_method]}</Tag>
      ),
      valueEnum: {
        'bank_transfer': { text: 'Chuyển khoản' },
        'cash':          { text: 'Tiền mặt' },
        'momo':          { text: 'Momo' },
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      valueEnum: {
        'pending':   { text: 'Chờ xác nhận', status: 'Default' },
        'deposited': { text: 'Đã cọc',       status: 'Processing' },
        'paid':      { text: 'Đã tất toán',  status: 'Success' },
        'cancelled': { text: 'Đã hủy',       status: 'Error' },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || {};
        return <Badge status={s.color} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />;
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: true,
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
          {record.status === 'pending' && (
            <Popconfirm
              title="Xác nhận đơn hàng?"
              description="Khách hàng đã chuyển cọc?"
              onConfirm={() => message.success('Đã xác nhận thanh toán cọc')}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Button size="small" style={{ color: '#1F4529', borderColor: '#1F4529' }} icon={<CheckCircleOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Booking</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Theo dõi trạng thái đặt chỗ, thông tin khách hàng và xác nhận thanh toán.</Text>
      </div>

      {/* ── Table ── */}
      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách đơn đặt tour</Text>}
        request={async (params) => {
          console.log(params);
          return { data: BOOKINGS_DATA, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Edit Modal ── */}
      <ModalForm
        title={`Cập nhật đơn hàng: ${currentRecord?.booking_code}`}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord}
        onFinish={async (values) => {
          console.log(values);
          message.success('Cập nhật trạng thái đơn hàng thành công');
          return true;
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
      >
        <ProFormSelect
          name="status"
          label="Trạng thái đơn hàng"
          valueEnum={{
            'pending':   'Chờ xác nhận',
            'deposited': 'Đã cọc',
            'paid':      'Đã tất toán',
            'cancelled': 'Đã hủy',
          }}
          rules={[{ required: true }]}
        />
        <ProFormMoney
          name="deposit_amount"
          label="Số tiền đã cọc"
          locale="vi-VN"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="internal_note"
          label="Ghi chú nội bộ"
          placeholder="Nhập ghi chú cho nhân viên..."
        />
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Chi tiết Booking: ${currentRecord.booking_code}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered
        width={680}
        footer={null}
        destroyOnClose
      >
        {currentRecord?.id && (
          <>
            {/* Summary strip */}
            <div style={{
              background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
              borderRadius: 8, padding: '16px 20px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Mã đơn hàng</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: 'monospace' }}>
                  {currentRecord.booking_code}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Badge status={statusConfig[currentRecord.status]?.color} text={
                    <Text style={{ color: '#E8ECD7', fontSize: 12 }}>{statusConfig[currentRecord.status]?.label}</Text>
                  } />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tổng giá trị</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {currentRecord.total_amount.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ tên" span={2}>
                {`${currentRecord.last_name} ${currentRecord.first_name}`}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{currentRecord.phone}</Descriptions.Item>
              <Descriptions.Item label="Số người">{currentRecord.quantity} người</Descriptions.Item>
              <Descriptions.Item label="Đã cọc">
                <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                  {currentRecord.deposit_amount.toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Còn lại">
                <Text style={{ color: currentRecord.remaining_amount > 0 ? '#fa8c16' : '#52c41a', fontWeight: 600 }}>
                  {currentRecord.remaining_amount.toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức">{paymentLabel[currentRecord.payment_method]}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(currentRecord.created_at).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú nội bộ" span={2}>
                {currentRecord.internal_note || <Text type="secondary">Không có</Text>}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => { setShowDetail(false); setModalVisit(true); }}
              >
                Cập nhật đơn
              </Button>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default BookingsManagement;
