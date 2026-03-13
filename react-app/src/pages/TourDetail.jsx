import { useRef, useState, useEffect } from 'react'
import { Clock, BarChart2, Map, Users, ChevronDown, Check, X, Share2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'
import BookingModal from '../components/BookingModal'

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
  'Xe giường nằm khứ hồi và xe trung chuyển (nếu có) đưa đón toàn bộ hành trình.',
  'Y tế: Trang thiết bị kit y tế tiêu chuẩn.',
  'Ăn uống: bao gồm 06 bữa ăn chính (Thực đơn chay - theo yêu cầu).',
  'Bãi cắm trại có nhà tắm, nhà vệ sinh, nước tắm và vệ sinh cơ bản.',
  'Nước uống: Nước suối 1,5 lít được cung cấp trước và tiếp nước tại lán trại.',
  'Trang thiết bị: lều, túi ngủ, gối ngủ, tấm lót cách nhiệt.',
  'Hướng dẫn viên chuyên nghiệp có kinh nghiệm ở các địa hình hiking tại Việt Nam, có các chứng chỉ an toàn về sơ cấp cứu, cứu hộ.',
  'Bộ dụng cụ leo núi: áo mưa, đèn pin.',
  'Hướng dẫn địa phương am hiểu tuyến đường, địa hình hỗ trợ đoàn trong hành trình hiking.',
  'Bảo hiểm du lịch.',
  'Hậu cần chu đáo, đảm bảo khẩu phần và vệ sinh an toàn thực phẩm.',
  'Phí tham quan và lưu trú tại Vườn Quốc Gia.',
  'Hỗ trợ ký gửi túi gửi hành lí 5 lít (túi sẽ do Tổ Kiến chuẩn bị).',
]

const excludedItems = [
  'Các chi phí cá nhân ngoài chương trình: Vé máy bay, tàu, ăn uống...',
  'Tiền tips cho hướng dẫn và khuân vác.',
]

const discounts = [
  'Đăng ký trước 45 ngày: Giảm 7%',
  'Đăng ký trước 30 ngày: Giảm 5%',
  'Khách cũ đã tham gia: Giảm 5%',
  'Nhóm từ 8 thành viên: Giảm 200k/ người',
  'Nhóm từ 5 thành viên: Giảm 150k/ người',
  'Nhóm từ 3 thành viên: Giảm 100k/ người',
]

const luggageItems = [
  'QUẦN ÁO: Mỏng nhẹ, dễ vận động, thấm hút tốt, nhanh khô',
  'BALO: Có đai trợ lực, gọn nhẹ',
  'GIÀY: Chọn giày có độ bám tốt, có rãnh sâu để chống trơn trượt',
  'ÁO KHOÁC GIỮ NHIỆT TỐT',
  'ĐỒ CHỐNG NẮNG: Kem chống nắng, mũ rộng vành, găng tay chống nắng, bao tay, tất',
  'ĐỒ DÙNG CÁ NHÂN VÀ CÁC THIẾT BỊ ĐIỆN TỬ CẦN THIẾT',
  'THUỐC CÁ NHÂN: Viên bù nước, điện giải, xịt chống côn trùng',
  'ĐỒ ĂN NHẸ: Lương khô, chocolate, bánh kẹo',
  'DÉP: Dùng khi sinh hoạt tại bãi trại',
  'ĐỒ BƠI (nếu cần): Dùng khi tắm biển',
  'TẤT: Chọn loại dày, nên có ít nhất 2 đôi để dự phòng',
  'GIẤY TỜ: Căn cước công dân hoặc App VNeID',
]

const notes = [
  'Khách hàng đăng ký trước thứ 4 hằng tuần, bên cạnh Giấy chứng nhận sẽ nhận được 1 THẺ CHINH PHỤC sau khi hoàn thành cung đường với những ưu đãi đặc biệt đến từ đối tác của Tổ Kiến Adventure.',
  'ĐỐI VỚI KHÁCH NƯỚC NGOÀI có yêu cầu Tourguide tiếng Anh, phụ thu 300.000đ/ người. Đăng ký trước 7 ngày (đối với ngày thường) và trước 30 ngày (đối với lễ, Tết).',
]

