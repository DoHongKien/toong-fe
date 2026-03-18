import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Tag, Progress, Spin } from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { adminApi } from '../../api/api';

const { Title, Text } = Typography;

const StatCard = ({ title, value, suffix, trend, trendLabel, color, bg, icon, loading }) => (
  <Card
    style={{
      borderRadius: 10, border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden', position: 'relative',
    }}
    styles={{ body: { padding: '20px 24px' } }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <Text style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>{title}</Text>
        {loading ? (
          <Spin size="small" />
        ) : (
          <>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : (value ?? '—')}
              {suffix && <span style={{ fontSize: 13, fontWeight: 500, color: '#666', marginLeft: 4 }}>{suffix}</span>}
            </div>
            {trendLabel && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12, color: '#aaa' }}>{trendLabel}</Text>
              </div>
            )}
          </>
        )}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color, flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => setStats(res.data?.data))
      .catch(err => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Tổng quan hệ thống</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Đây là tóm tắt hoạt động hệ thống.</Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            loading={loading}
            title="Tổng số Tour"
            value={stats?.total_tours}
            icon={<EnvironmentOutlined />}
            color="#1F4529" bg="rgba(31,69,41,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            loading={loading}
            title="Booking tháng này"
            value={stats?.bookings_this_month}
            trendLabel={`Tổng: ${stats?.total_bookings ?? '—'} đơn`}
            icon={<CalendarOutlined />}
            color="#1677ff" bg="rgba(22,119,255,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            loading={loading}
            title="Doanh thu tháng"
            value={stats?.revenue_this_month}
            suffix="đ"
            trendLabel={`Tổng: ${stats?.total_revenue?.toLocaleString('vi-VN') ?? '—'}đ`}
            icon={<RiseOutlined />}
            color="#d46b08" bg="rgba(212,107,8,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            loading={loading}
            title="Nhân viên"
            value={stats?.total_employees}
            icon={<UserOutlined />}
            color="#722ed1" bg="rgba(114,46,209,0.1)"
          />
        </Col>
      </Row>

      {/* Quick stats row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="Booking chờ xác nhận"
              value={loading ? '—' : (stats?.pending_bookings ?? 0)}
              valueStyle={{ color: '#fa8c16', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="Liên hệ chưa xử lý"
              value={loading ? '—' : (stats?.new_contact_messages ?? 0)}
              valueStyle={{ color: '#1677ff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic
              title="Tổng Tour đang hoạt động"
              value={loading ? '—' : (stats?.total_tours ?? 0)}
              valueStyle={{ color: '#1F4529', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
