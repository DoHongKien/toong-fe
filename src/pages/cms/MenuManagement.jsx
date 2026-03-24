import { useState, useEffect, useCallback } from 'react'
import {
  Typography, Button, Tabs, Table, Switch, Tag, Space,
  Modal, Form, Input, Select, InputNumber, Tooltip,
  message, Popconfirm, Badge, Divider, Alert,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  AppstoreOutlined, GlobalOutlined, ApartmentOutlined,
  DashboardOutlined, EnvironmentOutlined, CalendarOutlined,
  CrownOutlined, IdcardOutlined, PictureOutlined,
  CommentOutlined, QuestionCircleOutlined, MailOutlined,
  ShoppingOutlined, TeamOutlined, UserOutlined,
  SettingOutlined, SafetyCertificateOutlined, FileTextOutlined,
} from '@ant-design/icons'

// ─── Icon resolver ────────────────────────────────────────────────
const ICON_MAP = {
  DashboardOutlined:         <DashboardOutlined />,
  EnvironmentOutlined:       <EnvironmentOutlined />,
  CalendarOutlined:          <CalendarOutlined />,
  CrownOutlined:             <CrownOutlined />,
  IdcardOutlined:            <IdcardOutlined />,
  PictureOutlined:           <PictureOutlined />,
  CommentOutlined:           <CommentOutlined />,
  QuestionCircleOutlined:    <QuestionCircleOutlined />,
  MailOutlined:              <MailOutlined />,
  ShoppingOutlined:          <ShoppingOutlined />,
  TeamOutlined:              <TeamOutlined />,
  UserOutlined:              <UserOutlined />,
  SettingOutlined:           <SettingOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  AppstoreOutlined:          <AppstoreOutlined />,
  FileTextOutlined:          <FileTextOutlined />,
}

const renderIcon = (iconName, style = {}) => {
  const icon = ICON_MAP[iconName]
  if (!icon) return null
  return <span style={{ color: '#555', ...style }}>{icon}</span>
}

import { adminApi } from '../../api/api'


const { Title, Text } = Typography
const { TextArea } = Input

// ─── Constants ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  MEGA_PARENT: { label: 'Mega Menu', color: 'purple' },
  SIMPLE:      { label: 'Dropdown',  color: 'blue' },
  ITEM:        { label: 'Mục lá',    color: 'default' },
}

const ANT_ICONS = Object.keys(ICON_MAP)

// ─── Flatten nested tree ──────────────────────────────────────────
const flattenTree = (nodes, depth = 0) => {
  const result = []
  for (const node of nodes) {
    result.push({ ...node, _depth: depth, children: node.children?.length ? node.children : undefined })
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1))
    }
  }
  return result
}

// ─── Responsive hook ──────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

