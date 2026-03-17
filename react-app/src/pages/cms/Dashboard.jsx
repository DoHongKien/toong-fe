import React from 'react';
import { Row, Col, Card, Statistic, Typography, Timeline, Tag, Avatar, Progress } from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CrownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StatCard = ({ title, value, suffix, prefix, trend, trendLabel, color, bg, icon }) => (
  <Card
    style={{
      borderRadius: 10,
      border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      position: 'relative',
    }}
    styles={{ body: { padding: '20px 24px' } }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <Text style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>{title}</Text>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          {suffix && <span style={{ fontSize: 13, fontWeight: 500, color: '#666', marginLeft: 4 }}>{suffix}</span>}
        </div>
        {trend !== undefined && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 12 }} />
            <Text style={{ fontSize: 12, color: '#52c41a', fontWeight: 600 }}>+{trend}%</Text>
            <Text style={{ fontSize: 12, color: '#aaa' }}>{trendLabel}</Text>
          </div>
        )}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const recentActivities = [
    { color: 'green', dot: <CheckCircleOutlined />, label: 'Booking BK-10295 đã được xác nhận', time: '5 phút trước' },
    { color: 'blue', dot: <CalendarOutlined />, label: 'Tour "Tà Năng - Phan Dũng" có thêm 3 booking mới', time: '1 giờ trước' },
    { color: 'orange', dot: <CrownOutlined />, label: 'Hội viên Lê Cường kích hoạt Adventure Pass', time: '2 giờ trước' },
    { color: 'purple', dot: <UserOutlined />, label: 'Nhân viên mới Trần Minh A được thêm vào hệ thống', time: '5 giờ trước' },
    { color: 'green', dot: <CheckCircleOutlined />, label: 'Tour "Bidoup - Núi Bà" đã được cập nhật lịch khởi hành', time: 'Hôm qua' },
  ];

  const topTours = [
    { name: 'Tà Năng - Phan Dũng', bookings: 48, revenue: 168000000, pct: 90 },
    { name: 'Bidoup - Núi Bà', bookings: 31, revenue: 55800000, pct: 65 },
    { name: 'Cung Đường Gia Lai', bookings: 19, revenue: 47500000, pct: 40 },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>Tổng quan hệ thống</Title>
        <Text style={{ color: '#888', fontSize: 13 }}>Chào mừng trở lại, Admin! Đây là tóm tắt hoạt động hôm nay.</Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số Tour"
            value={12}
            trend={8}
            trendLabel="so tháng trước"
            icon={<EnvironmentOutlined />}
            color="#1F4529"
            bg="rgba(31,69,41,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Booking tháng này"
            value={48}
            trend={14}
            trendLabel="so tháng trước"
            icon={<CalendarOutlined />}
            color="#1677ff"
            bg="rgba(22,119,255,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Doanh thu tháng"
            value={112893000}
            suffix="đ"
            trend={22}
            trendLabel="so tháng trước"
            icon={<RiseOutlined />}
            color="#d46b08"
            bg="rgba(212,107,8,0.1)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Hội viên Pass"
            value={320}
            trend={5}
            trendLabel="so tháng trước"
            icon={<CrownOutlined />}
            color="#722ed1"
            bg="rgba(114,46,209,0.1)"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {/* Recent activity */}
        <Col xs={24} lg={14}>
          <Card
            title={<span style={{ fontWeight: 600 }}>Hoạt động gần đây</span>}
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
          >
            <Timeline
              items={recentActivities.map(a => ({
                color: a.color,
                dot: a.dot,
                children: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 13 }}>{a.label}</Text>
                    <Text style={{ fontSize: 11, color: '#bbb', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 3 }} />{a.time}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Top tours */}
        <Col xs={24} lg={10}>
          <Card
            title={<span style={{ fontWeight: 600 }}>Tour nổi bật</span>}
            style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {topTours.map((tour, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: 500 }}>{tour.name}</Text>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Tag color="green" style={{ margin: 0, fontSize: 11 }}>{tour.bookings} booking</Tag>
                    </div>
                  </div>
                  <Progress
                    percent={tour.pct}
                    showInfo={false}
                    strokeColor={{ from: '#1F4529', to: '#47663B' }}
                    trailColor="#f0f0f0"
                    size="small"
                  />
                  <Text style={{ fontSize: 11, color: '#999' }}>
                    Doanh thu: {tour.revenue.toLocaleString('vi-VN')}đ
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick stats row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic title="Booking chờ xác nhận" value={7} valueStyle={{ color: '#fa8c16', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic title="Liên hệ chưa xử lý" value={4} valueStyle={{ color: '#1677ff', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
            styles={{ body: { padding: '16px' } }}>
            <Statistic title="Nhân viên hoạt động" value={5} valueStyle={{ color: '#1F4529', fontWeight: 700 }}
              suffix={<Text style={{ fontSize: 13, color: '#999' }}>/ 6</Text>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
