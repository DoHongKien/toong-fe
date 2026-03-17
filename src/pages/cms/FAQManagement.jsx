import { useState } from 'react';
import { ProTable, ModalForm, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm, Modal, Divider, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const FAQ_DATA = [
  { id: 1, question: 'Tour có bao gồm bảo hiểm không?',   answer: 'Có, toàn bộ tour đều bao gồm bảo hiểm du lịch trong suốt hành trình.', order: 1 },
  { id: 2, question: 'Cần chuẩn bị gì khi đi trekking?', answer: 'Bạn cần chuẩn bị giày trekking, trang phục thoải mái, bình nước và thuốc cá nhân.', order: 2 },
  { id: 3, question: 'Có thể hủy tour trước bao lâu?',    answer: 'Bạn có thể hủy tour trước 7 ngày mà không mất phí cọc.', order: 3 },
];

const FAQManagement = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      ellipsis: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{record.question}</Text>
          <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{record.answer}</Text>
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
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 110,
      render: (_, record) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setShowDetail(true); }} />
          <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setModalVisit(true); }} />
          <Popconfirm
            title="Xóa câu hỏi này?" description="Hành động này không thể hoàn tác."
            onConfirm={() => message.success('Đã xóa câu hỏi')} okText="Xác nhận xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
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
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Quản lý FAQ</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Thêm và chỉnh sửa các câu hỏi thường gặp hiển thị trên trang web.</Text>
      </div>

      <ProTable
        columns={columns}
        headerTitle={<Text strong style={{ fontSize: 15 }}>Danh sách câu hỏi</Text>}
        request={async () => ({ data: FAQ_DATA, success: true })}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setCurrentRecord(null); setModalVisit(true); }}>
            Thêm câu hỏi
          </Button>,
        ]}
        cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
      />

      <ModalForm
        title={currentRecord ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi FAQ mới'}
        open={modalVisit}
        onOpenChange={setModalVisit}
        initialValues={currentRecord || { order: FAQ_DATA.length + 1 }}
        onFinish={async (values) => { console.log(values); message.success(currentRecord ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi mới'); return true; }}
        modalProps={{ destroyOnClose: true, centered: true, width: 620 }}
        submitter={{ searchConfig: { submitText: currentRecord ? 'Lưu thay đổi' : 'Thêm mới', resetText: 'Hủy' } }}
      >
        <ProFormTextArea name="question" label="Câu hỏi" placeholder="Nhập câu hỏi thường gặp..." rules={[{ required: true }]} fieldProps={{ rows: 2 }} />
        <ProFormTextArea name="answer" label="Câu trả lời" placeholder="Nhập nội dung trả lời..." rules={[{ required: true }]} fieldProps={{ rows: 4 }} />
        <ProFormDigit name="order" label="Thứ tự" min={1} width="xs" />
      </ModalForm>

      <Modal
        title={currentRecord ? 'Chi tiết câu hỏi' : ''}
        open={showDetail}
        onCancel={() => { setShowDetail(false); setCurrentRecord(null); }}
        centered width={600} footer={null} destroyOnClose
      >
        {currentRecord?.id && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #0D2E2A 0%, #1F4529 100%)',
              borderRadius: 8, padding: '14px 18px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Câu hỏi #{currentRecord.order}</Text>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, maxWidth: 400 }}>{currentRecord.question}</div>
              </div>
            </div>
            <Text strong>Câu trả lời:</Text>
            <div style={{ marginTop: 8, padding: '12px 16px', background: '#f7f8fa', borderRadius: 6 }}>
              <Text>{currentRecord.answer}</Text>
            </div>
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

export default FAQManagement;
