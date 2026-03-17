import { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormMoney, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Space, Popconfirm, Tag, Typography, Modal, Descriptions, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CrownOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Title, Text } = Typography;

// Removed static PASS_DATA

const themeConfig = {
  'bg-green':  { label: 'Green (Trial)',     gradient: 'linear-gradient(135deg, #389e0d, #52c41a)' },
  'bg-orange': { label: 'Orange (Sharing)',  gradient: 'linear-gradient(135deg, #d46b08, #ffa940)' },
  'bg-dark':   { label: 'Dark (Adventure)', gradient: 'linear-gradient(135deg, #0D2E2A, #1F4529)' },
};

const PassManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Gói Pass',
      dataIndex: 'title',
      render: (_, record) => {
        const theme = themeConfig[record.color_theme] || {};
        return (
          <Space>
            <div style={{
              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
              background: theme.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CrownOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 13 }}>{record.title} <Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>{record.subtitle}</Text></Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.perks}</Text>
            </Space>
          </Space>
        );
      },
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Giá niêm yết',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      width: 160,
      render: (price) => (
        price === 0
          ? <Tag color="green" style={{ fontSize: 12 }}>Miễn phí</Tag>
          : <Text strong style={{ color: '#1F4529', fontSize: 13 }}>{price.toLocaleString('vi-VN')}đ</Text>
      ),
    },
    {
      title: 'Theme',
      dataIndex: 'color_theme',
      width: 160,
      render: (_, record) => {
        const theme = themeConfig[record.color_theme] || {};
        return (
          <Space>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: theme.gradient }} />
            <Text style={{ fontSize: 12 }}>{theme.label}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 110,
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
          <Popconfirm
            title="Xóa gói Pass này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try {
                await adminApi.deletePass(record.id);
                message.success('Đã xóa gói Pass thành công');
                action?.reload();
              } catch (err) {
                console.error(err);
                message.error('Không thể xóa');
              }
            }}
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Adventure Pass</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Cấu hình các gói hội viên, giá cả và quyền lợi đi kèm.</Text>
      </div>

      {/* ── Table ── */}
      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách gói Pass</Text>}
        request={async () => {
          try {
            const res = await adminApi.getAllPasses();
            return { data: res.data?.data || [], success: true };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách Pass');
            return { data: [], success: false };
          }
        }}
        rowKey="id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setCurrentRecord(null); setModalVisit(true); }}
          >
            Thêm gói mới
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Add / Edit Modal ── */}
      <ModalForm
        title={currentRecord ? 'Cập nhật gói Pass' : 'Tạo gói Pass mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { subtitle: 'Pass' }}
        onFinish={async (values) => {
          try {
            if (currentRecord) {
              await adminApi.updatePass(currentRecord.id, values);
              message.success('Đã cập nhật gói Pass thành công');
            } else {
              await adminApi.createPass(values);
              message.success('Đã tạo gói Pass mới thành công');
            }
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
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Tạo gói', resetText: 'Hủy' } }}
      >
        <ProFormText name="title" label="Tên gói (VD: ADVENTURE)" rules={[{ required: true }]} />
        <ProFormText name="subtitle" label="Phụ đề (VD: Pass)" />
        <ProFormMoney name="price" label="Giá bán" locale="vi-VN" rules={[{ required: true }]} />
        <ProFormSelect
          name="color_theme"
          label="Màu sắc chủ đạo"
          options={[
            { label: 'Green (Trial)',    value: 'bg-green'  },
            { label: 'Orange (Sharing)', value: 'bg-orange' },
            { label: 'Dark (Adventure)', value: 'bg-dark'   },
          ]}
        />
        <ProFormText name="perks" label="Quyền lợi" placeholder="Mô tả ngắn về quyền lợi..." />
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Chi tiết gói: ${currentRecord.title}` : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered
        width={560}
        footer={null}
        destroyOnClose
      >
        {currentRecord?.id && (
          <>
            {/* Summary strip */}
            <div style={{
              background: themeConfig[currentRecord.color_theme]?.gradient || 'linear-gradient(135deg, #0D2E2A, #1F4529)',
              borderRadius: 8, padding: '20px 24px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CrownOutlined style={{ color: '#fff', fontSize: 28 }} />
              </div>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Gói hội viên</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>
                  {currentRecord.title} <span style={{ fontWeight: 400, fontSize: 16 }}>{currentRecord.subtitle}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                  {currentRecord.price === 0 ? 'Miễn phí' : `${currentRecord.price.toLocaleString('vi-VN')}đ`}
                </div>
              </div>
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên gói">{currentRecord.title} {currentRecord.subtitle}</Descriptions.Item>
              <Descriptions.Item label="Giá niêm yết">
                {currentRecord.price === 0
                  ? <Tag color="green">Miễn phí</Tag>
                  : <Text strong style={{ color: '#1F4529' }}>{currentRecord.price.toLocaleString('vi-VN')}đ</Text>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Theme">{themeConfig[currentRecord.color_theme]?.label}</Descriptions.Item>
              <Descriptions.Item label="Quyền lợi">{currentRecord.perks}</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => { setShowDetail(false); setModalVisit(true); }}>
                Chỉnh sửa
              </Button>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default PassManagement;
