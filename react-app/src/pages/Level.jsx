import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { Mountain, TrendingUp, Clock, Map, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const radarData = {
  labels: ['Tiếp cận y tế', 'Độ cao đỉnh', 'Tăng độ cao tích lũy', 'Thời gian hoạt động', 'Độ dài'],
  datasets: [
    {
      label: 'Nature Walking',
      data: [1, 1, 1, 1, 1],
      backgroundColor: 'rgba(56, 178, 107, 0.2)',
      borderColor: 'rgba(56, 178, 107, 1)',
      pointBackgroundColor: 'rgba(56, 178, 107, 1)',
    },
    {
      label: 'Mountain Hiking',
      data: [3, 3, 2, 3, 3],
      backgroundColor: 'rgba(41, 128, 185, 0.2)',
      borderColor: 'rgba(41, 128, 185, 1)',
      pointBackgroundColor: 'rgba(41, 128, 185, 1)',
    },
    {
      label: 'Trekking',
      data: [5, 5, 5, 5, 4],
      backgroundColor: 'rgba(231, 76, 60, 0.2)',
      borderColor: 'rgba(231, 76, 60, 1)',
      pointBackgroundColor: 'rgba(231, 76, 60, 1)',
    },
  ],
}

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: 'rgba(0,0,0,0.1)' },
      grid: { color: 'rgba(0,0,0,0.1)' },
      pointLabels: {
        font: { family: 'Inter', size: 13, weight: '600' },
        color: '#333',
      },
      ticks: { display: false, min: 0, max: 5 },
    },
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { family: 'Inter', size: 14 } },
    },
  },
}

const levels = [
  {
    id: 1,
    reverse: false,
    image: 'https://toongadventure.com/wp-content/uploads/2023/12/nature-walking-icon.png',
    imageFallback: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Nature Walking',
    badgeClass: 'badge-green',
    badgeLabel: 'Level 1',
    titleColor: '#38b26b',
    title: 'Nature Walking',
    score: '< 1.5',
    desc: 'Cấp độ cốt lõi dành cho người mới bắt đầu. Hành trình chủ yếu đi bộ trên đường mòn, bề mặt địa hình đơn giản. Không đòi hỏi quá nhiều sức lực, mục đích chính là hòa mình thư giãn và tận hưởng thiên nhiên.',
    stats: [
      { icon: <Mountain />, text: 'Độ cao đỉnh: Dưới 1.800m' },
      { icon: <TrendingUp />, text: 'Tăng độ cao: Dưới 600m' },
      { icon: <Clock />, text: 'Thời gian HĐ: Dưới 6 giờ/ngày' },
    ],
    btnColor: '#38b26b',
    btnLabel: 'Khám phá Nature Walking',
  },
  {
    id: 2,
    reverse: true,
    image: 'https://toongadventure.com/wp-content/uploads/2023/12/mountain-hiking-icon.png',
    imageFallback: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Mountain Hiking',
    badgeClass: 'badge-blue',
    badgeLabel: 'Level 2',
    titleColor: '#2980b9',
    title: 'Mountain Hiking',
    score: '1.6 đến 2.5',
    desc: 'Dành cho người đã có trải nghiệm leo núi, thể lực tốt. Đòi hỏi di chuyển liên tục trên địa hình đồi dốc. Hành trình cần có sự chuẩn bị tốt về trang thiết bị.',
    stats: [
      { icon: <Mountain />, text: 'Độ cao đỉnh: 1.800m - 2.400m' },
      { icon: <TrendingUp />, text: 'Tăng độ cao: 600m - 1.000m' },
      { icon: <Map />, text: 'Chiều dài: 15km - 25km' },
      { icon: <Clock />, text: 'Thời gian HĐ: 5 - 7 giờ/ngày' },
    ],
    btnColor: '#2980b9',
    btnLabel: 'Khám phá Mountain Hiking',
  },
  {
    id: 3,
    reverse: false,
    image: 'https://toongadventure.com/wp-content/uploads/2023/12/trekking-icon.png',
    imageFallback: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Trekking',
    badgeClass: 'badge-red',
    badgeLabel: 'Level 3',
    titleColor: '#e74c3c',
    title: 'Trekking',
    score: 'Lớn hơn 2.5',
    desc: 'Cấp độ mạo hiểm cao nhất, đòi hỏi thể lực bền bỉ và kinh nghiệm dày dặn. Hành trình tiến sâu vào rừng rậm, địa hình dốc cao liên tục và rất đa dạng. Dành cho những ai thực sự muốn bứt phá mọi giới hạn bản thân.',
    stats: [
      { icon: <Mountain />, text: 'Độ cao đỉnh: 2.500m - 3.200m' },
      { icon: <TrendingUp />, text: 'Tăng độ cao: 1.000m - 1.800m' },
      { icon: <Map />, text: 'Chiều dài: 25km - 35km' },
      { icon: <Clock />, text: 'Thời gian HĐ: 7 - 9 giờ/ngày' },
    ],
    btnColor: '#e74c3c',
    btnLabel: 'Khám phá Trekking',
  },
]

const Level = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero hero-level">
        <div className="hero-overlay"></div>
        <div className="hero-content container fade-in-up">
          <span className="hero-subtitle">Hệ thống phân loại</span>
          <h1 className="hero-title">Cấp Độ Mạo Hiểm</h1>
          <p className="hero-params">Tiêu chuẩn hóa quốc tế • Lựa chọn phù hợp</p>
        </div>
        <div className="scroll-down" aria-hidden="true">
          <ChevronDown />
        </div>
      </section>

      {/* Radar Chart Section */}
      <section className="section radar-section bg-white" id="radar">
        <div className="container">
          <FadeIn className="section-header text-center">
            <h2 className="section-title">Tiêu Chí Phân Loại</h2>
            <p className="section-desc">
              Các cấp độ mạo hiểm được Tổ Ong xây dựng và đánh giá dựa trên 5 tiêu chí định lượng khắt khe.
            </p>
          </FadeIn>
          <FadeIn className="radar-container text-center">
            <Radar data={radarData} options={radarOptions} aria-label="Biểu đồ so sánh cấp độ mạo hiểm" />
          </FadeIn>
        </div>
      </section>

      {/* Levels Section */}
      <section className="section level-details" id="level-details">
        <div className="container">
          {levels.map((level) => (
            <FadeIn key={level.id}>
              <div className={`level-card${level.reverse ? ' reverse' : ''}`}>
                {!level.reverse && (
                  <div className="level-image">
                    <img
                      src={level.image}
                      alt={level.imageAlt}
                      onError={(e) => {
                        e.currentTarget.src = level.imageFallback
                      }}
                    />
                  </div>
                )}

                <div className="level-content">
                  <div className={`level-badge ${level.badgeClass}`}>{level.badgeLabel}</div>
                  <h2 className="level-title" style={{ color: level.titleColor }}>
                    {level.title}
                  </h2>
                  <p className="level-score">
                    Điểm trung bình: <strong>{level.score}</strong>
                  </p>
                  <p className="level-desc">{level.desc}</p>
                  <ul className="level-stats">
                    {level.stats.map((stat, i) => (
                      <li key={i}>
                        {stat.icon} {stat.text}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/tours"
                    className="btn btn-outline"
                    style={{ borderColor: level.btnColor, color: level.btnColor }}
                    tabIndex={0}
                  >
                    {level.btnLabel}
                  </Link>
                </div>

                {level.reverse && (
                  <div className="level-image">
                    <img
                      src={level.image}
                      alt={level.imageAlt}
                      onError={(e) => {
                        e.currentTarget.src = level.imageFallback
                      }}
                    />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Level
