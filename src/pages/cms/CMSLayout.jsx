import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Layout, Menu, Button, ConfigProvider, Avatar, Dropdown, Badge, Breadcrumb, Typography,
  Popover, List, Tooltip, Drawer, Spin, Empty
} from 'antd'
import vi_VN from 'antd/locale/vi_VN'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  CheckOutlined,
  CalendarFilled,
  MessageFilled,
  CrownFilled,
  CalendarOutlined,
  IdcardOutlined,
  PictureOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  ShoppingOutlined,
  CrownOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { adminApi } from '../../api/api'

const { Header, Sider, Content } = Layout
const { Text } = Typography

// ─── breakpoint hook ───────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

const ROUTE_LABELS = {
  '/cms': 'Dashboard',
  '/cms/tours': 'Quản lý Tour',
  '/cms/bookings': 'Quản lý Booking',
  '/cms/passes': 'Adventure Pass',
  '/cms/pass-orders': 'Đơn mua Pass',
  '/cms/banners': 'Banner / Hero',
  '/cms/blogs': 'Blog / Tin tức',
  '/cms/faqs': 'Quản lý FAQ',
  '/cms/contacts': 'Hộp thư liên hệ',
  '/cms/staff': 'Nhân viên',
  '/cms/profile': 'Hồ sơ cá nhân',
  '/cms/notification-configs': 'Cấu hình thông báo',
}

const getRouteLabel = (pathname) => {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]
  if (/\/cms\/tours\/\d+\/faqs/.test(pathname)) return 'FAQ theo Tour'
  return 'CMS'
}

// ─── helpers ───────────────────────────────────────────────────────────────────
const NOTIF_ICON = {
  booking: <CalendarFilled style={{ color: '#1677ff' }} />,
  contact: <MessageFilled  style={{ color: '#52c41a' }} />,
  pass:    <CrownFilled    style={{ color: '#d48806' }} />,
}

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)  return `${diff} giây trước`
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return `${Math.floor(diff / 86400)} ngày trước`
}

// ─── Sidebar menu content (shared between Sider & Drawer) ─────────────────────
const SidebarContent = ({ collapsed, location, menuItems, handleMenuClick, navigate, onMenuSelect }) => (
  <>
    {/* Logo area */}
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '0' : '0 20px',
        gap: 10,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      onClick={() => { navigate('/cms'); onMenuSelect?.() }}
    >
      <div style={{
        width: 32, height: 32,
        background: 'linear-gradient(135deg, #1F4529 0%, #47663B 100%)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <EnvironmentOutlined style={{ color: '#E8ECD7', fontSize: 16 }} />
      </div>
      {!collapsed && (
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
            TOONG
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: 2, whiteSpace: 'nowrap' }}>
            CMS PORTAL
          </div>
        </div>
      )}
    </div>

    {/* Navigation menu */}
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={(() => {
        const path = location.pathname
        if (['/cms/tours', '/cms/bookings', '/cms/passes', '/cms/pass-orders'].includes(path)
          || /\/cms\/tours\/\d+\/faqs/.test(path)) return ['business']
        if (['/cms/banners', '/cms/blogs', '/cms/faqs', '/cms/contacts'].includes(path)) return ['content']
        if (['/cms/staff', '/cms/profile'].includes(path)) return ['system']
        return []
      })()}
      items={menuItems}
      onClick={(e) => { handleMenuClick(e); onMenuSelect?.() }}
      style={{ background: 'transparent', border: 'none', marginTop: 8, flex: 1, overflowY: 'auto' }}
    />
  </>
)

