import { useState, useEffect } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'
import { passApi } from '../api/api'

const AdventurePass = () => {
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPasses = async () => {
      setLoading(true)
      try {
        const response = await passApi.getPasses()
        if (response.data && response.data.status === 'success') {
          setPasses(response.data.data)
        } else {
          setPasses(Array.isArray(response.data) ? response.data : [])
        }
      } catch (err) {
        console.error('Error fetching passes:', err)
        setError('Không thể tải danh sách thẻ. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchPasses()
  }, [])

  const handleChoosePass = (passId) => {
    alert(`Bạn đã chọn thẻ có ID: ${passId}. Tính năng thanh toán thẻ đang được cập nhật.`)
  }

  const getHeaderClass = (title) => {
    const t = title.toUpperCase()
    if (t.includes('TRIAL')) return 'bg-dark-green'
    if (t.includes('SHARING')) return 'bg-orange'
    return 'bg-black'
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero pass-hero">
        <div className="hero-overlay" style={{ background: 'none' }}></div>
        <div className="hero-content container fade-in-up">
          <h1 className="hero-title pass-hero-title">
            ONE PAY
            <br />
            ONE ADVENTURE YEAR
          </h1>
        </div>
        <div className="scroll-down" aria-hidden="true">
          <ChevronDown />
        </div>
      </section>

      {/* Intro Section */}
      <section className="section pass-intro bg-white" id="intro">
        <div className="container text-center">
          <FadeIn>
            <h2 className="pass-intro-title">
              Khám phả <span className="text-orange">"Adventure Year"</span>
              <br />
              trong mỗi Nhà Chinh Phục
            </h2>
          </FadeIn>
          <FadeIn className="pass-intro-text">
            <p>
              "Adventure" - Cảm giác phiêu lưu trong mỗi Nhà Chinh Phục đều có một định nghĩa riêng! Đối với bạn, một
              năm phiêu lưu "cực đã" sẽ như thế nào? - Đơn giản là đôi ba chuyến "tắm rừng" chữa lành, những hành
              trình không internet để kết nối với nhau, hay nhiều hơn thế?
            </p>
            <p>
              Bắt đầu một năm phiêu lưu bùng nổ xúc cảm với đa dạng bộ môn thể thao cùng One Pay, One Adventure Year
              thôi nào! Mỗi dòng thẻ đều được thiết kế để tạo nên một năm "Yeah Cực Đã" cho các Nhà Chinh Phục.
            </p>
            <ul className="pass-intro-list">
              <li>Không giới hạn trong loại hình hiking, trekking!</li>
              <li>Không giới hạn trong từng cấp độ cung đường!</li>
              <li>Không chỉ là một chiếc thẻ!</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Pass Cards Section */}
      <section className="section pass-cards" id="passes">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <div className="pass-grid">
              {passes.map((pass, index) => (
                <FadeIn key={pass.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="pass-card">
                    <div className={`pass-card-header ${getHeaderClass(pass.title)}`}>
                      <img
                        src="https://toongadventure.com/wp-content/uploads/2023/12/logo-white.svg"
                        alt="Logo"
                        className="pass-logo"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <h3>
                        {pass.title}
                        <br />
                        <em>{pass.subtitle || 'PASS'}</em>
                      </h3>
                      {pass.isSignature && <div className="signature-badge">Phiên bản giới hạn</div>}
                    </div>
                    <div className="pass-card-body">
                      <div className="pass-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pass.price || 0)}
                      </div>
                      <ul className="pass-features">
                        {pass.features && pass.features.map((feature, i) => (
                          <li key={i}>
                            {feature.isBold ? <strong>{feature.content}</strong> : feature.content}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="btn pass-btn w-100"
                        onClick={() => handleChoosePass(pass.id)}
                        aria-label={`Chọn ${pass.title} pass`}
                      >
                        Chọn thẻ
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default AdventurePass
