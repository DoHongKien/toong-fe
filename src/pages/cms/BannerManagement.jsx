import React, { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Image, Space, message, Popconfirm, Tag, Modal, Descriptions, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const BANNER_DATA = [
  { id: 1, title: 'Đánh thức bản năng mạo hiểm', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200', link: '/tours', order: 1, status: 'active' },
  { id: 2, title: 'Khám phá Tây Nguyên hoang dã', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200', link: '/tours/bidoup', order: 2, status: 'inactive' },
];

const BannerManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Banner',
      dataIndex: 'title',
      render: (_, record) => (
        <Space>
          <Image src={record.image} width={64} height={40} style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.link}</Text>
          </Space>
        </Space>
      ),
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      sorter: (a, b) => a.order - b.order,
      width: 80,
      search: false,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        active:   { text: 'Hiển thị', status: 'Success' },
        inactive: { text: 'Ẩn',       status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'default'} style={{ fontSize: 12 }}>
          {record.status === 'active' ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 110,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true); }} />
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true); }} />
          <Popconfirm
            title="Xóa banner này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success('Đã xóa banner thành công')}
            okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Banner / Hero</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Cấu hình hình ảnh và liên kết hiển thị trên trang chủ.</Text>
      </div>

      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách Banner</Text>}
        request={async () => ({ data: BANNER_DATA, success: true })}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={false}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrentRecord(null); setModalVisit(true); }}>
            Thêm banner
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      <ModalForm
        title={currentRecord ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { status: 'active', order: 1 }}
        onFinish={async (values) => { console.log(values); message.success(currentRecord ? 'Đã cập nhật banner' : 'Đã thêm banner mới'); return true; }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Thêm mới', resetText: 'Hủy' } }}
      >
        <ProFormText name="title" label="Tiêu đề banner" placeholder="Nhập tiêu đề..." rules={[{ required: true }]} />
        <ProFormText name="image" label="URL Hình ảnh" placeholder="https://..." rules={[{ required: true }]} />
        <ProFormText name="link" label="Đường dẫn liên kết" placeholder="/tours hoặc https://..." />
        <ProFormText name="order" label="Thứ tự hiển thị" placeholder="1" />
        <ProFormSelect name="status" label="Trạng thái" valueEnum={{ active: 'Hiển thị', inactive: 'Ẩn' }} rules={[{ required: true }]} />
      </ModalForm>

      <Modal
        title={currentRecord ? `Chi tiết Banner: ${currentRecord.title}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered width={620} footer={null} destroyOnClose
      >
        {currentRecord?.id && (
          <>
            <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <Image src={currentRecord.image} style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tiêu đề" span={2}>{currentRecord.title}</Descriptions.Item>
              <Descriptions.Item label="Liên kết" span={2}>{currentRecord.link}</Descriptions.Item>
              <Descriptions.Item label="Thứ tự">{currentRecord.order}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={currentRecord.status === 'active' ? 'green' : 'default'}>
                  {currentRecord.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => { setShowDetail(false); setModalVisit(true); }}>Chỉnh sửa</Button>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default BannerManagement;
