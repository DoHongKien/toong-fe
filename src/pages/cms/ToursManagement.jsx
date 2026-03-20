import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProTable } from '@ant-design/pro-components';
import {
  Button, Tag, Space, message, Popconfirm, Modal, Descriptions,
  Divider, Typography, Upload, Spin, Form, Row, Col, Input,
  Select, InputNumber, Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EnvironmentOutlined, InboxOutlined, PictureOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const difficultyStyle = {
  'Dễ':       { color: 'green',  bg: 'rgba(82,196,26,0.1)' },
  'Vừa phải': { color: 'orange', bg: 'rgba(250,140,22,0.1)' },
  'Thử thách':{ color: 'red',    bg: 'rgba(255,77,79,0.1)' },
};

const regionLabel = { nam: 'Miền Nam', trung: 'Miền Trung', taynguyen: 'Tây Nguyên' };

/* ─── Section label helper ─── */
const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '0.6px',
    textTransform: 'uppercase', color: '#1a3d2e',
    borderLeft: '3px solid #4caf50', paddingLeft: 8,
    marginBottom: 12, marginTop: 4,
  }}>{children}</div>
)

/* ─── Tour Add/Edit Form ─── */
const TourForm = ({ record, cardImagePreview, uploading, onImageUpload, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleFinish = async (values) => {
    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (err) {
      console.error(err)
      message.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={record || { region: 'nam', difficulty: 'Vừa phải' }}
      onFinish={handleFinish}
      requiredMark={false}
    >
      <Row style={{ minHeight: 520 }}>
        {/* ── Left: Image Panel ── */}
        <Col
          flex="220px"
          style={{
            background: '#f7f8f5',
            borderRight: '1px solid #eee',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>Ảnh Card Tour</div>

          {/* Image preview or placeholder */}
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            borderRadius: 10,
            overflow: 'hidden',
            background: '#e8e8e8',
            border: '1px dashed #ccc',
            position: 'relative',
          }}>
            {cardImagePreview ? (
              <img
                src={cardImagePreview}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: '#bbb', gap: 6,
              }}>
                <PictureOutlined style={{ fontSize: 32 }} />
                <span style={{ fontSize: 12 }}>Chưa có ảnh</span>
              </div>
            )}
          </div>

          {/* Upload trigger */}
          <Dragger
            name="file"
            accept="image/*"
            multiple={false}
            showUploadList={false}
            beforeUpload={onImageUpload}
            style={{ width: '100%', borderRadius: 8 }}
          >
            {uploading ? (
              <div style={{ padding: '10px 0' }}><Spin size="small" /></div>
            ) : (
              <>
                <p className="ant-upload-drag-icon" style={{ marginBottom: 2, fontSize: 20 }}><InboxOutlined /></p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Kéo thả hoặc click</p>
                <p style={{ fontSize: 11, color: '#aaa', margin: '2px 0 0' }}>JPG, PNG, WEBP</p>
              </>
            )}
          </Dragger>

          {cardImagePreview && (
            <div style={{ fontSize: 11, color: '#52c41a', textAlign: 'center', fontWeight: 500 }}>
              Ảnh đã được tải lên
            </div>
          )}
        </Col>

        {/* ── Right: Form Fields ── */}
        <Col flex="1" style={{ padding: '24px 28px', overflowY: 'auto', maxHeight: 520 }}>
          <SectionLabel>Thông tin cơ bản</SectionLabel>
          <Form.Item
            name="name"
            label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên Tour</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên tour' }]}
            style={{ marginBottom: 14 }}
          >
            <Input placeholder="VD: Tà Năng - Phan Dũng" size="middle" />
          </Form.Item>

          <Form.Item
            name="slug"
            label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>URL Slug</span>}
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
            style={{ marginBottom: 14 }}
          >
            <Input placeholder="ta-nang-phan-dung" size="middle" />
          </Form.Item>

          <Form.Item
            name="region"
            label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Khu vực</span>}
            rules={[{ required: true }]}
            style={{ marginBottom: 6 }}
          >
            <Select size="middle" options={[
              { value: 'nam',       label: 'Miền Nam' },
              { value: 'trung',     label: 'Miền Trung' },
              { value: 'taynguyen', label: 'Tây Nguyên' },
            ]} />
          </Form.Item>

          <Divider style={{ margin: '14px 0 10px' }} />
          <SectionLabel>Thời gian &amp; Phân loại</SectionLabel>

          <Row gutter={12} style={{ marginBottom: 6 }}>
            <Col span={12}>
              <Form.Item
                name="durationDays"
                label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Số ngày</span>}
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber min={0} style={{ width: '100%' }} size="middle" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="durationNights"
                label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Số đêm</span>}
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber min={0} style={{ width: '100%' }} size="middle" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="difficulty"
            label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Độ khó</span>}
            rules={[{ required: true }]}
            style={{ marginBottom: 6, marginTop: 14 }}
          >
            <Select size="middle" options={[
              { value: 'Rất dễ',    label: 'Rất dễ' },
              { value: 'Dễ',       label: 'Dễ' },
              { value: 'Vừa phải', label: 'Vừa phải' },
              { value: 'Khó',      label: 'Khó' },
              { value: 'Thử thách',label: 'Thử thách' },
            ]} />
          </Form.Item>

          <Divider style={{ margin: '14px 0 10px' }} />
          <SectionLabel>Giá &amp; Nhãn</SectionLabel>

          <Row gutter={12} style={{ marginBottom: 6 }}>
            <Col span={14}>
              <Form.Item
                name="basePrice"
                label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Giá gốc (VNĐ)</span>}
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  min={0}
                  step={100000}
                  style={{ width: '100%' }}
                  size="middle"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(v) => v?.replace(/,/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="badge"
                label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Nhãn</span>}
                style={{ marginBottom: 0 }}
              >
                <Select size="middle" allowClear placeholder="Không có" options={[
                  { value: 'Best Seller', label: 'Best Seller' },
                  { value: 'New',         label: 'New' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '14px 0 10px' }} />
          <SectionLabel>Mô tả</SectionLabel>

          <Form.Item
            name="summary"
            label={<span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Mô tả tóm tắt</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            style={{ marginBottom: 0 }}
          >
            <TextArea
              placeholder="Nhập mô tả ngắn hiện trên card tour..."
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* ── Footer ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        padding: '14px 24px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa',
        borderRadius: '0 0 8px 8px',
      }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={submitting} style={{ background: '#1F4529', borderColor: '#1F4529' }}>
          {record ? 'Lưu thay đổi' : 'Tạo Tour'}
        </Button>
      </div>
    </Form>
  )
}

const ToursManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [uploadedCardImage, setUploadedCardImage] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate()

  const handleImageUpload = async (file) => {
    setUploading(true)
    try {
      const res = await adminApi.uploadImage(file)
      const objectName = res.data?.data?.objectName
      if (!objectName) throw new Error('No objectName returned')
      setUploadedCardImage(objectName)
      // Build a preview URL via the Spring Boot proxy endpoint
      setCardImagePreview(`http://localhost:8080/api/v1/media/preview?object=${encodeURIComponent(objectName)}`)
      message.success('Tải ảnh lên thành công')
    } catch (err) {
      console.error(err)
      message.error('Tải ảnh thất bại, vui lòng thử lại')
    } finally {
      setUploading(false)
    }
    // Return false to prevent antd from auto-uploading
    return false
  }

  const handleOpenModal = (record) => {
    setCurrentRecord(record)
    setUploadedCardImage(null)
    setCardImagePreview(record?.cardImage || null)
    setModalVisit(true)
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'cardImage',
      search: false,
      width: 64,
      render: (cardImage, record) =>
        cardImage ? (
          <img
            src={cardImage}
            alt={record.name}
            style={{
              width: 48,
              height: 48,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #eee',
              display: 'block',
            }}
          />
        ) : null,
    },
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
      dataIndex: 'durationDays',
      render: (_, record) => (
        <Text style={{ fontSize: 13 }}>{record.durationDays}N{record.durationNights}Đ</Text>
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
      dataIndex: 'basePrice',
      sorter: (a, b) => a.basePrice - b.basePrice,
      search: false,
      width: 130,
      render: (price) => (
        <Text strong style={{ color: '#1F4529', fontSize: 13 }}>
          {(price ?? 0).toLocaleString('vi-VN')}đ
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
      render: (_, record, __, action) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button
              size="small" type="default" icon={<EyeOutlined />}
              onClick={() => { setCurrentRecord(record); setCardImagePreview(record?.cardImage || null); setShowDetail(true); }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small" type="primary" icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Quản lý FAQ tour">
            <Button
              size="small"
              icon={<QuestionCircleOutlined />}
              style={{ color: '#1F4529', borderColor: '#1F4529' }}
              onClick={() => navigate(`/cms/tours/${record.id}/faqs`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tour này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={async () => {
              try {
                await adminApi.deleteTour(record.id);
                message.success('Đã xóa tour thành công');
                action?.reload();
              } catch (err) {
                console.error(err);
                message.error('Không thể xóa tour');
              }
            }}
            okText="Xác nhận xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa tour">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
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
        scroll={{ x: 'max-content' }}
        request={async ({ current, pageSize, ...rest }) => {
          try {
            const res = await adminApi.getAllTours({ page: current, limit: pageSize, ...rest });
            const payload = res.data?.data;
            const list = Array.isArray(payload?.data) ? payload.data : [];
            return {
              data: list,
              success: true,
              total: payload?.pagination?.total ?? list.length,
            };
          } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách tour');
            return { data: [], success: false };
          }
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
      <Modal
        title={null}
        open={modalVisit}
        onCancel={() => { setModalVisit(false); setUploadedCardImage(null); setCardImagePreview(null) }}
        centered
        width={Math.min(920, window.innerWidth * 0.96)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
          padding: '18px 24px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 4, height: 20, background: '#8bc34a', borderRadius: 4 }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
            {currentRecord ? 'Cập nhật thông tin Tour' : 'Thêm Tour Trekking mới'}
          </span>
        </div>

        {/* Body */}
        <TourForm
          key={currentRecord?.id ?? 'new'}
          record={currentRecord}
          cardImagePreview={cardImagePreview}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          onCancel={() => { setModalVisit(false); setUploadedCardImage(null); setCardImagePreview(null) }}
          onSubmit={async (values) => {
            const payload = { ...values }
            if (uploadedCardImage) payload.cardImage = uploadedCardImage
            if (currentRecord) {
              await adminApi.updateTour(currentRecord.id, payload)
              message.success('Đã cập nhật tour thành công')
            } else {
              await adminApi.createTour(payload)
              message.success('Đã tạo tour mới thành công')
            }
            setModalVisit(false)
            window.location.reload()
          }}
        />
      </Modal>

      {/* ── Detail Modal ── */}
      <Modal
        title={null}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); setCardImagePreview(null) }}
        centered
        width={Math.min(820, window.innerWidth * 0.96)}
        footer={null}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {currentRecord?.id && (
          <>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
              padding: '18px 24px',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ width: 4, height: 20, background: '#8bc34a', borderRadius: 4 }} />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Chi tiết Tour</span>
              {currentRecord.badge && (
                <Tag color={currentRecord.badge === 'Best Seller' ? 'gold' : 'volcano'} style={{ marginLeft: 6, fontSize: 11 }}>
                  {currentRecord.badge}
                </Tag>
              )}
            </div>

            {/* Body — 2 columns */}
            <Row style={{ minHeight: 420 }}>
              {/* Left: Image */}
              <Col
                flex="220px"
                style={{
                  background: '#f7f8f5',
                  borderRight: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px 16px',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#888' }}>Ảnh Card</div>
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#e8e8e8',
                  border: '1px solid #ddd',
                }}>
                  {currentRecord.cardImage ? (
                    <img
                      src={currentRecord.cardImage}
                      alt={currentRecord.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#bbb', gap: 6,
                    }}>
                      <PictureOutlined style={{ fontSize: 32 }} />
                      <span style={{ fontSize: 12 }}>Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                {/* Price badge */}
                <div style={{
                  width: '100%',
                  background: '#1F4529',
                  borderRadius: 8,
                  padding: '10px 14px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>Giá gốc</div>
                  <div style={{ color: '#e8f5e9', fontWeight: 700, fontSize: 16 }}>
                    {(currentRecord.basePrice ?? 0).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </Col>

              {/* Right: Info */}
              <Col flex="1" style={{ padding: '24px 28px' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>{currentRecord.name}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 4, fontFamily: 'monospace' }}>{currentRecord.slug}</div>
                </div>

                <Divider style={{ margin: '0 0 14px' }} />
                <SectionLabel>Thông tin chuyến đi</SectionLabel>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                  {[
                    { label: 'Khu vực',    value: regionLabel[currentRecord.region] },
                    { label: 'Thời lượng', value: `${currentRecord.durationDays} ngày ${currentRecord.durationNights} đêm` },
                    { label: 'Độ khó',     value: (
                      <Tag color={
                        currentRecord.difficulty === 'Thử thách' ? 'red'
                          : currentRecord.difficulty === 'Khó' ? 'orange'
                          : currentRecord.difficulty === 'Vừa phải' ? 'gold'
                          : 'green'
                      }>{currentRecord.difficulty}</Tag>
                    )},
                    { label: 'ID Tour',    value: `#${currentRecord.id}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
                </div>

                <Divider style={{ margin: '0 0 14px' }} />
                <SectionLabel>Mô tả tóm tắt</SectionLabel>
                <div style={{
                  background: '#f7f8fa',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: '#555',
                  lineHeight: 1.7,
                  border: '1px solid #eee',
                }}>
                  {currentRecord.summary || <span style={{ color: '#bbb' }}>Chưa có mô tả.</span>}
                </div>
              </Col>
            </Row>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              padding: '14px 24px',
              borderTop: '1px solid #f0f0f0',
              background: '#fafafa',
              borderRadius: '0 0 8px 8px',
            }}>
              <Button onClick={() => setShowDetail(false)}>Đóng</Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{ background: '#1F4529', borderColor: '#1F4529' }}
                onClick={() => { setShowDetail(false); handleOpenModal(currentRecord) }}
              >
                Chỉnh sửa ngay
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ToursManagement;
