import { useState, useRef } from 'react';
import { ProTable, ModalForm, ProFormSelect, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { Button, Tag, Space, message, Typography, Popconfirm, Badge, Modal, Descriptions, Divider } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Text, Title } = Typography;

// paymentMethod từ API trả về uppercase (VNPAY, BANK_TRANSFER, CASH, MOMO)
const paymentLabel = {
  BANK_TRANSFER: 'Chuyển khoản',
  CASH:          'Tiền mặt',
  MOMO:          'Momo',
  VNPAY:         'VNPay',
  // lowercase fallback (docs cũ)
  bank_transfer: 'Chuyển khoản',
  cash:          'Tiền mặt',
  momo:          'Momo',
};

// status từ API: PENDING, CONFIRMED, DEPOSITED, CANCELLED (uppercase)
const statusConfig = {
  PENDING:   { badgeStatus: 'default',    label: 'Chờ xác nhận' },
  CONFIRMED: { badgeStatus: 'processing', label: 'Đã xác nhận'  },
  DEPOSITED: { badgeStatus: 'processing', label: 'Đã cọc'       },
  PAID:      { badgeStatus: 'success',    label: 'Đã tất toán'  },
  CANCELLED: { badgeStatus: 'error',      label: 'Đã hủy'       },
  // lowercase fallback
  pending:   { badgeStatus: 'default',    label: 'Chờ xác nhận' },
  confirmed: { badgeStatus: 'processing', label: 'Đã xác nhận'  },
  deposited: { badgeStatus: 'processing', label: 'Đã cọc'       },
  paid:      { badgeStatus: 'success',    label: 'Đã tất toán'  },
  cancelled: { badgeStatus: 'error',      label: 'Đã hủy'       },
};

const BookingsManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();

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
        const s = statusConfig[record.status] || { badgeStatus: 'default', label: record.status };
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />;
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
          {(record.status === 'PENDING' || record.status === 'pending') && (
            <Popconfirm
              title="Xác nhận đơn hàng?"
              description="Khách hàng đã chuyển cọc?"
              onConfirm={async () => {
                try {
                  await adminApi.updateBookingStatus(record.id, 'CONFIRMED');
                  message.success('Đã xác nhận đơn hàng');
                  action?.reload();
                } catch (err) {
                  console.error(err);
                  message.error('Không thể xác nhận');
                }
              }}
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
        actionRef={actionRef}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách đơn đặt tour</Text>}
        request={async (params) => {
          try {
            const res = await adminApi.getAllBookings(params);
            const raw = res.data?.data?.data;
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: res.data?.data?.pagination?.total ?? 0,
            };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách booking');
            return { data: [], success: false };
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Edit Modal ── */}
      <ModalForm
        title={`Cập nhật đơn hàng: ${currentRecord?.bookingCode}`}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord ? { status: currentRecord.status, depositAmount: currentRecord.depositAmount } : {}}
        onFinish={async (values) => {
          try {
            await adminApi.updateBooking(currentRecord.id, values);
            message.success('Cập nhật trạng thái đơn hàng thành công');
            setModalVisit(false);
            actionRef.current?.reload();
            return true;
          } catch (err) {
            console.error(err);
            message.error('Cập nhật thất bại');
            return false;
          }
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: 'Lưu thay đổi', resetText: 'Hủy' } }}
      >
        <ProFormSelect
          name="status"
          label="Trạng thái đơn hàng"
          valueEnum={{
            'PENDING':   'Chờ xác nhận',
            'CONFIRMED': 'Đã xác nhận',
            'DEPOSITED': 'Đã cọc',
            'PAID':      'Đã tất toán',
            'CANCELLED': 'Đã hủy',
          }}
          rules={[{ required: true }]}
        />
        <ProFormMoney
          name="depositAmount"
          label="Số tiền đã cọc"
          locale="vi-VN"
        />
        <ProFormText
          name="internalNote"
          label="Ghi chú nội bộ"
          placeholder="Nhập ghi chú cho nhân viên..."
        />
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Chi tiết Booking: ${currentRecord.bookingCode}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered
        width={700}
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
                  {currentRecord.bookingCode}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Badge
                    status={statusConfig[currentRecord.status]?.badgeStatus}
                    text={<Text style={{ color: '#E8ECD7', fontSize: 12 }}>{statusConfig[currentRecord.status]?.label || currentRecord.status}</Text>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tổng giá trị</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {(currentRecord.totalAmount ?? 0).toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ tên" span={2}>
                {`${currentRecord.lastName} ${currentRecord.firstName}`}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{currentRecord.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{currentRecord.email}</Descriptions.Item>
              <Descriptions.Item label="Tour" span={2}>{currentRecord.tourName}</Descriptions.Item>
              <Descriptions.Item label="Ngày khởi hành">
                {currentRecord.startDate ? new Date(currentRecord.startDate).toLocaleDateString('vi-VN') : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Số người">{currentRecord.quantity} người</Descriptions.Item>
              <Descriptions.Item label="Đã cọc">
                <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                  {(currentRecord.depositAmount ?? 0).toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Còn lại">
                <Text style={{ color: (currentRecord.remainingAmount ?? 0) > 0 ? '#fa8c16' : '#52c41a', fontWeight: 600 }}>
                  {(currentRecord.remainingAmount ?? 0).toLocaleString('vi-VN')}đ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {paymentLabel[currentRecord.paymentMethod] || currentRecord.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {currentRecord.createdAt ? new Date(currentRecord.createdAt).toLocaleString('vi-VN') : '—'}
              </Descriptions.Item>
              {currentRecord.internalNote && (
                <Descriptions.Item label="Ghi chú nội bộ" span={2}>
                  {currentRecord.internalNote}
                </Descriptions.Item>
              )}
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
