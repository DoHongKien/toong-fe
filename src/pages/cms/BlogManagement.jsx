import { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Space, Tag, message, Popconfirm, Modal, Descriptions, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Text, Title } = Typography;

const BlogManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Bài viết',
      dataIndex: 'title',
      ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Tác giả: {record.author}</Text>
        </Space>
      ),
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        published: { text: 'Đã đăng',  status: 'Success' },
        draft:     { text: 'Bản nháp', status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'published' ? 'green' : 'default'} style={{ fontSize: 12 }}>
          {record.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'publishedAt',
      valueType: 'date',
      search: false,
      width: 120,
      render: (_, record) => record.publishedAt
        ? new Date(record.publishedAt).toLocaleDateString('vi-VN')
        : <Text type="secondary">—</Text>,
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
            title="Xóa bài viết này?" description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try {
                await adminApi.deleteBlogPost(record.id);
                message.success('Đã xóa bài viết');
                action?.reload();
              } catch (err) {
                console.error(err);
                message.error('Không thể xóa bài viết');
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Blog / Tin tức</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Viết và quản lý các bài viết kinh nghiệm, tin tức cho trang web.</Text>
      </div>

      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách bài viết</Text>}
        request={async (params) => {
          try {
            const res = await adminApi.getAllBlogPosts(params);
            const raw = res.data?.data?.data;
            return {
              data: Array.isArray(raw) ? raw : [],
              success: true,
              total: res.data?.data?.pagination?.total ?? 0,
            };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách bài viết');
            return { data: [], success: false };
          }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrentRecord(null); setModalVisit(true); }}>
            Viết bài mới
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      <ModalForm
        title={currentRecord ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { status: 'draft' }}
        onFinish={async (values) => {
          try {
            if (currentRecord) {
              await adminApi.updateBlogPost(currentRecord.id, values);
              message.success('Đã cập nhật bài viết');
            } else {
              await adminApi.createBlogPost(values);
              message.success('Đã tạo bài viết mới');
            }
            setModalVisit(false);
            return true;
          } catch (err) {
            console.error(err);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
            return false;
          }
        }}
        modalProps={{ destroyOnClose: true, centered: true, width: 680 }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Tạo bài viết', resetText: 'Hủy' } }}
      >
        <ProFormText name="title" label="Tiêu đề" placeholder="Nhập tiêu đề..." rules={[{ required: true }]} />
        <ProFormText name="slug" label="URL Slug" placeholder="kinh-nghiem-trekking-ta-nang" rules={[{ required: true }]} />
        <ProFormText name="thumbnail" label="Ảnh thumbnail" placeholder="https://..." />
        <ProFormSelect name="status" label="Trạng thái" valueEnum={{ published: 'Đã đăng', draft: 'Bản nháp' }} rules={[{ required: true }]} />
        <ProFormTextArea name="content" label="Nội dung (HTML)" placeholder="<p>Nội dung...</p>" rules={[{ required: true }]} fieldProps={{ rows: 5 }} />
      </ModalForm>

      <Modal
        title={currentRecord ? `Chi tiết: ${currentRecord.title}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered width={680} footer={null} destroyOnClose
      >
        {currentRecord?.id && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
              borderRadius: 8, padding: '14px 18px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Bài viết</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, maxWidth: 360 }}>{currentRecord.title}</div>
              </div>
              <Tag color={currentRecord.status === 'published' ? 'green' : 'default'} style={{ fontSize: 11 }}>
                {currentRecord.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
              </Tag>
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tác giả">{currentRecord.author}</Descriptions.Item>
              <Descriptions.Item label="URL Slug">{currentRecord.slug}</Descriptions.Item>
              <Descriptions.Item label="Ngày đăng" span={2}>
                {currentRecord.publishedAt ? new Date(currentRecord.publishedAt).toLocaleDateString('vi-VN') : '—'}
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

export default BlogManagement;