// ─── Menu Form Modal ──────────────────────────────────────────────
const MenuFormModal = ({ open, onClose, onSave, record, context, flatMenus, permissions, isMobile }) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [menuType, setMenuType] = useState('SIMPLE')

  useEffect(() => {
    if (open) {
      const vals = record
        ? { ...record, parentId: record.parentId ?? undefined }
        : { type: 'SIMPLE', isActive: true, orderIndex: 1, context }
      form.setFieldsValue(vals)
      setMenuType(record?.type ?? 'SIMPLE')
    } else {
      form.resetFields()
    }
  }, [open, record, form, context])

  const handleFinish = async (values) => {
    setSubmitting(true)
    try {
      const payload = { ...values, context, parentId: values.parentId ?? null }
      if (record) {
        await adminApi.updateMenu(record.id, payload)
        message.success('Đã cập nhật menu')
      } else {
        await adminApi.createMenu(payload)
        message.success('Đã tạo menu mới')
      }
      onSave()
    } catch (err) {
      message.error('Thao tác thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const parentOptions = flatMenus
    .filter(m => m.id !== record?.id && m.type !== 'ITEM')
    .map(m => ({ value: m.id, label: `${'—'.repeat(m._depth || 0)} ${m.label}` }))

  return (
    <Modal
      title={
        <Space>
          <ApartmentOutlined style={{ color: '#1F4529' }} />
          {record ? 'Chỉnh sửa menu' : 'Thêm menu mới'}
          <Tag color={context === 'CLIENT' ? 'blue' : 'purple'}>
            {context === 'CLIENT' ? 'Website' : 'CMS Sidebar'}
          </Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={record ? 'Lưu thay đổi' : 'Tạo mới'}
      cancelText="Hủy"
      confirmLoading={submitting}
      centered
      width={isMobile ? '100%' : 640}
      style={isMobile ? { margin: 0, maxWidth: '100vw', top: 0, paddingBottom: 0 } : {}}
      styles={isMobile ? { body: { maxHeight: '80dvh', overflowY: 'auto', padding: '12px 16px' } } : {}}
      okButtonProps={{ style: { background: '#1F4529', borderColor: '#1F4529' } }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="type"
          label={<Text strong>Loại menu</Text>}
          rules={[{ required: true }]}
        >
          <Select
            options={Object.entries(TYPE_CONFIG).map(([v, c]) => ({
              value: v, label: <Tag color={c.color}>{c.label}</Tag>,
            }))}
            onChange={setMenuType}
          />
        </Form.Item>

        <Form.Item
          name="parentId"
          label={<Text strong>Menu cha (để trống = cấp root)</Text>}
        >
          <Select
            placeholder="— Root (không có cha) —"
            allowClear
            options={parentOptions}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="label"
            label={<Text strong>Nhãn hiển thị</Text>}
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Input placeholder="VD: TOURS, Kinh doanh" />
          </Form.Item>

          <Form.Item
            name="keyName"
            label={<Text strong>Key Name (unique)</Text>}
            rules={[{ required: true, message: 'Bắt buộc' }]}
          >
            <Input placeholder="tours-mega, cms-tours" disabled={!!record} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: '0 16px', alignItems: 'end' }}>
          <Form.Item
            name="href"
            label={<Text strong>Đường dẫn (href)</Text>}
          >
            <Input placeholder="/tours, /cms/tours" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label={<Text strong>Thứ tự</Text>}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: 80 }} />
          </Form.Item>
        </div>

        {/* CMS-only: icon + required permission */}
        {context === 'CMS' && (
          <>
            <Form.Item
              name="icon"
              label={<Text strong>Icon (Ant Design)</Text>}
              help="Chọn icon hiển thị trong sidebar"
            >
              <Select
                placeholder="Chọn icon"
                allowClear
                showSearch
                optionFilterProp="label"
                options={ANT_ICONS.map(name => ({
                  value: name,
                  label: name,
                  icon: ICON_MAP[name],
                }))}
                optionRender={(opt) => (
                  <Space>
                    <span style={{ fontSize: 16 }}>{opt.data.icon}</span>
                    <span style={{ fontSize: 13 }}>{opt.data.label}</span>
                  </Space>
                )}
                labelRender={(val) => val.value ? (
                  <Space size={6}>
                    <span>{ICON_MAP[val.value]}</span>
                    <span>{val.value}</span>
                  </Space>
                ) : null}
              />
            </Form.Item>

            <Form.Item
              name="requiredPermission"
              label={<Text strong>Quyền yêu cầu</Text>}
              help="Chỉ admin có permission này mới thấy menu. Để trống = mọi admin đều thấy"
            >
              <Select
                placeholder="— Mọi admin đều thấy (không giới hạn) —"
                allowClear
                showSearch
                optionFilterProp="label"
                options={(permissions || []).map(p => ({
                  value: p.code,
                  label: `${p.code} — ${p.name}`,
                }))}
              />
            </Form.Item>
          </>
        )}

        {/* CLIENT + MEGA_PARENT: extra mega fields */}
        {context === 'CLIENT' && menuType === 'MEGA_PARENT' && (
          <>
            <Divider style={{ margin: '8px 0 16px' }}>Nội dung Mega Menu</Divider>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="megaAccentTitle" label={<Text strong>Tiêu đề nhỏ</Text>}>
                <Input placeholder="Khám phá" />
              </Form.Item>
              <Form.Item name="megaMainTitle" label={<Text strong>Tiêu đề chính</Text>}>
                <Input placeholder="Cung đường trekking" />
              </Form.Item>
            </div>
            <Form.Item name="megaDescription" label={<Text strong>Mô tả</Text>}>
              <TextArea autoSize={{ minRows: 2 }} placeholder="Hành trình chinh phục thiên nhiên..." />
            </Form.Item>
            <Form.Item name="megaImage" label={<Text strong>Ảnh Mega Menu (URL)</Text>}>
              <Input placeholder="https://..." />
            </Form.Item>
          </>
        )}

        <Form.Item name="isActive" label={<Text strong>Trạng thái</Text>} valuePropName="checked" initialValue>
          <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── Menu Table ───────────────────────────────────────────────────
const MenuTable = ({ context, label }) => {
  const isMobile = useIsMobile()
  const [tree, setTree] = useState([])
  const [flat, setFlat] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.getAllMenus(context)
      const data = res.data?.data || []
      setTree(data)
      setFlat(flattenTree(data))
    } catch {
      message.error('Không thể tải danh sách menu')
    } finally {
      setLoading(false)
    }
  }, [context])

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await adminApi.getAllPermissions()
      setPermissions(res.data?.data || [])
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchMenus()
    if (context === 'CMS') fetchPermissions()
  }, [fetchMenus, fetchPermissions, context])

  const handleToggle = async (record, checked) => {
    try {
      await adminApi.toggleMenuStatus(record.id, checked)
      message.success(checked ? 'Đã bật menu' : 'Đã ẩn menu')
      fetchMenus()
    } catch {
      message.error('Thao tác thất bại')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteMenu(id)
      message.success('Đã xóa menu')
      fetchMenus()
    } catch {
      message.error('Không thể xóa menu này')
    }
  }

  const columns = [
    {
      title: 'Nhãn / Key',
      dataIndex: 'label',
      render: (label, record) => (
        <div style={{ paddingLeft: record._depth * 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {record._depth > 0 && (
              <span style={{ color: '#ccc', fontFamily: 'monospace' }}>└─</span>
            )}
            <div>
              <Text strong style={{ fontSize: 13 }}>{label}</Text>
              <div>
                <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                  {record.keyName}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 120,
      render: (type) => {
        const cfg = TYPE_CONFIG[type] || {}
        return <Tag color={cfg.color}>{cfg.label || type}</Tag>
      },
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'href',
      width: 180,
      responsive: ['md'],
      render: (href) =>
        href ? (
          <Text code style={{ fontSize: 11 }}>{href}</Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        ),
    },
    ...(context === 'CLIENT' ? [{
      title: 'Mega Content',
      key: 'mega',
      width: 160,
      responsive: ['lg'],
      render: (_, record) =>
        record.type === 'MEGA_PARENT' && record.megaMainTitle ? (
          <Tooltip title={record.megaDescription}>
            <Text style={{ fontSize: 12, color: '#7c3aed' }}>
              {record.megaMainTitle}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        ),
    }] : []),
    ...(context === 'CMS' ? [{
      title: 'Icon',
      dataIndex: 'icon',
      width: 190,
      responsive: ['md'],
      render: (icon) =>
        icon ? (
          <Space size={6}>
            <span style={{ fontSize: 16, color: '#555' }}>{ICON_MAP[icon]}</span>
            <Text style={{ fontSize: 12 }}>{icon}</Text>
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
        ),
    }, {
      title: 'Permission yêu cầu',
      dataIndex: 'requiredPermission',
      width: 180,
      responsive: ['lg'],
      render: (perm) =>
        perm ? (
          <Tag color="orange" style={{ fontFamily: 'monospace', fontSize: 11 }}>{perm}</Tag>
        ) : (
          <Tag color="default" style={{ fontSize: 11 }}>Mọi admin</Tag>
        ),
    }] : []),
    {
      title: 'Thứ tự',
      dataIndex: 'orderIndex',
      width: 70,
      align: 'center',
      responsive: ['md'],
      render: (v) => <Text type="secondary">{v}</Text>,
    },
    {
      title: 'Hiển thị',
      dataIndex: 'isActive',
      width: 100,
      align: 'center',
      render: (val, record) => (
        <Switch
          size="small"
          checked={val}
          onChange={(checked) => handleToggle(record, checked)}
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => { setEditing(record); setModalOpen(true) }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa menu này?"
            description={
              record.children
                ? 'Cảnh báo: Xóa sẽ xóa luôn tất cả menu con!'
                : 'Hành động không thể hoàn tác.'
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
          >
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 16, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0 }}>
        <div>
          <Text strong>Cây menu {label}</Text>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            ({flat.length} mục — {tree.length} cấp root)
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setEditing(null); setModalOpen(true) }}
          style={{ background: '#1F4529', borderColor: '#1F4529', alignSelf: isMobile ? 'flex-end' : 'auto' }}
        >
          Thêm menu
        </Button>
      </div>

      {context === 'CLIENT' && (
        <Alert
          type="info"
          showIcon
          message="Menu Website sẽ được phản ánh lên điều hướng của website public sau khi bật hiển thị."
          style={{ marginBottom: 16 }}
        />
      )}
      {context === 'CMS' && (
        <Alert
          type="warning"
          showIcon
          message="Menu CMS Sidebar điều khiển cấu trúc thanh điều hướng bên trong CMS Portal. Sau khi lưu, sidebar sẽ cập nhật theo cấu hình này."
          style={{ marginBottom: 16 }}
        />
      )}

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table
          dataSource={flat}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          style={{ background: '#fff', minWidth: isMobile ? 480 : 'unset' }}
          rowClassName={(record) =>
            !record.isActive ? 'opacity-50' : ''
          }
        />
      </div>

      <MenuFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={() => { setModalOpen(false); setEditing(null); fetchMenus() }}
        record={editing}
        context={context}
        flatMenus={flat}
        permissions={permissions}
        isMobile={isMobile}
      />
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
const MenuManagement = () => (
  <>
    <div style={{ marginBottom: 24 }}>
      <Title level={4} style={{ margin: 0, color: '#1a3d2e' }}>Quản lý Menu</Title>
      <Text type="secondary" style={{ fontSize: 13 }}>
        Cấu hình menu điều hướng website công khai và menu sidebar CMS Portal.
      </Text>
    </div>

    <Tabs
      defaultActiveKey="CLIENT"
      size="large"
      items={[
        {
          key: 'CLIENT',
          label: (
            <Space>
              <GlobalOutlined />
              Menu Website
            </Space>
          ),
          children: <MenuTable context="CLIENT" label="Website Client" />,
        },
        {
          key: 'CMS',
          label: (
            <Space>
              <AppstoreOutlined />
              Menu CMS Sidebar
            </Space>
          ),
          children: <MenuTable context="CMS" label="CMS Portal" />,
        },
      ]}
    />
  </>
)

export default MenuManagement
