import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd'
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { adminApi } from '../../api/api'

const { Title, Text } = Typography

const StatCard = ({ title, value, suffix, trendLabel, color, bg, icon, loading }) => (
  <Card
    style={{
      borderRadius: 12,
      border: 'none',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden',
      height: '100%',
    }}
    styles={{ body: { padding: '20px' } }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontSize: 12,
            color: '#888',
            display: 'block',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontWeight: 500,
          }}
        >
          {title}
        </Text>
        {loading ? (
          <Spin size="small" />
        ) : (
          <>
            <div
              style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : (value ?? '—')}
              {suffix && (
                <span style={{ fontSize: 12, fontWeight: 500, color: '#666', marginLeft: 4 }}>
                  {suffix}
                </span>
              )}
            </div>
            {trendLabel && (
              <div style={{ marginTop: 6 }}>
                <Text style={{ fontSize: 11, color: '#aaa' }}>{trendLabel}</Text>
              </div>
            )}
          </>
        )}
      </div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
)

const QuickStatCard = ({ title, value, loading, color }) => (
  <Card
    style={{
      borderRadius: 12,
      border: 'none',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      height: '100%',
    }}
    styles={{ body: { padding: '16px 20px', textAlign: 'center' } }}
  >
    <Statistic
      title={<span style={{ fontSize: 12, color: '#888' }}>{title}</span>}
      value={loading ? '—' : value}
      valueStyle={{ color, fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)' }}
    />
  </Card>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => setStats(res.data?.data))
      .catch(err => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontSize: 'clamp(16px, 2vw, 20px)' }}>
          Tổng quan hệ thống
        </Title>
        <Text style={{ color: '#888', fontSize: 13 }}>
          Đây là tóm tắt hoạt động hệ thống.
        </Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Tổng số Tour"
            value={stats?.totalTours}
            icon={<EnvironmentOutlined />}
            color="#1F4529"
            bg="rgba(31,69,41,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Booking tháng này"
            value={stats?.bookingsThisMonth}
            trendLabel={`Tổng: ${stats?.totalBookings ?? '—'} đơn`}
            icon={<CalendarOutlined />}
            color="#1677ff"
            bg="rgba(22,119,255,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Doanh thu tháng"
            value={stats?.revenueThisMonth}
            suffix="đ"
            trendLabel={`Tổng: ${stats?.totalRevenue?.toLocaleString('vi-VN') ?? '—'}đ`}
            icon={<RiseOutlined />}
            color="#d46b08"
            bg="rgba(212,107,8,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Nhân viên"
            value={stats?.totalEmployees}
            icon={<UserOutlined />}
            color="#722ed1"
            bg="rgba(114,46,209,0.1)"
          />
        </Col>
      </Row>

      {/* Quick stats row */}
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} sm={8}>
          <QuickStatCard
            loading={loading}
            title="Booking chờ xác nhận"
            value={stats?.pendingBookings ?? 0}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={8}>
          <QuickStatCard
            loading={loading}
            title="Liên hệ chưa xử lý"
            value={stats?.newContactMessages ?? 0}
            color="#1677ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <QuickStatCard
            loading={loading}
            title="Tour đang hoạt động"
            value={stats?.totalTours ?? 0}
            color="#1F4529"
          />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
