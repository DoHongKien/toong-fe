import { useState } from 'react';
import { ProTable, ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { Badge, Space, message, Typography, Button, Modal, Tag, Descriptions, Divider, Popconfirm } from 'antd';
import { EyeOutlined, CheckCircleOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Text, Title } = Typography;

// Removed static PASS_ORDERS_DATA

const statusConfig = {
  pending:   { color: 'default',  label: 'Chờ thanh toán', badgeStatus: 'default'    },
  paid:      { color: 'success',  label: 'Đã kích hoạt',   badgeStatus: 'success'    },
  cancelled: { color: 'error',    label: 'Đã hủy',          badgeStatus: 'error'      },
};

const passColor = {
  TRIAL:     '#389e0d',
  SHARING:   '#d46b08',
  ADVENTURE: '#0D2E2A',
};

const PassOrders = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

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
      sorter: (a, b) => a.amount - b.amount,
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
        'pending':   { text: 'Chờ thanh toán', status: 'Default'  },
        'paid':      { text: 'Đã kích hoạt',   status: 'Success'  },
        'cancelled': { text: 'Đã hủy',          status: 'Error'    },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || {};
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />;
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
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => { setCurrentRecord(record); setShowDetail(true); }}
          />
          {record.status === 'pending' && (
            <Button
              size="small"
              style={{ color: '#1F4529', borderColor: '#1F4529' }}
              icon={<CheckCircleOutlined />}
              onClick={() => { setCurrentRecord(record); setModalVisit(true); }}
            />
          )}
          <Popconfirm
            title="Xóa đơn hàng này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success('Đã xóa đơn hàng')}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Đơn hàng Adventure Pass</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Theo dõi và kích hoạt thẻ hội viên cho khách hàng.</Text>
      </div>

      {/* ── Table ── */}
      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách đơn mua Pass</Text>}
        request={async (params) => {
          try {
            const res = await adminApi.getPassOrders(params);
            const raw = res.data?.data;
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: Array.isArray(raw) ? raw.length : 0,
            };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách đơn mua Pass');
            return { data: [], success: false };
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Activate Modal ── */}
      <ModalForm
        title={`Kích hoạt gói Pass cho đơn: ${currentRecord?.order_code}`}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord}
        onFinish={async (values) => {
          try {
            await adminApi.updatePassOrderStatus(currentRecord.id, values.status);
            message.success('Đã cập nhật trạng thái đơn hàng thành công!');
            setModalVisit(false);
            window.location.reload();
            return true;
          } catch (err) {
            console.error(err);
            message.error('Cập nhật thất bại');
            return false;
          }
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: 'Xác nhận kích hoạt', resetText: 'Hủy' } }}
      >
        <ProFormSelect
          name="status"
          label="Cập nhật trạng thái"
          valueEnum={{
            'paid':      'Đã nhận tiền & Kích hoạt thẻ',
            'cancelled': 'Hủy đơn hàng',
          }}
          rules={[{ required: true }]}
        />
        <div style={{ padding: '8px 12px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, fontSize: 13, color: '#875800' }}>
          ⚠️ Sau khi kích hoạt, khách hàng sẽ nhận được quyền lợi thành viên ngay lập tức.
        </div>
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Chi tiết đơn: ${currentRecord.order_code}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered
        width={600}
        footer={null}
        destroyOnClose
      >
        {currentRecord?.id && (
          <>
            {/* Summary strip */}
            <div style={{
              background: `linear-gradient(135deg, ${passColor[currentRecord.pass_title] || '#0D2E2A'} 0%, rgba(0,0,0,0.3) 100%)`,
              borderRadius: 8, padding: '16px 20px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Mã đơn hàng</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: 'monospace' }}>
                  {currentRecord.order_code}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Tag
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 11 }}
                  >
                    <CrownOutlined style={{ marginRight: 4 }} />{currentRecord.pass_title} Pass
                  </Tag>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Số tiền</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {(currentRecord.amount ?? 0) === 0 ? 'Miễn phí' : `${(currentRecord.amount ?? 0).toLocaleString('vi-VN')}đ`}
                </div>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Hội viên" span={2}>
                {`${currentRecord.last_name} ${currentRecord.first_name}`}
              </Descriptions.Item>
              <Descriptions.Item label="Member ID">#{currentRecord.id}</Descriptions.Item>
              <Descriptions.Item label="Gói Pass">
                <Tag color={passColor[currentRecord.pass_title]}>{currentRecord.pass_title}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge status={statusConfig[currentRecord.status]?.badgeStatus}
                  text={statusConfig[currentRecord.status]?.label} />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày mua">
                {new Date(currentRecord.created_at).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <Space>
              {currentRecord.status === 'pending' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => { setShowDetail(false); setModalVisit(true); }}
                >
                  Kích hoạt thẻ ngay
                </Button>
              )}
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default PassOrders;
