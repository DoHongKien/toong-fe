import { useRef, useState, useEffect } from 'react'
import { Clock, BarChart2, Map, Users, ChevronDown, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!bodyRef.current) return
    if (defaultOpen) {
      bodyRef.current.style.maxHeight = bodyRef.current.scrollHeight + 'px'
    }
  }, [defaultOpen])

  const handleToggle = () => {
    const nextOpen = !isOpen
    setIsOpen(nextOpen)
    if (!bodyRef.current) return
    bodyRef.current.style.maxHeight = nextOpen ? bodyRef.current.scrollHeight + 'px' : '0'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className={`accordion-item${isOpen ? ' active' : ''}`}>
      <div
        className="accordion-header"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-body-${title}`}
      >
        <h3>{title}</h3>
        <ChevronDown className="accordion-icon" />
      </div>
      <div className="accordion-body" ref={bodyRef} id={`accordion-body-${title}`} role="region">
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  )
}

const quickStats = [
  { icon: <Clock />, label: 'Thời gian', value: '2 Ngày 1 Đêm' },
  { icon: <BarChart2 />, label: 'Độ khó', value: 'Vừa phải' },
  { icon: <Map />, label: 'Quãng đường', value: '~30 km' },
  { icon: <Users />, label: 'Độ tuổi', value: '12 - 50 tuổi' },
]

const includedItems = [
  'Xe giường nằm khứ hồi HCMC',
  'Xe trung chuyển vào bìa rừng',
  'Các bữa ăn trong chương trình (BBQ)',
  'Lều trại, túi ngủ tiêu chuẩn (2-3 người/lều)',
  'Bảo hiểm du lịch 100tr/vụ',
  'Đội ngũ Hướng dẫn viên, Y Tế chuẩn',
]

const day1Timeline = [
  { time: '06:00', desc: 'Tập trung ăn sáng tại Tà Năng.' },
  { time: '08:30', desc: 'Khởi động, bắt đầu hành trình trekking qua đồng cỏ và rừng thông.' },
  { time: '12:00', desc: 'Nghỉ trưa bên suối, thưởng thức món ngon do porter chuẩn bị.' },
  { time: '15:00', desc: 'Chinh phục con dốc cao nhất hành trình, ngắm toàn cảnh đồi cỏ hùng vĩ.' },
  { time: '16:30', desc: 'Đến điểm hạ trại. Ngắm hoàng hôn tuyệt đẹp trên đồi cỏ.' },
  { time: '18:30', desc: 'Tiệc nướng BBQ, giao lưu đốt lửa trại.' },
]

const day2Timeline = [
  { time: '05:30', desc: 'Đón bình minh, thưởng thức cà phê sáng giữa sương sớm.' },
  { time: '08:00', desc: 'Bắt đầu chặng đổ dốc về Phan Dũng. Cảnh sắc thay đổi từ đồi cỏ sang rừng thường xanh.' },
  { time: '12:00', desc: 'Nghỉ trưa, tắm suối mát lạnh.' },
  { time: '15:00', desc: 'Băng qua Suối Lớn, có xe ôm trải nghiệm đón ra khỏi rừng.' },
  { time: '17:00', desc: 'Về đến xã Phan Dũng. Lên xe di chuyển về TP.HCM. Kết thúc hành trình.' },
]

const TourDetail = () => {
  const handleBookClick = () => {
    // Booking action
  }

  const handleConsultClick = () => {
    // Consult action
  }

  return (
    <>
      <Navbar alwaysScrolled />

      {/* Detail Hero */}
      <section className="detail-hero">
        <img
          src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Tà Năng Phan Dũng"
          className="detail-hero-img"
        />
        <div className="hero-overlay"></div>
        <div className="container detail-hero-content fade-in-up">
          <span className="tour-tag">Trekking Miền Nam</span>
          <h1 className="detail-title">Tà Năng - Phan Dũng</h1>
          <p className="detail-subtitle">
            Cung đường trekking qua ba tỉnh Lâm Đồng, Ninh Thuận và Bình Thuận, được mệnh danh là cung đường trekking
            đẹp nhất Việt Nam.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section detail-content">
        <div className="container">
          <div className="detail-layout">
            {/* Left Column */}
            <div className="detail-main">
              {/* Quick Stats */}
              <FadeIn className="quick-stats">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="stat-item">
                    {stat.icon}
                    <div>
                      <strong>{stat.label}</strong>
                      <span>{stat.value}</span>
                    </div>
                  </div>
                ))}
              </FadeIn>

              {/* Description */}
              <FadeIn className="content-block">
                <h2>Tổng Quan Hành Trình</h2>
                <p>
                  Tà Năng - Phan Dũng băng qua ba tỉnh Lâm Đồng, Ninh Thuận, Bình Thuận. Khởi đầu từ những đồi thông
                  xanh ngát của xứ lạnh, đi qua những đồi cỏ trập trùng, trải nghiệm cảnh sắc thay đổi kỳ diệu từ
                  rừng rậm đến những đồng cỏ cháy, kết thúc tại cái nắng gió của miền duyên hải.
                </p>
                <p>
                  Nếu bạn muốn tìm một kỳ nghỉ cuối tuần hoàn toàn thoát ly khỏi khói bụi thành phố, Tà Năng - Phan
                  Dũng sẽ đem lại cảm giác tự do, thong dong bước chân giữa thiên nhiên rộng lớn.
                </p>
              </FadeIn>

              {/* Itinerary */}
              <FadeIn className="content-block">
                <h2>Lịch Trình Chi Tiết</h2>
                <div className="itinerary-accordion">
                  <AccordionItem title="Ngày 1: Chinh phục đồi cỏ Tà Năng" defaultOpen>
                    <ul className="timeline">
                      {day1Timeline.map((item) => (
                        <li key={item.time}>
                          <strong>{item.time}:</strong> {item.desc}
                        </li>
                      ))}
                    </ul>
                  </AccordionItem>

                  <AccordionItem title="Ngày 2: Rừng thường xanh Phan Dũng">
                    <ul className="timeline">
                      {day2Timeline.map((item) => (
                        <li key={item.time}>
                          <strong>{item.time}:</strong> {item.desc}
                        </li>
                      ))}
                    </ul>
                  </AccordionItem>
                </div>
              </FadeIn>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <FadeIn className="detail-sidebar">
              <div className="booking-card sticky-sidebar">
                <div className="booking-price">
                  <span className="amount">2,990,000₫</span>
                  <span className="unit">/ Khách</span>
                </div>
                <ul className="included-list">
                  {includedItems.map((item) => (
                    <li key={item}>
                      <Check /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleBookClick}
                  aria-label="Đặt chuyến này"
                >
                  Đặt Chuyến Này
                </button>
                <button
                  className="btn btn-outline w-100"
                  onClick={handleConsultClick}
                  aria-label="Tư vấn miễn phí"
                >
                  Tư Vấn Miễn Phí
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer minimal />
    </>
  )
}

export default TourDetail