const departures = [
  { date: '05/04/2026', endDate: '06/04/2026', paymentDeadline: '03/04/2026', depositDate: '20/03/2026', price: '2.990.000 VND' },
  { date: '19/04/2026', endDate: '20/04/2026', paymentDeadline: '17/04/2026', depositDate: '21/03/2026', price: '2.990.000 VND' },
  { date: '03/05/2026', endDate: '04/05/2026', paymentDeadline: '01/05/2026', depositDate: '22/03/2026', price: '2.990.000 VND' },
  { date: '05/05/2026', endDate: '06/05/2026', paymentDeadline: '03/05/2026', depositDate: '23/03/2026', price: '2.990.000 VND' },
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

const faqItems = [
  {
    q: 'Tour có phù hợp với người chưa từng trekking không?',
    a: 'Tour phù hợp với người có sức khỏe bình thường và chưa có kinh nghiệm trekking. Chúng tôi có hướng dẫn viên và hướng dẫn địa phương đi kèm suốt hành trình để hỗ trợ bạn.'
  },
  {
    q: 'Tôi có thể mang theo trẻ em không?',
    a: 'Tour phù hợp với độ tuổi từ 12 – 50 tuổi. Trẻ em dưới 12 tuổi không được khuyến khích tham gia do địa hình khá khó đi và yêu cầu sức bền nhất định.'
  },
  {
    q: 'Chính sách hủy tour như thế nào?',
    a: 'Hủy trước 15 ngày: hoàn 70% tiền cọc. Hủy trong vòng 7–14 ngày: hoàn 50%. Hủy trong vòng 7 ngày: không hoàn tiền. Tổ Kiến có thể hỗ trợ chuyển sang đoàn khác nếu bạn báo sớm.'
  },
  {
    q: 'Tôi có thể mang thú cưng theo không?',
    a: 'Rất tiếc, vì lý do an toàn và quy định của Vườn Quốc Gia, bạn không thể mang theo thú cưng trong chuyến trekking này.'
  },
  {
    q: 'Có cần chuẩn bị gì về sức khỏe trước khi đi không?',
    a: 'Bạn nên tập luyện thể lực nhẹ (đi bộ, chạy bộ) ít nhất 2–3 tuần trước chuyến đi. Người có bệnh lý tim mạch, huyết áp hoặc các bệnh mãn tính nên tham khảo ý kiến bác sĩ trước khi đăng ký.'
  },
  {
    q: 'Thời tiết tại Tà Năng – Phan Dũng như thế nào?',
    a: 'Thời tiết thay đổi theo mùa. Mùa khô (tháng 12 – 4) là thời điểm lý tưởng nhất với đồi cỏ vàng ruộm. Mùa mưa (tháng 6 – 10) đường dốc trơn trượt, không được tổ chức tour vì lý do an toàn.'
  },
]

const similarTours = [
  {
    id: 1,
    name: 'Nặm Me',
    desc: 'Nặm Me - Cung đường Hiking khám phá thác Nặm Me hùng vĩ của vùng đất Tuyên Quang. Băng qua cánh rừng nguyên sinh, chinh phục thác Khuổi Nhi, cắm trại tại bãi campsite hoang sơ, chèo SUP ngắm nhìn mặt hồ xanh...',
    originalPrice: '2,990,000 VND',
    price: '2,690,000 VND',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Đà Bắc',
    desc: 'Hành trình Đà Bắc sẽ đưa bạn đến xóm Ngòi Hoa và xóm Sưng, nơi vẻ đẹp thiên nhiên và văn hóa dân tộc hoà quyện bên dòng sông Đà. Bạn sẽ khám phá Hang Sung và Đồng Hoa Tiên huyền bí, chèo Sup trên dòng sông...',
    originalPrice: null,
    price: '2,490,000 VND',
    img: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Bù Gia Mập',
    desc: 'Bù Gia Mập - Cung đường khám phá cánh rừng xanh đa dạng nằm trên sự phì nhiêu của mảnh đất phù sa cổ, cách Sài Gòn chỉ hơn 200km. Hành trình 2 ngày 1 đêm walking xuyên địa hình rừng nhiệt đới ẩm thường xanh...',
    originalPrice: null,
    price: '2,490,000 VND',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Lùng Cúng',
    desc: 'Lùng Cúng là đỉnh cao thứ 11 Việt Nam tại Yên Bái với độ cao 2.913m. Chinh phục đỉnh Lùng Cúng bạn sẽ được trải nghiệm những thảm cỏ bát ngát, rừng trúc xanh mướt, và ngắm nhìn toàn cảnh vùng núi Tây Bắc hùng vĩ...',
    originalPrice: null,
    price: '2,790,000 VND',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Walking Hòn Bà',
    desc: 'Hòn Bà - Khu bảo tồn thiên nhiên hiếm có giữa lòng thành phố biển Nha Trang. Hành trình trekking xuyên rừng nguyên sinh, khám phá thác nước ẩn mình, cắm trại giữa không gian trong lành mát mẻ...',
    originalPrice: '3,200,000 VND',
    price: '2,990,000 VND',
    img: 'https://images.unsplash.com/photo-1439853949212-36cb17cd8cf2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Cao Bằng',
    desc: 'Khám phá vùng đất địa đầu Tổ quốc với những thác nước hùng vĩ, ruộng bậc thang trải dài, và nền văn hóa dân tộc đặc sắc. Hành trình chinh phục Thác Bản Giốc - thác nước đẹp nhất Đông Nam Á...',
    originalPrice: null,
    price: '3,190,000 VND',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  },
]

const SimilarToursCarousel = () => {
  const total = similarTours.length
  const GAP = 24 // px — must match CSS gap (24px)
  const trackRef = useRef(null)
  const currentIdx = useRef(0)
  const isResetting = useRef(false)
  const intervalRef = useRef(null)
  const isPaused = useRef(false)
  const cardWidthRef = useRef(0)

  // Keep latest helpers in refs to avoid stale closures in setInterval
  const helpersRef = useRef({})

  helpersRef.current.getCardWidth = () => {
    if (!trackRef.current) return 0
    const wrapper = trackRef.current.parentElement
    const wrapperWidth = wrapper.offsetWidth - 32 // 1rem padding each side
    const cardW = (wrapperWidth - GAP * 2) / 3
    wrapper.style.setProperty('--card-w', `${cardW}px`)
    cardWidthRef.current = cardW
    return cardW
  }

  helpersRef.current.applyTranslate = (idx, animated) => {
    if (!trackRef.current) return
    const cardW = cardWidthRef.current || helpersRef.current.getCardWidth()
    const offset = idx * (cardW + GAP)
    trackRef.current.style.transition = animated
      ? 'transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)'
      : 'none'
    trackRef.current.style.transform = `translateX(-${offset}px)`
  }

  helpersRef.current.advance = () => {
    if (isPaused.current || isResetting.current) return
    const h = helpersRef.current
    currentIdx.current += 1

    if (currentIdx.current >= total) {
      h.applyTranslate(currentIdx.current, true)
      isResetting.current = true
      setTimeout(() => {
        currentIdx.current = 0
        h.applyTranslate(0, false)
        isResetting.current = false
      }, 570)
    } else {
      h.applyTranslate(currentIdx.current, true)
    }
  }

  useEffect(() => {
    const h = helpersRef.current
    h.getCardWidth()
    h.applyTranslate(0, false)

    intervalRef.current = setInterval(() => helpersRef.current.advance(), 3000)

    const handleResize = () => {
      h.getCardWidth()
      h.applyTranslate(currentIdx.current, false)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const pause = () => {
    isPaused.current = true
    clearInterval(intervalRef.current)
  }

  const resume = () => {
    isPaused.current = false
    intervalRef.current = setInterval(() => helpersRef.current.advance(), 2000)
  }

  const extendedTours = [...similarTours, ...similarTours.slice(0, 3)]

  return (
    <div className="similar-tours-section">
      <h2 className="similar-tours-title">LỊCH TRÌNH TƯƠNG TỰ</h2>
      <div
        className="similar-tours-track-wrap"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="similar-tours-track similar-tours-track--slide" ref={trackRef}>
          {extendedTours.map((tour, i) => (
            <div className="similar-tour-card" key={`${tour.id}-${i}`}>
              <div className="similar-tour-img-wrap">
                <img src={tour.img} alt={tour.name} className="similar-tour-img" />
              </div>
              <div className="similar-tour-body">
                <h3 className="similar-tour-name">{tour.name}</h3>
                <p className="similar-tour-desc">{tour.desc}</p>
                <div className="similar-tour-price-block">
                  {tour.originalPrice && (
                    <span className="similar-tour-price-original">{tour.originalPrice}</span>
                  )}
                  <span className="similar-tour-price-current">{tour.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DepartureCarousel = ({ departures, onBook }) => {
  const total = departures.length
  const GAP = 24
  const trackRef = useRef(null)
  const currentIdx = useRef(0)
  const isResetting = useRef(false)
  const intervalRef = useRef(null)
  const isPaused = useRef(false)
  const cardWidthRef = useRef(0)
  const helpersRef = useRef({})

  helpersRef.current.getCardWidth = () => {
    if (!trackRef.current) return 0
    const wrapper = trackRef.current.parentElement
    const wrapperWidth = wrapper.offsetWidth
    // We show 4 cards on desktop by default
    let visibleCount = 4
    if (window.innerWidth <= 768) visibleCount = 1
    else if (window.innerWidth <= 992) visibleCount = 2

    const cardW = (wrapperWidth - GAP * (visibleCount - 1)) / visibleCount
    wrapper.style.setProperty('--dep-card-w', `${cardW}px`)
    cardWidthRef.current = cardW
    return cardW
  }

  helpersRef.current.applyTranslate = (idx, animated) => {
    if (!trackRef.current) return
    const cardW = cardWidthRef.current || helpersRef.current.getCardWidth()
    const offset = idx * (cardW + GAP)
    trackRef.current.style.transition = animated 
      ? 'transform 0.55s cubic-bezier(0.25, 0.8, 0.25, 1)' 
      : 'none'
    trackRef.current.style.transform = `translateX(-${offset}px)`
  }

  helpersRef.current.advance = () => {
    if (isPaused.current || isResetting.current) return
    const h = helpersRef.current
    currentIdx.current += 1

    if (currentIdx.current >= total) {
      h.applyTranslate(currentIdx.current, true)
      isResetting.current = true
      setTimeout(() => {
        currentIdx.current = 0
        h.applyTranslate(0, false)
        isResetting.current = false
      }, 570)
    } else {
      h.applyTranslate(currentIdx.current, true)
    }
  }

  useEffect(() => {
    const h = helpersRef.current
    h.getCardWidth()
    h.applyTranslate(0, false)

    intervalRef.current = setInterval(() => h.advance(), 2000)

    const handleResize = () => {
      h.getCardWidth()
      h.applyTranslate(currentIdx.current, false)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(intervalRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const pause = () => {
    isPaused.current = true
    clearInterval(intervalRef.current)
  }

  const resume = () => {
    isPaused.current = false
    intervalRef.current = setInterval(() => helpersRef.current.advance(), 2000)
  }

  // Clone first few items for seamless loop
  const extendedDepartures = [...departures, ...departures.slice(0, 4)]

  return (
    <div 
      className="departure-marquee-wrap"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="departure-track departure-track--slide" ref={trackRef}>
        {extendedDepartures.map((dep, i) => (
          <div key={`${dep.date}-${i}`} className="departure-card">
            <div className="departure-card-top">
              <span className="departure-date">{dep.date}</span>
            </div>
            <div className="departure-card-body">
              <p className="departure-price">{dep.price} <span>/ khách</span></p>
              <button
                className="btn departure-btn"
                aria-label="Đăng ký ngay"
                onClick={() => onBook(dep.date, dep.endDate, dep.paymentDeadline, dep.depositDate)}
              >
                Đăng ký ngay
              </button>
            </div>
            <div className="departure-card-footer">
              <button className="departure-share" aria-label="Chia sẻ thông tin">
                <Share2 size={14} /> Chia sẻ thông tin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TourDetail = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')
  const [selectedPaymentDeadline, setSelectedPaymentDeadline] = useState('')
  const [selectedDepositDate, setSelectedDepositDate] = useState('')

  const handleBookClick = () => {
    setSelectedDate('')
    setSelectedEndDate('')
    setSelectedPaymentDeadline('')
    setSelectedDepositDate('')
    setModalOpen(true)
  }

  const handleConsultClick = () => {
    // Consult action
  }

  const handleDepartureBook = (date, endDate) => {
    setSelectedDate(date)
    setSelectedEndDate(endDate || '')
    setModalOpen(true)
  }

  return (
    <>
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDate={selectedDate}
        initialEndDate={selectedEndDate}
        initialPaymentDeadline={selectedPaymentDeadline}
        initialDepositDate={selectedDepositDate}
        availableDates={departures}
      />
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

              {/* Cost Structure */}
              <FadeIn className="content-block">
                <h2 className="cost-section-title">Cấu Trúc Chi Phí</h2>

                <div className="cost-included">
                  <h3 className="cost-subtitle">Chi phí bao gồm:</h3>
                  <ul className="cost-list cost-list--included">
                    {includedItems.map((item) => (
                      <li key={item}>
                        <Check className="cost-icon cost-icon--check" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="cost-excluded">
                  <h3 className="cost-subtitle">Chi phí không bao gồm:</h3>
                  <ul className="cost-list cost-list--excluded">
                    {excludedItems.map((item) => (
                      <li key={item}>
                        <X className="cost-icon cost-icon--x" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Luggage */}
              <FadeIn className="content-block">
                <h2 className="cost-section-title">Hành Lý Chuẩn Bị</h2>
                <h3 className="cost-subtitle">Hành lý chuẩn bị:</h3>
                <ul className="cost-list luggage-list">
                  {luggageItems.map((item) => (
                    <li key={item}>
                      <span className="luggage-plus">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>

              {/* Notes */}
              <FadeIn className="content-block">
                <h2 className="cost-section-title">Lưu Ý</h2>
                <h3 className="cost-subtitle">Lưu ý:</h3>
                <ul className="notes-list">
                  {notes.map((note) => (
                    <li key={note}>
                      <span className="note-star">*</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <FadeIn className="detail-sidebar">
              <div className="booking-card sticky-sidebar">
                <div className="booking-price">
                  <span className="price-label">GIÁ TỪ:</span>
                  <span className="amount">2,990,000 VND</span>
                  <span className="unit">/ khách</span>
                </div>

                <div className="booking-divider" />

                <div className="booking-discounts">
                  <h4 className="booking-section-title">ƯU ĐÃI:</h4>
                  <ul className="discount-list">
                    {discounts.map((d) => (
                      <li key={d}>+ {d}</li>
                    ))}
                  </ul>
                  <p className="discount-note">* Không áp dụng cộng dồn các ưu đãi.</p>
                </div>

                <div className="booking-divider" />

                <div className="booking-note">
                  <h4 className="booking-section-title">LƯU Ý:</h4>
                  <p>Giá tour trọn gói không giảm trừ chi phí trong trường hợp bạn không sử dụng dịch vụ ăn uống, lều trại,...</p>
                </div>

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleBookClick}
                  aria-label="Đặt chuyến này"
                >
                  Đăng Ký
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

          {/* Departure Schedule — full width below the 2-col grid */}
          <FadeIn>
            <div className="departure-section">
              <h2 className="departure-title">LỊCH KHỞI HÀNH GẦN NHẤT</h2>
              <DepartureCarousel
                departures={departures}
                onBook={handleDepartureBook}
              />
            </div>
          </FadeIn>

          {/* FAQ — full width below departure schedule */}
          <FadeIn>
            <div className="faq-section">
              <h2 className="departure-title">CÂU HỎI THƯỜNG GẶP</h2>
              <div className="itinerary-accordion faq-accordion">
                {faqItems.map((item) => (
                  <AccordionItem key={item.q} title={item.q}>
                    <p>{item.a}</p>
                  </AccordionItem>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Similar Tours Carousel — full width below FAQ */}
          <FadeIn>
            <SimilarToursCarousel />
          </FadeIn>
        </div>
      </section>

      <Footer minimal />
    </>
  )
}

export default TourDetail
