import { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Image, Space, message, Popconfirm, Tag, Modal, Descriptions, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Text, Title } = Typography;

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
          <Image src={record.image_url} width={64} height={40} style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.link_url}</Text>
          </Space>
        </Space>
      ),
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sort_order',
      sorter: (a, b) => a.sort_order - b.sort_order,
      width: 80,
      search: false,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      width: 120,
      valueEnum: {
        true:  { text: 'Hiển thị', status: 'Success' },
        false: { text: 'Ẩn',       status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.is_active ? 'green' : 'default'} style={{ fontSize: 12 }}>
          {record.is_active ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 110,
      render: (_, record, __, action) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true); }} />
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true); }} />
          <Popconfirm
            title="Xóa banner này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try {
                await adminApi.deleteBanner(record.id);
                message.success('Đã xóa banner thành công');
                action?.reload();
              } catch (err) {
                console.error(err);
                message.error('Không thể xóa banner');
              }
            }}
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
        request={async () => {
          try {
            const res = await adminApi.getAllBanners();
            const raw = res.data?.data;
            return { data: Array.isArray(raw) ? raw : [], success: true };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách banner');
            return { data: [], success: false };
          }
        }}
        rowKey="id"
        search={false}
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
        initialValues={currentRecord ? { ...currentRecord, is_active: String(currentRecord.is_active) } : { is_active: 'true', sort_order: 1 }}
        onFinish={async (values) => {
          try {
            const payload = { ...values, is_active: values.is_active === 'true' };
            if (currentRecord) {
              await adminApi.updateBanner(currentRecord.id, payload);
              message.success('Đã cập nhật banner thành công');
            } else {
              await adminApi.createBanner(payload);
              message.success('Đã thêm banner mới thành công');
            }
            setModalVisit(false);
            return true;
          } catch (err) {
            console.error(err);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
            return false;
          }
        }}
        modalProps={{ destroyOnClose: true, centered: true }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Thêm mới', resetText: 'Hủy' } }}
      >
        <ProFormText name="title" label="Tiêu đề banner" placeholder="Nhập tiêu đề..." rules={[{ required: true }]} />
        <ProFormText name="image_url" label="URL Hình ảnh" placeholder="https://..." rules={[{ required: true }]} />
        <ProFormText name="link_url" label="Đường dẫn liên kết" placeholder="/tours hoặc https://..." />
        <ProFormText name="sort_order" label="Thứ tự hiển thị" placeholder="1" />
        <ProFormSelect name="is_active" label="Trạng thái" valueEnum={{ true: 'Hiển thị', false: 'Ẩn' }} rules={[{ required: true }]} />
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
              <Image src={currentRecord.image_url} style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tiêu đề" span={2}>{currentRecord.title}</Descriptions.Item>
              <Descriptions.Item label="Liên kết" span={2}>{currentRecord.link_url}</Descriptions.Item>
              <Descriptions.Item label="Thứ tự">{currentRecord.sort_order}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={currentRecord.is_active ? 'green' : 'default'}>
                  {currentRecord.is_active ? 'Hiển thị' : 'Ẩn'}
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
