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
  'Hỗ trợ ký gửi túi gửi hành lí 5 lít (túi sẽ do Tổ Ong chuẩn bị).',
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
  'Khách hàng đăng ký trước thứ 4 hằng tuần, bên cạnh Giấy chứng nhận sẽ nhận được 1 THẺ CHINH PHỤC sau khi hoàn thành cung đường với những ưu đãi đặc biệt đến từ đối tác của Tổ Ong Adventure.',
  'ĐỐI VỚI KHÁCH NƯỚC NGOÀI có yêu cầu Tourguide tiếng Anh, phụ thu 300.000đ/ người. Đăng ký trước 7 ngày (đối với ngày thường) và trước 30 ngày (đối với lễ, Tết).',
]

const departures = [
  { date: '05/04/2026', endDate: '06/04/2026', price: '2.990.000 VND' },
  { date: '19/04/2026', endDate: '20/04/2026', price: '2.990.000 VND' },
  { date: '03/05/2026', endDate: '04/05/2026', price: '2.990.000 VND' },
  { date: '05/05/2026', endDate: '06/05/2026', price: '2.990.000 VND' },
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
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')

  const handleBookClick = () => {
    setSelectedDate('')
    setSelectedEndDate('')
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
              <div className="departure-marquee-wrap">
                <div
                  className="departure-track"
                  style={{ animationDuration: `${departures.length * 3.5}s` }}
                >
                  {[...departures, ...departures].map((dep, i) => (
                    <div key={i} className="departure-card">
                      <div className="departure-card-top">
                        <span className="departure-date">{dep.date}</span>
                      </div>
                      <div className="departure-card-body">
                        <p className="departure-price">{dep.price} <span>/ khách</span></p>
                        <button
                          className="btn departure-btn"
                          aria-label="Đăng ký ngay"
                          onClick={() => handleDepartureBook(dep.date, dep.endDate)}
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
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer minimal />
    </>
  )
}

export default TourDetail
