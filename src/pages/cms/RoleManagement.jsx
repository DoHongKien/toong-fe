import { useState, useEffect, useCallback } from 'react'
import {
  Typography, Button, Row, Col, Checkbox,
  message, Spin, Space, Empty, Modal,
  Input, Form, Tag, Table, Tooltip, Divider,
} from 'antd'
import {
  SafetyCertificateOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

// ─── Module display map ───────────────────────────────────────────
const MODULE_META = {
  TOUR:     { label: 'Tour',             color: '#1F4529', bg: '#f0faf0' },
  BOOKING:  { label: 'Booking',          color: '#0958d9', bg: '#e8f0fe' },
  STAFF:    { label: 'Nhân viên',        color: '#7c3aed', bg: '#f5f3ff' },
  BANNER:   { label: 'Banner',          color: '#c27803', bg: '#fffbeb' },
  BLOG:     { label: 'Blog',            color: '#d97706', bg: '#fef3c7' },
  FAQ:      { label: 'FAQ',             color: '#0891b2', bg: '#ecfeff' },
  CONTACT:  { label: 'Liên hệ',        color: '#b91c1c', bg: '#fef2f2' },
  PASS:     { label: 'Adventure Pass',  color: '#059669', bg: '#ecfdf5' },
  ROLE:     { label: 'Vai trò',         color: '#6b7280', bg: '#f9fafb' },
  REPORT:   { label: 'Báo cáo',        color: '#374151', bg: '#f3f4f6' },
}

const getModuleMeta = (prefix) =>
  MODULE_META[prefix] || { label: prefix, color: '#555', bg: '#f5f5f5' }

const RoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [allPermissions, setAllPermissions] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [loadingPerms, setLoadingPerms] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [originalPermIds, setOriginalPermIds] = useState([])
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [form] = Form.useForm()

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true)
    try {
      const res = await adminApi.getAllRoles()
      setRoles(res.data?.data || [])
    } catch {
      message.error('Không thể tải danh sách vai trò')
    } finally {
      setLoadingRoles(false)
    }
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await adminApi.getAllPermissions()
      setAllPermissions(res.data?.data || [])
    } catch {
      message.error('Không thể tải danh sách quyền hạn')
    }
  }, [])

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [fetchRoles, fetchPermissions])

  const handleSelectRole = async (role) => {
    if (isDirty) {
      Modal.confirm({
        title: 'Chưa lưu thay đổi',
        content: 'Bạn có thay đổi chưa lưu. Rời đi sẽ mất dữ liệu đó.',
        okText: 'Rời đi',
        cancelText: 'Ở lại',
        onOk: () => doSelectRole(role),
      })
      return
    }
    doSelectRole(role)
  }

  const doSelectRole = async (role) => {
    setSelectedRole(role)
    setIsDirty(false)
    setLoadingPerms(true)
    try {
      const res = await adminApi.getRolePermissions(role.id)
      const ids = res.data?.data?.map((p) => p.id) || []
      setSelectedPermissionIds(ids)
      setOriginalPermIds(ids)
    } catch {
      message.error('Lỗi khi tải quyền của vai trò')
    } finally {
      setLoadingPerms(false)
    }
  }

  const handleTogglePermission = (permId) => {
    setSelectedPermissionIds((prev) => {
      const next = prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
      setIsDirty(JSON.stringify(next.sort()) !== JSON.stringify([...originalPermIds].sort()))
      return next
    })
  }

  const handleToggleGroup = (groupPerms, checked) => {
    const groupIds = groupPerms.map((p) => p.id)
    setSelectedPermissionIds((prev) => {
      const next = checked
        ? Array.from(new Set([...prev, ...groupIds]))
        : prev.filter((id) => !groupIds.includes(id))
      setIsDirty(JSON.stringify(next.sort()) !== JSON.stringify([...originalPermIds].sort()))
      return next
    })
  }

  const handleRevert = () => {
    setSelectedPermissionIds([...originalPermIds])
    setIsDirty(false)
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return
    setSaving(true)
    try {
      await adminApi.updateRolePermissions(selectedRole.id, {
        permissionIds: selectedPermissionIds,
      })
      setOriginalPermIds([...selectedPermissionIds])
      setIsDirty(false)
      message.success(`Đã lưu quyền hạn cho "${selectedRole.name}"`)
    } catch {
      message.error('Cập nhật thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenRoleModal = (role = null) => {
    setEditingRole(role)
    form.setFieldsValue(role ? { name: role.name, code: role.code } : { name: '', code: '' })
    setRoleModalVisible(true)
  }

  const handleSubmitRole = async (values) => {
    try {
      if (editingRole) {
        await adminApi.updateRole(editingRole.id, { name: values.name })
        message.success('Cập nhật vai trò thành công')
      } else {
        await adminApi.createRole(values)
        message.success('Tạo vai trò mới thành công')
      }
      setRoleModalVisible(false)
      form.resetFields()
      fetchRoles()
    } catch {
      message.error('Thao tác thất bại, vui lòng thử lại')
    }
  }

  const handleDeleteRole = (id, name) => {
    Modal.confirm({
      title: `Xóa vai trò "${name}"?`,
      content: 'Không thể xóa nếu còn nhân viên đang được gán vai trò này.',
      okText: 'Xác nhận xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await adminApi.deleteRole(id)
          message.success('Đã xóa vai trò')
          if (selectedRole?.id === id) {
            setSelectedRole(null)
            setSelectedPermissionIds([])
            setIsDirty(false)
          }
          fetchRoles()
        } catch {
          message.error('Không thể xóa vai trò này')
        }
      },
    })
  }

  // Group permissions by module prefix
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const prefix = perm.code.includes('_') ? perm.code.split('_')[0] : 'Khác'
    if (!acc[prefix]) acc[prefix] = []
    acc[prefix].push(perm)
    return acc
  }, {})

  // ─── Role Table Columns ──────────────────────────────────────────
  const roleColumns = [
    {
      title: 'Vai trò',
      dataIndex: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: 0.3 }}>{record.code}</Text>
        </Space>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Space size={4} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Đổi tên">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenRoleModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa vai trò">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRole(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1a3d2e' }}>Phân Quyền & Vai Trò</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Chọn một vai trò để cấu hình quyền truy cập module tương ứng.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenRoleModal(null)}
            style={{ background: '#1F4529', borderColor: '#1F4529' }}
          >
            Thêm vai trò
          </Button>
        </div>
      </div>

      <Row gutter={20} align="top">
        {/* ── Left: Role Table ── */}
        <Col xs={24} md={7}>
          <div style={{
            border: '1px solid #e8e8e8',
            borderRadius: 10,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              padding: '12px 16px',
              background: '#fafafa',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <SafetyCertificateOutlined style={{ color: '#1F4529' }} />
              <Text strong style={{ fontSize: 13 }}>Danh sách vai trò</Text>
              <Tag color="green" style={{ marginLeft: 'auto' }}>{roles.length}</Tag>
            </div>
            <Table
              dataSource={roles}
              columns={roleColumns}
              rowKey="id"
              size="small"
              loading={loadingRoles}
              showHeader={false}
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleSelectRole(record),
                style: {
                  cursor: 'pointer',
                  background: selectedRole?.id === record.id ? '#f0faf0' : undefined,
                  borderLeft: selectedRole?.id === record.id ? '3px solid #1F4529' : '3px solid transparent',
                  transition: 'all 0.15s',
                },
              })}
              style={{ borderRadius: 0 }}
            />
          </div>
        </Col>

        {/* ── Right: Permission Panel ── */}
        <Col xs={24} md={17}>
          {!selectedRole ? (
            <div style={{
              minHeight: 480,
              border: '1.5px dashed #d9d9d9',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
            }}>
              <Empty
                image={<LockOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                imageStyle={{ height: 60 }}
                description={
                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Text strong style={{ display: 'block', fontSize: 14, color: '#555' }}>Chưa chọn vai trò</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Nhấn vào một vai trò bên trái để cấu hình quyền hạn.
                    </Text>
                  </div>
                }
              />
            </div>
          ) : (
            <div style={{
              border: '1px solid #e8e8e8',
              borderRadius: 10,
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              {/* Panel Header */}
              <div style={{
                padding: '14px 20px',
                background: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SafetyCertificateOutlined style={{ color: '#1F4529', fontSize: 16 }} />
                  <div>
                    <Text strong style={{ fontSize: 14 }}>Quyền hạn: {selectedRole.name}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                      {selectedPermissionIds.length}/{allPermissions.length} quyền được bật
                    </Text>
                  </div>
                </div>
                <Space>
                  {isDirty && (
                    <Button
                      size="small"
                      icon={<UndoOutlined />}
                      onClick={handleRevert}
                    >
                      Hoàn tác
                    </Button>
                  )}
                  <Button
                    type="primary"
                    size="small"
                    icon={<SaveOutlined />}
                    loading={saving}
                    disabled={!isDirty}
                    onClick={handleSavePermissions}
                    style={isDirty ? { background: '#1F4529', borderColor: '#1F4529' } : {}}
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              </div>

              {/* Permission Content */}
              <div style={{ padding: '20px 20px', maxHeight: '65vh', overflowY: 'auto' }}>
                {loadingPerms ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin tip="Đang tải quyền hạn..." />
                  </div>
                ) : Object.keys(groupedPermissions).length === 0 ? (
                  <Empty description="Chưa có quyền hạn nào trong hệ thống" style={{ padding: '40px 0' }} />
                ) : (
                  Object.entries(groupedPermissions).map(([prefix, perms], idx) => {
                    const meta = getModuleMeta(prefix)
                    const allChecked = perms.every((p) => selectedPermissionIds.includes(p.id))
                    const indeterminate = perms.some((p) => selectedPermissionIds.includes(p.id)) && !allChecked
                    const checkedCount = perms.filter((p) => selectedPermissionIds.includes(p.id)).length

                    return (
                      <div key={prefix}>
                        {idx > 0 && <Divider style={{ margin: '16px 0' }} />}

                        {/* Group Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 28, height: 28,
                              borderRadius: 6,
                              background: meta.bg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <SafetyCertificateOutlined style={{ color: meta.color, fontSize: 14 }} />
                            </div>
                            <Text strong style={{ fontSize: 13, color: meta.color }}>{meta.label}</Text>
                            <Tag
                              bordered={false}
                              style={{
                                background: meta.bg,
                                color: meta.color,
                                fontSize: 11,
                                fontFamily: 'monospace',
                              }}
                            >
                              {checkedCount}/{perms.length}
                            </Tag>
                          </div>
                          <Checkbox
                            indeterminate={indeterminate}
                            checked={allChecked}
                            onChange={(e) => handleToggleGroup(perms, e.target.checked)}
                          >
                            <Text style={{ fontSize: 12, color: '#666' }}>Tất cả</Text>
                          </Checkbox>
                        </div>

                        {/* Permission Items */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: 8,
                        }}>
                          {perms.map((perm) => {
                            const isChecked = selectedPermissionIds.includes(perm.id)
                            return (
                              <div
                                key={perm.id}
                                onClick={() => handleTogglePermission(perm.id)}
                                style={{
                                  padding: '10px 12px',
                                  borderRadius: 8,
                                  border: `1px solid ${isChecked ? meta.color + '40' : '#f0f0f0'}`,
                                  background: isChecked ? meta.bg : '#fafafa',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 10,
                                  transition: 'all 0.15s',
                                  userSelect: 'none',
                                }}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  style={{ marginTop: 1, flexShrink: 0 }}
                                />
                                <div style={{ minWidth: 0 }}>
                                  <div style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: isChecked ? meta.color : '#444',
                                    lineHeight: 1.3,
                                    marginBottom: 2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}>
                                    {perm.name}
                                  </div>
                                  <div style={{
                                    fontSize: 10,
                                    fontFamily: 'monospace',
                                    color: '#aaa',
                                    letterSpacing: 0.3,
                                    textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}>
                                    {perm.code}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Dirty indicator bar */}
              {isDirty && (
                <div style={{
                  padding: '10px 20px',
                  background: '#fffbeb',
                  borderTop: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  <Text style={{ fontSize: 13, color: '#92400e' }}>
                    Có thay đổi chưa được lưu — nhấn "Lưu thay đổi" để áp dụng.
                  </Text>
                  <Space>
                    <Button size="small" icon={<UndoOutlined />} onClick={handleRevert}>Hoàn tác</Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SaveOutlined />}
                      loading={saving}
                      onClick={handleSavePermissions}
                      style={{ background: '#1F4529', borderColor: '#1F4529' }}
                    >
                      Lưu thay đổi
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>

      {/* ── Role Modal ── */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#1F4529' }} />
            {editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}
          </Space>
        }
        open={roleModalVisible}
        onCancel={() => { setRoleModalVisible(false); form.resetFields() }}
        onOk={() => form.submit()}
        okText={editingRole ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        centered
        width={420}
        okButtonProps={{ style: { background: '#1F4529', borderColor: '#1F4529' } }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRole}
          style={{ marginTop: 16 }}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<Text strong>Tên vai trò</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
          >
            <Input placeholder="VD: Quản trị viên, Biên tập viên" />
          </Form.Item>

          <Form.Item
            name="code"
            label={<Text strong>Mã định danh</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mã code' }]}
            extra="Chỉ dùng chữ HOA và dấu gạch dưới. VD: ADMIN, BLOG_EDITOR"
          >
            <Input
              placeholder="ADMIN"
              disabled={!!editingRole}
              onChange={(e) =>
                form.setFieldValue('code', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default RoleManagement
