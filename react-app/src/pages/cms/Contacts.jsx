import React, { useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag, message, Modal, Badge, Descriptions, Divider, Typography, Popconfirm } from 'antd';
import { EyeOutlined, CheckCircleOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const CONTACTS_DATA = [
  { id: 1, name: 'Lê Văn B',     phone: '0988776655', email: 'levanb@gmail.com',   message: 'Tôi muốn tư vấn tour Tà Năng cho đoàn 10 người.', created_at: Date.now(),          status: 'new'       },
  { id: 2, name: 'Trần Thị C',   phone: '0912334455', email: 'thic@gmail.com',      message: 'Cho hỏi tour Bidoup có khởi hành cuối tuần không?', created_at: Date.now() - 3600000, status: 'contacted' },
  { id: 3, name: 'Nguyễn Minh D', phone: '0977112233', email: 'minhd@gmail.com',  message: 'Tôi muốn đặt Adventure Pass cho nhóm 5 người.', created_at: Date.now() - 86400000, status: 'resolved'  },
];

const statusConfig = {
  new:       { color: 'processing', label: 'Mới',         badgeStatus: 'processing' },
  contacted: { color: 'success',    label: 'Đã liên hệ', badgeStatus: 'success'    },
  resolved:  { color: 'default',    label: 'Đã xử lý',   badgeStatus: 'default'    },
};

const Contacts = () => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Người gửi',
      dataIndex: 'name',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
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
      width: 120,
      valueEnum: {
        new:       { text: 'Mới',        status: 'Processing' },
        contacted: { text: 'Đã liên hệ', status: 'Success'    },
        resolved:  { text: 'Đã xử lý',  status: 'Default'    },
      },
      render: (_, record) => {
        const s = statusConfig[record.status] || {};
        return <Badge status={s.badgeStatus} text={<Text style={{ fontSize: 12 }}>{s.label}</Text>} />;
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true); }} />
          {record.status === 'new' && (
            <Popconfirm
              title="Đánh dấu đã liên hệ?"
              onConfirm={() => message.success('Đã cập nhật trạng thái')}
              okText="Xác nhận" cancelText="Hủy"
            >
              <Button size="small" style={{ color: '#1F4529', borderColor: '#1F4529' }} icon={<CheckCircleOutlined />} />
            </Popconfirm>
          )}
          <Popconfirm
            title="Xóa liên hệ này?" description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success('Đã xóa liên hệ')} okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Hộp thư Liên hệ</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Các yêu cầu tư vấn từ khách hàng gửi qua form liên hệ trên trang web.</Text>
      </div>

      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách tin nhắn</Text>}
        request={async () => ({ data: CONTACTS_DATA, success: true })}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      <Modal
        title={currentRecord ? `Tin nhắn từ: ${currentRecord.name}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered width={600} footer={null} destroyOnClose
      >
        {currentRecord?.id && (
          <>
            {/* Summary strip */}
            <div style={{
              background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
              borderRadius: 8, padding: '14px 18px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MailOutlined style={{ color: '#fff', fontSize: 22 }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{currentRecord.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{currentRecord.phone} · {currentRecord.email}</div>
                <div style={{ marginTop: 4 }}>
                  <Badge status={statusConfig[currentRecord.status]?.badgeStatus}
                    text={<Text style={{ color: '#E8ECD7', fontSize: 11 }}>{statusConfig[currentRecord.status]?.label}</Text>} />
                </div>
              </div>
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày gửi">{new Date(currentRecord.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Text strong>Nội dung tư vấn:</Text>
            <div style={{ marginTop: 8, padding: '12px 16px', background: '#f7f8fa', borderRadius: 6 }}>
              <Text>{currentRecord.message}</Text>
            </div>

            <Divider />
            <Space>
              {currentRecord.status === 'new' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => { message.success('Đã đánh dấu đã liên hệ'); setShowDetail(false); }}
                >
                  Đánh dấu đã liên hệ
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

export default Contacts;
