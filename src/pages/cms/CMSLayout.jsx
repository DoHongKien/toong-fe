import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layout, Menu, Button, ConfigProvider, Avatar, Dropdown, Badge, Breadcrumb, Typography,
  Popover, List, Tooltip
} from 'antd';
import vi_VN from 'antd/locale/vi_VN';
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
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

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
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'booking',  icon: <CalendarFilled style={{ color: '#1677ff' }} />, title: 'Booking mới BK-10296', desc: 'Nguyễn Văn A đặt tour Tà Năng 2 người', time: '5 phút trước', read: false },
  { id: 2, type: 'contact',  icon: <MessageFilled  style={{ color: '#52c41a' }} />, title: 'Liên hệ tư vấn mới', desc: 'Trần Thị B hỏi về tour Bidoup cuối tuần',  time: '1 giờ trước',  read: false },
  { id: 3, type: 'pass',    icon: <CrownFilled    style={{ color: '#d48806' }} />, title: 'Kích hoạt Adventure Pass', desc: 'Lê Cường vừa mua gói ADVENTURE Pass',   time: '2 giờ trước',  read: false },
  { id: 4, type: 'booking',  icon: <CalendarFilled style={{ color: '#1677ff' }} />, title: 'Booking BK-10295 cọc xong', desc: 'Phạm Hữu Cường đã chuyển khoản cọc',  time: '5 giờ trước',  read: true  },
];

const CMSLayout = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [bellOpen, setBellOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const navigate = useNavigate();
  const location = useLocation();

  const currentLabel = ROUTE_LABELS[location.pathname] || 'CMS';

  const getDefaultOpenKeys = () => {
    const path = location.pathname;
    if (['/cms/tours', '/cms/bookings', '/cms/passes', '/cms/pass-orders'].includes(path)) return ['business'];
    if (['/cms/banners', '/cms/blogs', '/cms/faqs', '/cms/contacts'].includes(path)) return ['content'];
    if (['/cms/staff', '/cms/profile'].includes(path)) return ['system'];
    return [];
  };

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
      ],
    },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

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
        {/* ── SIDEBAR ── */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{ background: '#0D2E2A', overflow: 'hidden' }}
        >
          {/* Logo area */}
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 20px',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }} onClick={() => navigate('/cms')}>
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
            defaultOpenKeys={getDefaultOpenKeys()}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ background: 'transparent', border: 'none', marginTop: 8 }}
          />

          {/* Collapse toggle at the bottom */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
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
        </Sider>

        <Layout>
          {/* ── HEADER ── */}
          <Header style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: 56,
          }}>
            {/* Left: Breadcrumb */}
            <Breadcrumb
              items={[
                { title: 'Toong CMS' },
                { title: currentLabel },
              ]}
              style={{ fontSize: 13 }}
            />

            {/* Right: User controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Popover
                open={bellOpen}
                onOpenChange={setBellOpen}
                placement="bottomRight"
                trigger="click"
                arrow={false}
                styles={{ body: { padding: 0 } }}
                content={
                  <div style={{ width: 340 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Thông báo</span>
                      {unreadCount > 0 && (
                        <Button type="link" size="small" style={{ padding: 0, fontSize: 12 }} onClick={markAllRead}>
                          Đánh dấu đã đọc hết
                        </Button>
                      )}
                    </div>
                    {/* List */}
                    <List
                      dataSource={notifications}
                      style={{ maxHeight: 340, overflowY: 'auto' }}
                      renderItem={(item) => (
                        <List.Item
                          key={item.id}
                          style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            background: item.read ? '#fff' : '#f0f7ff',
                            borderBottom: '1px solid #fafafa',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = item.read ? '#fafafa' : '#e6f4ff'}
                          onMouseLeave={e => e.currentTarget.style.background = item.read ? '#fff' : '#f0f7ff'}
                          onClick={() => markAsRead(item.id)}
                          actions={[
                            !item.read && (
                              <Tooltip title="Đánh dấu đã đọc" key="read">
                                <Button
                                  type="text" size="small"
                                  icon={<CheckOutlined style={{ fontSize: 11 }} />}
                                  onClick={(e) => { e.stopPropagation(); markAsRead(item.id); }}
                                  style={{ color: '#1677ff', padding: '0 4px' }}
                                />
                              </Tooltip>
                            ),
                          ].filter(Boolean)}
                        >
                          <List.Item.Meta
                            avatar={
                              <div style={{
                                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                background: item.read ? '#f5f5f5' : '#e6f4ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                              }}>
                                {item.icon}
                              </div>
                            }
                            title={
                              <span style={{ fontSize: 13, fontWeight: item.read ? 400 : 600, color: '#1a1a1a' }}>
                                {item.title}
                              </span>
                            }
                            description={
                              <span style={{ fontSize: 11, color: '#999' }}>
                                <span style={{ display: 'block', color: '#666', marginBottom: 1 }}>{item.desc}</span>
                                {item.time}
                              </span>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    {/* Footer */}
                    <div style={{ textAlign: 'center', padding: '10px', borderTop: '1px solid #f0f0f0' }}>
                      <Button type="link" size="small" style={{ fontSize: 12 }}>Xem tất cả</Button>
                    </div>
                  </div>
                }
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
                    if (key === 'logout') logout();
                    if (key === 'profile') navigate('/cms/profile');
                  },
                }}
                placement="bottomRight"
                arrow
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar
                    size={32}
                    style={{ background: 'linear-gradient(135deg, #1F4529, #47663B)' }}
                    icon={<UserOutlined />}
                  />
                  {!collapsed && (
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>{user?.full_name || 'Admin'}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{user?.role?.name || 'Quản trị viên'}</div>
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* ── CONTENT ── */}
          <Content style={{
            margin: '20px 20px',
            padding: 24,
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
  );
};

export default CMSLayout;
