import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, BarChart, ShieldCheck, Users, Leaf, Compass, ChevronDown, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'
import { tourApi } from '../api/api'

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
  const [popularTours, setPopularTours] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await tourApi.getAllTours()
        let toursData = []
        if (response.data && response.data.status === 'success') {
          toursData = response.data.data
        } else {
          toursData = Array.isArray(response.data) ? response.data : []
        }
        setPopularTours(toursData.slice(0, 3))
      } catch (err) {
        console.error('Error fetching home tours:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

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

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="tours-grid">
              {popularTours.map((tour, index) => (
                <FadeIn key={tour.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="tour-card">
                    <div className="tour-image">
                      <img src={tour.cardImage} alt={tour.name} />
                      {tour.badge && (
                        <div className="tour-badge">{tour.badge}</div>
                      )}
                    </div>
                    <div className="tour-info">
                      <h3>{tour.name}</h3>
                      <div className="tour-meta">
                        <span>
                          <Clock /> {tour.durationDays}N{tour.durationNights}Đ
                        </span>
                        <span>
                          <BarChart /> {tour.difficulty}
                        </span>
                      </div>
                      <p>{tour.summary}</p>
                      <Link to={`/tours/${tour.slug}`} className="btn btn-outline">
                        Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

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
