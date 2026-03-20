import { useState, useEffect } from 'react'
import {
  Table, Button, Modal, Form, Select, Tag, Switch,
  Popconfirm, Typography, Space, message, Card,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

const NOTIF_TYPE_LABELS = {
  booking: { label: 'Booking', color: 'blue' },
  contact: { label: 'Liên hệ', color: 'green' },
  pass:    { label: 'Adventure Pass', color: 'gold' },
}
const TARGET_TYPE_LABELS = {
  all:      'Tất cả',
  role:     'Theo vai trò',
  employee: 'Nhân viên cụ thể',
}

const NotificationConfig = () => {
  const [configs, setConfigs]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [modalOpen, setModalOpen]     = useState(false)
  const [editRecord, setEditRecord]   = useState(null)
  const [submitting, setSubmitting]   = useState(false)
  const [roles, setRoles]             = useState([])
  const [employees, setEmployees]     = useState([])
  const [selectedTargetType, setSelectedTargetType] = useState(null)
  const [form]                        = Form.useForm()

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getNotificationConfigs()
      setConfigs(res.data?.data ?? [])
    } catch {
      message.error('Không thể tải danh sách cấu hình')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchConfigs()
    Promise.all([
      adminApi.getAllRoles()
        .then(r => {
          const data = r.data?.data
          setRoles(Array.isArray(data) ? data : [])
        })
        .catch(() => {}),
      adminApi.getAllEmployeesFlat()
        .then(r => setEmployees(r.data?.data ?? []))
        .catch(() => {}),
    ])
  }, [])



  const openCreate = () => {
    setEditRecord(null)
    setSelectedTargetType(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditRecord(record)
    setSelectedTargetType(record.targetType)
    form.setFieldsValue({
      notifType:  record.notifType,
      targetType: record.targetType,
      targetId:   record.targetId ?? undefined,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (values.targetType === 'all') values.targetId = null
    setSubmitting(true)
    try {
      if (editRecord) {
        await adminApi.updateNotificationConfig(editRecord.id, values)
        message.success('Đã cập nhật cấu hình')
      } else {
        await adminApi.createNotificationConfig(values)
        message.success('Đã tạo cấu hình mới')
      }
      setModalOpen(false)
      fetchConfigs()
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (record, checked) => {
    try {
      await adminApi.toggleNotificationConfig(record.id, checked)
      setConfigs(prev => prev.map(c => c.id === record.id ? { ...c, isActive: checked } : c))
    } catch {
      message.error('Không thể thay đổi trạng thái')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteNotificationConfig(id)
      message.success('Đã xóa cấu hình')
      setConfigs(prev => prev.filter(c => c.id !== id))
    } catch {
      message.error('Không thể xóa cấu hình')
    }
  }

  const columns = [
    {
      title: 'Loại thông báo',
      dataIndex: 'notifType',
      width: 160,
      render: (val) => {
        const t = NOTIF_TYPE_LABELS[val] ?? { label: val, color: 'default' }
        return <Tag color={t.color}>{t.label}</Tag>
      },
    },
    {
      title: 'Đối tượng nhận',
      key: 'target',
      render: (_, record) => {
        const typeLabel = TARGET_TYPE_LABELS[record.targetType] ?? record.targetType
        return (
          <Space direction="vertical" size={0}>
            <Text style={{ fontSize: 13 }}>{typeLabel}</Text>
            {record.targetLabel && (
              <Text type="secondary" style={{ fontSize: 12 }}>{record.targetLabel}</Text>
            )}
          </Space>
        )
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: 100,
      align: 'center',
      render: (val, record) => (
        <Switch
          checked={val}
          size="small"
          onChange={(checked) => handleToggle(record, checked)}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Xóa cấu hình này?"
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, fontSize: 'clamp(16px, 2vw, 20px)' }}>
          Cấu hình thông báo
        </Title>
        <Text style={{ color: '#888', fontSize: 13 }}>
          Thiết lập loại thông báo nào gửi cho ai trong hệ thống.
        </Text>
      </div>

      <Card
        style={{ borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: 'none' }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            style={{ background: '#1F4529' }}
          >
            Thêm cấu hình
          </Button>
        </div>

        <Table
          rowKey="id"
          dataSource={configs}
          columns={columns}
          loading={loading}
          pagination={false}
          style={{ marginTop: 12 }}
          locale={{ emptyText: 'Chưa có cấu hình nào. Thêm để bắt đầu routing thông báo.' }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editRecord ? 'Chỉnh sửa cấu hình' : 'Thêm cấu hình mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editRecord ? 'Lưu thay đổi' : 'Tạo mới'}
        okButtonProps={{ loading: submitting, style: { background: '#1F4529' } }}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Loại thông báo"
            name="notifType"
            rules={[{ required: true, message: 'Vui lòng chọn loại thông báo' }]}
          >
            <Select placeholder="Chọn loại thông báo">
              <Select.Option value="booking">Booking</Select.Option>
              <Select.Option value="contact">Liên hệ</Select.Option>
              <Select.Option value="pass">Adventure Pass</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Đối tượng nhận"
            name="targetType"
            rules={[{ required: true, message: 'Vui lòng chọn đối tượng' }]}
          >
            <Select
              placeholder="Chọn đối tượng nhận"
              onChange={(val) => {
                setSelectedTargetType(val)
                form.setFieldValue('targetId', undefined)
              }}
            >
              <Select.Option value="all">Tất cả nhân viên</Select.Option>
              <Select.Option value="role">Theo vai trò (Role)</Select.Option>
              <Select.Option value="employee">Nhân viên cụ thể</Select.Option>
            </Select>
          </Form.Item>

          {selectedTargetType === 'role' && (
            <Form.Item
              label="Chọn vai trò"
              name="targetId"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            >
              <Select placeholder="Chọn vai trò">
                {roles.map(r => (
                  <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {selectedTargetType === 'employee' && (
            <Form.Item
              label="Chọn nhân viên"
              name="targetId"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select placeholder="Chọn nhân viên" showSearch optionFilterProp="children">
                {employees.map(e => (
                  <Select.Option key={e.id} value={e.id}>{e.fullName ?? e.full_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default NotificationConfig