const CMSLayout = () => {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const isMobile = useIsMobile()
  const pollRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await adminApi.getNotifications({ limit: 20 })
      const inner = res.data?.data ?? {}
      const data = Array.isArray(inner.data) ? inner.data : Array.isArray(inner) ? inner : []
      const count = inner.unreadCount ?? data.filter(n => !n.isRead).length
      setNotifications(data)
      setUnreadCount(count)
    } catch {
      // silent fail — avoid crashing UI
    }
  }, [])

  useEffect(() => {
    setNotifLoading(true)
    fetchNotifications().finally(() => setNotifLoading(false))
    pollRef.current = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(pollRef.current)
  }, [fetchNotifications])

  const markAsRead = async (id) => {
    const notif = notifications.find(n => n.id === id)
    if (!notif || notif.isRead) return
    try {
      await adminApi.markNotificationRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* silent */ }
  }

  const markAllRead = async () => {
    try {
      await adminApi.markAllNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch { /* silent */ }
  }
  const navigate = useNavigate()
  const location = useLocation()

  const currentLabel = getRouteLabel(location.pathname)

  // Close drawer on route change (mobile)
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const menuItems = [
    {
      key: '/cms',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      label: 'Kinh doanh',
      key: 'business',
      icon: <ShoppingOutlined />,
      children: [
        { key: '/cms/tours', icon: <EnvironmentOutlined />, label: 'Quản lý Tour' },
        { key: '/cms/bookings', icon: <CalendarOutlined />, label: 'Quản lý Booking' },
        { key: '/cms/passes', icon: <CrownOutlined />, label: 'Adventure Pass' },
        { key: '/cms/pass-orders', icon: <IdcardOutlined />, label: 'Đơn mua Pass' },
      ],
    },
    {
      label: 'Nội dung',
      key: 'content',
      icon: <FileTextOutlined />,
      children: [
        { key: '/cms/banners', icon: <PictureOutlined />, label: 'Banner / Hero' },
        { key: '/cms/blogs', icon: <CommentOutlined />, label: 'Blog / Tin tức' },
        { key: '/cms/faqs', icon: <QuestionCircleOutlined />, label: 'Quản lý FAQ' },
        { key: '/cms/contacts', icon: <MailOutlined />, label: 'Hộp thư liên hệ' },
      ],
    },
    {
      label: 'Hệ thống',
      key: 'system',
      icon: <TeamOutlined />,
      children: [
        { key: '/cms/staff', icon: <UserOutlined />, label: 'Nhân viên' },
        { key: '/cms/notification-configs', icon: <SettingOutlined />, label: 'Cấu hình thông báo' },
      ],
    },
  ]

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ]

  const handleMenuClick = ({ key }) => { navigate(key) }

  const NotificationPopover = () => (
    <div style={{ width: isMobile ? 300 : 340 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Thông báo</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" style={{ padding: 0, fontSize: 12 }} onClick={markAllRead}>
            Đánh dấu đã đọc hết
          </Button>
        )}
      </div>

      {notifLoading ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Spin size="small" />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo mới"
          style={{ padding: '24px 16px', margin: 0 }}
        />
      ) : (
        <List
          dataSource={notifications}
          style={{ maxHeight: 320, overflowY: 'auto' }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: item.isRead ? '#fff' : '#f0f7ff',
                borderBottom: '1px solid #fafafa',
                transition: 'background 0.15s',
                alignItems: 'flex-start',
              }}
              onMouseEnter={e => e.currentTarget.style.background = item.isRead ? '#fafafa' : '#e6f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = item.isRead ? '#fff' : '#f0f7ff'}
              onClick={() => markAsRead(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: item.isRead ? '#f5f5f5' : '#e6f4ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {NOTIF_ICON[item.type] ?? <BellOutlined />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: item.isRead ? 400 : 600, color: '#1a1a1a', marginBottom: 2 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>{item.description}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{timeAgo(item.createdAt)}</div>
                </div>
                {!item.isRead && (
                  <Tooltip title="Đánh dấu đã đọc">
                    <Button
                      type="text" size="small"
                      icon={<CheckOutlined style={{ fontSize: 11 }} />}
                      onClick={(e) => { e.stopPropagation(); markAsRead(item.id) }}
                      style={{ color: '#1677ff', padding: '0 4px', flexShrink: 0 }}
                    />
                  </Tooltip>
                )}
              </div>
            </List.Item>
          )}
        />
      )}

      <div style={{ textAlign: 'center', padding: '10px', borderTop: '1px solid #f0f0f0' }}>
        <Button
          type="link" size="small" style={{ fontSize: 12 }}
          onClick={() => { setBellOpen(false); navigate('/cms/notification-configs') }}
        >
          Cấu hình thông báo
        </Button>
      </div>
    </div>
  )

  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        token: {
          colorPrimary: '#1F4529',
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgLayout: '#F0F2F5',
          colorBgContainer: '#FFFFFF',
          fontSize: 14,
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'rgba(0,0,0,0.2)',
            darkItemSelectedBg: '#1F4529',
            darkItemSelectedColor: '#ffffff',
            darkItemColor: 'rgba(255,255,255,0.75)',
            darkItemHoverColor: '#ffffff',
          },
          Layout: {
            siderBg: '#0D2E2A',
            headerBg: '#ffffff',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>

        {/* ── SIDEBAR (desktop only) ── */}
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={220}
            style={{ background: '#0D2E2A', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <SidebarContent
                collapsed={collapsed}
                location={location}
                menuItems={menuItems}
                handleMenuClick={handleMenuClick}
                navigate={navigate}
              />
              {/* Collapse toggle */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '12px',
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'flex-end',
              }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}
                />
              </div>
            </div>
          </Sider>
        )}

        {/* ── SIDEBAR (mobile drawer) ── */}
        {isMobile && (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="left"
            width={240}
            styles={{
              body: { padding: 0, background: '#0D2E2A', display: 'flex', flexDirection: 'column', height: '100%' },
              header: { display: 'none' },
            }}
          >
            <SidebarContent
              collapsed={false}
              location={location}
              menuItems={menuItems}
              handleMenuClick={handleMenuClick}
              navigate={navigate}
              onMenuSelect={() => setDrawerOpen(false)}
            />
          </Drawer>
        )}

        <Layout>
          {/* ── HEADER ── */}
          <Header style={{
            padding: isMobile ? '0 12px' : '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: 56,
            gap: 8,
          }}>
            {/* Left: Hamburger (mobile) or Breadcrumb (desktop) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {isMobile ? (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined style={{ fontSize: 18 }} />}
                  onClick={() => setDrawerOpen(true)}
                  style={{ flexShrink: 0 }}
                />
              ) : null}
              <Breadcrumb
                items={[
                  { title: isMobile ? 'CMS' : 'Toong CMS' },
                  { title: currentLabel },
                ]}
                style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              />
            </div>

            {/* Right: Bell + User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}>
              <Popover
                open={bellOpen}
                onOpenChange={setBellOpen}
                placement="bottomRight"
                trigger="click"
                arrow={false}
                styles={{ body: { padding: 0 } }}
                content={<NotificationPopover />}
              >
                <Badge count={unreadCount} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ fontSize: 16, color: bellOpen ? '#1F4529' : '#555' }}
                  />
                </Badge>
              </Popover>

              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    if (key === 'logout') logout()
                    if (key === 'profile') navigate('/cms/profile')
                  },
                }}
                placement="bottomRight"
                arrow
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', padding: '4px 6px', borderRadius: 6,
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar
                    size={30}
                    style={{ background: 'linear-gradient(135deg, #1F4529, #47663B)', flexShrink: 0 }}
                    icon={<UserOutlined />}
                  />
                  {!isMobile && (
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{user?.full_name || 'Admin'}</div>
                      <div style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap' }}>{user?.role?.name || 'Quản trị viên'}</div>
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* ── CONTENT ── */}
          <Content style={{
            margin: isMobile ? '12px 8px' : '20px 20px',
            padding: isMobile ? 14 : 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            overflow: 'auto',
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default CMSLayout
