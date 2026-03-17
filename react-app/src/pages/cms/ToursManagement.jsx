import React, { useState } from 'react';
import { ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea, ProFormMoney } from '@ant-design/pro-components';
import { Button, Tag, Space, message, Popconfirm, Modal, Descriptions, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TOURS_DATA = [
  {
    id: 1,
    name: 'Tà Năng - Phan Dũng',
    slug: 'ta-nang-phan-dung',
    region: 'nam',
    duration_days: 3,
    duration_nights: 2,
    difficulty: 'Thử thách',
    base_price: 3500000,
    badge: 'Best Seller',
    summary: 'Cung đường trekking đẹp nhất Việt Nam, vượt qua những thảo nguyên cỏ vàng mênh mông tuyệt đẹp.',
  },
  {
    id: 2,
    name: 'Bidoup - Núi Bà',
    slug: 'bidoup-nui-ba',
    region: 'nam',
    duration_days: 2,
    duration_nights: 1,
    difficulty: 'Vừa phải',
    base_price: 1800000,
    badge: 'New',
    summary: 'Khám phá nóc nhà tỉnh Lâm Đồng, nơi có hệ sinh thái rừng thông nguyên sinh đặc sắc.',
  },
  {
    id: 3,
    name: 'Cung Đường Gia Lai',
    slug: 'cung-duong-gia-lai',
    region: 'taynguyen',
    duration_days: 4,
    duration_nights: 3,
    difficulty: 'Thử thách',
    base_price: 4200000,
    badge: null,
    summary: 'Hành trình khám phá đại ngàn Tây Nguyên hùng vĩ với những cánh rừng già bí ẩn.',
  },
];

const difficultyStyle = {
  'Dễ':       { color: 'green',  bg: 'rgba(82,196,26,0.1)' },
  'Vừa phải': { color: 'orange', bg: 'rgba(250,140,22,0.1)' },
  'Thử thách':{ color: 'red',    bg: 'rgba(255,77,79,0.1)' },
};

const regionLabel = { nam: 'Miền Nam', trung: 'Miền Trung', taynguyen: 'Tây Nguyên' };

const ToursManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Tên Tour',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: { rules: [{ required: true, message: 'Vui lòng nhập tên tour' }] },
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.slug}</Text>
        </Space>
      ),
    },
    {
      title: 'Khu vực',
      dataIndex: 'region',
      valueType: 'select',
      width: 110,
      valueEnum: {
        'nam':       { text: 'Miền Nam' },
        'trung':     { text: 'Miền Trung' },
        'taynguyen': { text: 'Tây Nguyên' },
      },
      render: (_, record) => (
        <Tag icon={<EnvironmentOutlined />} color="default" style={{ fontSize: 12 }}>
          {regionLabel[record.region]}
        </Tag>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      render: (_, record) => (
        <Text style={{ fontSize: 13 }}>{record.duration_days}N{record.duration_nights}Đ</Text>
      ),
      search: false,
      width: 90,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      valueType: 'select',
      width: 110,
      valueEnum: {
        'Dễ':        { text: 'Dễ',        status: 'Success' },
        'Vừa phải':  { text: 'Vừa phải',  status: 'Warning' },
        'Thử thách': { text: 'Thử thách', status: 'Error'   },
      },
      render: (_, record) => {
        const s = difficultyStyle[record.difficulty] || {};
        return (
          <Tag
            color={record.difficulty === 'Thử thách' ? 'red' : record.difficulty === 'Vừa phải' ? 'orange' : 'green'}
            style={{ fontSize: 12 }}
          >
            {record.difficulty}
          </Tag>
        );
      },
    },
    {
      title: 'Giá gốc',
      dataIndex: 'base_price',
      sorter: (a, b) => a.base_price - b.base_price,
      search: false,
      width: 130,
      render: (price) => (
        <Text strong style={{ color: '#1F4529', fontSize: 13 }}>
          {price.toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Nhãn',
      dataIndex: 'badge',
      width: 110,
      valueEnum: {
        'Best Seller': { text: 'Best Seller', status: 'Warning' },
        'New':         { text: 'Mới',         status: 'Error'   },
      },
      render: (_, record) =>
        record.badge ? (
          <Tag color={record.badge === 'Best Seller' ? 'gold' : 'volcano'} style={{ fontSize: 11 }}>
            {record.badge === 'Best Seller' ? '🏆 Best Seller' : '🆕 New'}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        ),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small" type="default" icon={<EyeOutlined />}
            onClick={() => { setCurrentRecord(record); setShowDetail(true); }}
          />
          <Button
            size="small" type="primary" icon={<EditOutlined />}
            onClick={() => { setCurrentRecord(record); setModalVisit(true); }}
          />
          <Popconfirm
            title="Xóa tour này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success('Đã xóa tour thành công')}
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý Tour Trekking</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Xem, thêm mới, chỉnh sửa và quản lý toàn bộ danh sách tour.</Text>
      </div>

      {/* ── Table ── */}
      <ProTable
        columns={columns}
        request={async (params) => {
          console.log(params);
          return { data: TOURS_DATA, success: true };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách Tour</Text>}
        toolBarRender={() => [
          <Button
            key="add"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => { setCurrentRecord(null); setModalVisit(true); }}
          >
            Thêm tour mới
          </Button>,
        ]}
        style={{ borderRadius: 10 }}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      {/* ── Add / Edit Modal ── */}
      <ModalForm
        title={currentRecord ? 'Cập nhật thông tin Tour' : 'Thêm Tour Trekking mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { region: 'nam', difficulty: 'Vừa phải' }}
        onFinish={async (values) => {
          console.log(values);
          message.success(currentRecord ? 'Đã cập nhật tour thành công' : 'Đã tạo tour mới thành công');
          return true;
        }}
        modalProps={{ destroyOnClose: true, centered: true, width: 800 }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        submitter={{
          searchConfig: {
            submitText: currentRecord ? 'Lưu thay đổi' : 'Tạo Tour',
            resetText: 'Hủy',
          },
        }}
      >
        <ProFormText name="name" label="Tên Tour" placeholder="VD: Tà Năng - Phan Dũng" rules={[{ required: true }]} />
        <ProFormText name="slug" label="URL Slug" placeholder="ta-nang-phan-dung" rules={[{ required: true }]} />
        <ProFormSelect
          name="region"
          label="Khu vực"
          valueEnum={{ 'nam': 'Miền Nam', 'trung': 'Miền Trung', 'taynguyen': 'Tây Nguyên' }}
          rules={[{ required: true }]}
        />
        <Space style={{ display: 'flex', marginBottom: 16, marginLeft: '25%' }} align="baseline">
          <ProFormDigit label="Số ngày" name="duration_days" width="xs" min={0} rules={[{ required: true }]} />
          <ProFormDigit label="Số đêm" name="duration_nights" width="xs" min={0} rules={[{ required: true }]} />
        </Space>
        <ProFormSelect
          name="difficulty"
          label="Độ khó"
          valueEnum={{ 'Dễ': 'Dễ', 'Vừa phải': 'Vừa phải', 'Thử thách': 'Thử thách' }}
          rules={[{ required: true }]}
        />
        <ProFormMoney name="base_price" label="Giá gốc" locale="vi-VN" placeholder="Nhập giá tour..." rules={[{ required: true }]} />
        <ProFormSelect
          name="badge"
          label="Nhãn (Badge)"
          valueEnum={{ 'none': 'Không có', 'Best Seller': 'Best Seller', 'New': 'Mới (New)' }}
        />
        <ProFormTextArea name="summary" label="Mô tả tóm tắt" placeholder="Nhập mô tả ngắn hiện trên card tour..." rules={[{ required: true }]} />
      </ModalForm>

      {/* ── Detail Modal ── */}
      <Modal
        title={currentRecord ? `Chi tiết Tour: ${currentRecord.name}` : ''}
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
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Tour trekking</Text>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{currentRecord.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#E8ECD7', fontSize: 20, fontWeight: 700 }}>
                  {currentRecord.base_price.toLocaleString('vi-VN')}đ
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>/ người</Text>
              </div>
            </div>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Khu vực">{regionLabel[currentRecord.region]}</Descriptions.Item>
              <Descriptions.Item label="Thời lượng">{currentRecord.duration_days}N {currentRecord.duration_nights}Đ</Descriptions.Item>
              <Descriptions.Item label="Độ khó">
                <Tag color={currentRecord.difficulty === 'Thử thách' ? 'red' : currentRecord.difficulty === 'Vừa phải' ? 'orange' : 'green'}>
                  {currentRecord.difficulty}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nhãn">
                {currentRecord.badge ? <Tag color="gold">{currentRecord.badge}</Tag> : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="URL Slug" span={2}>{currentRecord.slug}</Descriptions.Item>
            </Descriptions>

            <Divider />
            <Text strong>Mô tả tóm tắt</Text>
            <div style={{ marginTop: 8, padding: '10px 14px', background: '#f7f8fa', borderRadius: 6 }}>
              <Text type="secondary">{currentRecord.summary}</Text>
            </div>

            <Divider />
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => { setShowDetail(false); setModalVisit(true); }}
              >
                Chỉnh sửa ngay
              </Button>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
};

export default ToursManagement;
