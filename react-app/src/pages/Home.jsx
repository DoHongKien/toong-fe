import { Link } from 'react-router-dom'
import { Clock, BarChart, ShieldCheck, Users, Leaf, Compass, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'

const popularTours = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Tà Năng Phan Dũng',
    badge: 'Best Seller',
    badgeClass: '',
    title: 'Tà Năng - Phan Dũng',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Vừa phải',
    desc: 'Cung đường trekking đẹp nhất Việt Nam, băng qua những đồi cỏ xanh ngút ngàn.',
    delay: '0ms',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Bù Gia Mập',
    badge: 'New',
    badgeClass: 'new',
    title: 'Vườn Quốc Gia Bù Gia Mập',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Dễ',
    desc: 'Khám phá hệ sinh thái đa dạng, tắm suối mát lạnh giữa rừng nguyên sinh.',
    delay: '100ms',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: '8 Nàng Tiên',
    badge: null,
    badgeClass: '',
    title: '8 Nàng Tiên - Ninh Thuận',
    duration: '3 Ngày 2 Đêm',
    difficulty: 'Thử thách',
    desc: 'Chinh phục cung đường ven biển tuyệt đẹp, cắm trại lấp lánh dưới dải ngân hà.',
    delay: '200ms',
  },
]

const features = [
  {
    id: 1,
    icon: <ShieldCheck />,
    title: 'An Toàn Tuyệt Đối',
    desc: 'Tỉ lệ hỗ trợ 1:4 (1 guide/4 khách). Đội ngũ cứu hộ chuyên nghiệp, trang thiết bị y tế đầy đủ.',
    delay: '0ms',
  },
  {
    id: 2,
    icon: <Users />,
    title: 'Đội Ngũ Tận Tâm',
    desc: 'Hướng dẫn viên bản địa am hiểu địa hình, đầu bếp riêng phục vụ các bữa ăn đẳng cấp giữa rừng.',
    delay: '100ms',
  },
  {
    id: 3,
    icon: <Leaf />,
    title: 'Du Lịch Bền Vững',
    desc: 'Cam kết không để lại rác (Leave No Trace). Bảo vệ môi trường và đóng góp cho cộng đồng địa phương.',
    delay: '200ms',
  },
  {
    id: 4,
    icon: <Compass />,
    title: 'Đa Dạng Lộ Trình',
    desc: 'Từ những cung đường cắm trại thư giãn đến các đỉnh núi thử thách giới hạn bản thân.',
    delay: '300ms',
  },
]

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container fade-in-up">
          <span className="hero-subtitle">Khám phá thiên nhiên hoang dã</span>
          <h1 className="hero-title">
            Đánh Thức Bản
            <br />
            Năng Mạo Hiểm
          </h1>
          <p className="hero-params">Đội ngũ chuyên nghiệp • Tỉ lệ 1:4 • Bền vững</p>
          <Link to="/tours" className="btn btn-hero">
            Tìm Cung Phù Hợp
          </Link>
        </div>
        <div className="scroll-down" aria-hidden="true">
          <ChevronDown />
        </div>
      </section>

      {/* Popular Tours */}
      <section className="section popular-tours" id="tours">
        <div className="container">
          <FadeIn className="section-header">
            <h2 className="section-title">Các Cung Nổi Bật</h2>
            <p className="section-desc">
              Những hành trình trekking được yêu thích nhất, thỏa mãn mọi đam mê xê dịch.
            </p>
          </FadeIn>

          <div className="tours-grid">
            {popularTours.map((tour) => (
              <FadeIn key={tour.id} style={{ transitionDelay: tour.delay }}>
                <div className="tour-card">
                  <div className="tour-image">
                    <img src={tour.image} alt={tour.alt} />
                    {tour.badge && (
                      <div className={`tour-badge${tour.badgeClass ? ` ${tour.badgeClass}` : ''}`}>{tour.badge}</div>
                    )}
                  </div>
                  <div className="tour-info">
                    <h3>{tour.title}</h3>
                    <div className="tour-meta">
                      <span>
                        <Clock /> {tour.duration}
                      </span>
                      <span>
                        <BarChart /> {tour.difficulty}
                      </span>
                    </div>
                    <p>{tour.desc}</p>
                    <Link to="/tour-detail" className="btn btn-outline">
                      Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-5">
            <FadeIn>
              <Link to="/tours" className="btn btn-primary">
                Xem Tất Cả Các Cung
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Choose Toong */}
      <section className="section features" id="features">
        <div className="container">
          <FadeIn className="section-header text-center text-white">
            <h2 className="section-title">Lý Do Chọn Tổ Kiến</h2>
            <p className="section-desc text-white-50">
              Sự an toàn và trải nghiệm của bạn là ưu tiên hàng đầu của chúng tôi.
            </p>
          </FadeIn>

          <div className="features-grid text-white">
            {features.map((feature) => (
              <FadeIn key={feature.id} style={{ transitionDelay: feature.delay }}>
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home
