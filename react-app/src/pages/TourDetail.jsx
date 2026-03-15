import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Clock,
  BarChart,
  Users,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'
import BookingModal from '../components/BookingModal'
import { tourApi } from '../api/api'

// Helper for currency
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className={`accordion-item ${isOpen ? 'active' : ''}`}>
    <button className="accordion-header" onClick={onClick} aria-expanded={isOpen}>
      <span>{title}</span>
      <span className="accordion-icon">
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </span>
    </button>
    <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
      <div className="accordion-inner">
        {Array.isArray(content) && content.length > 0 ? (
          <ul className="accordion-list">
            {content.map((item, i) => {
              if (typeof item !== 'object') return <li key={i}>{item}</li>;
              
              // Handle Different Entity Types
              if (item.question) return (
                <li key={i} className="faq-item">
                  <strong className="block mb-1">{item.question}</strong>
                  <p className="text-sm opacity-80">{item.answer}</p>
                </li>
              );
              
              if (item.name && item.detail) return (
                <li key={i}>
                  <strong>{item.name}:</strong> {item.detail}
                </li>
              );

              return <li key={i}>{item.content || item.name || JSON.stringify(item)}</li>;
            })}
          </ul>
        ) : (
          <p className="no-data-msg-sm">Dữ liệu đang được cập nhật...</p>
        )}
      </div>
    </div>
  </div>
)

const DepartureCarousel = ({ departures, onSelect }) => {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = dir === 'left' ? -clientWidth / 2 : clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

  if (!departures || departures.length === 0) return (
    <div className="no-departures">Hiện chưa có lịch khởi hành mới.</div>
  )

  return (
    <div className="departure-carousel-wrapper">
      <button className="carousel-nav prev" onClick={() => scroll('left')} aria-label="Trước">
        <ChevronLeft />
      </button>
      <div className="departure-carousel" ref={scrollRef}>
        {departures.map((d) => (
          <div className="departure-card" key={d.id}>
            <div className="d-date">
              <span className="d-label">BẮT ĐẦU</span>
              <span className="d-val">{new Date(d.startDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="d-date">
              <span className="d-label">KẾT THÚC</span>
              <span className="d-val">{new Date(d.endDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="d-price">
              <span className="d-label">GIÁ TOUR</span>
              <span className="d-val primary">{formatVND(d.price)}</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onSelect(d)}>
              Đăng ký ngay
            </button>
          </div>
        ))}
      </div>
      <button className="carousel-nav next" onClick={() => scroll('right')} aria-label="Sau">
        <ChevronRight />
      </button>
    </div>
  )
}

const SimilarToursCarousel = ({ tours }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const displayCount = 3;
  const totalItems = tours.length;

  useEffect(() => {
    if (totalItems <= displayCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalItems]);

  useEffect(() => {
    if (currentIndex === totalItems) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 600); // Wait for transition animation to end
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalItems]);

  useEffect(() => {
    if (!isTransitioning && currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, currentIndex]);

  if (!tours || tours.length === 0) return null;

  const extendedTours = [...tours, ...tours.slice(0, displayCount)];

  return (
    <div className="similar-tours-carousel-container">
      <div 
        className="similar-tours-slider" 
        style={{ 
          transform: `translateX(calc(-${currentIndex * (100 / displayCount)}% - ${currentIndex * (2 / displayCount)}rem))`,
          transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {extendedTours.map((t, idx) => (
          <div key={`${t.id}-${idx}`} className="similar-tour-card-flex">
            <div className="tour-card sm">
              <div className="tour-image">
                <img src={t.cardImage} alt={t.name} />
              </div>
              <div className="tour-info">
                <h4>{t.name}</h4>
                <div className="tour-meta">
                  <span><Clock size={14}/> {t.durationDays}N{t.durationNights}Đ</span>
                  <span><BarChart size={14}/> {t.difficulty}</span>
                </div>
                <Link to={`/tours/${t.slug}`} className="btn btn-outline btn-sm">Xem chi tiết</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalItems > displayCount && (
        <div className="carousel-dots">
          {tours.map((_, i) => (
            <button 
              key={i} 
              className={`dot ${(currentIndex % totalItems) === i ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TourDetail = () => {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [departures, setDepartures] = useState([])
  const [similarTours, setSimilarTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [openAccordion, setOpenAccordion] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDeparture, setSelectedDeparture] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const [tourRes, departuresRes] = await Promise.all([
          tourApi.getTourBySlug(slug),
          tourApi.getDepartures(slug)
        ])

        if (tourRes.data && tourRes.data.status === 'success') {
          const tourData = tourRes.data.data
          setTour(tourData)

          // Fetch similar tours after we have the region
          const similarRes = await tourApi.getAllTours({ region: tourData.region })
          if (similarRes.data && similarRes.data.status === 'success') {
            setSimilarTours(similarRes.data.data.filter(t => t.slug !== slug).slice(0, 10))
          }
        }

        if (departuresRes.data && departuresRes.data.status === 'success') {
          setDepartures(departuresRes.data.data)
        }
        
      } catch (err) {
        console.error('Error fetching tour detail:', err)
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
    window.scrollTo(0, 0)
  }, [slug])

  const handleOpenModal = (departure = null) => {
    setSelectedDeparture(departure)
    setIsModalOpen(true)
  }

  const handleConsultClick = () => {
    alert('Chúng tôi sẽ liên hệ tư vấn cho bạn sớm nhất!')
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  )

  if (error || !tour) return (
    <div className="text-center py-40">
      <h2>{error || 'Không tìm thấy tour này'}</h2>
      <Link to="/tours" className="btn btn-primary mt-4">Quay lại danh sách</Link>
    </div>
  )

  const stats = [
    { icon: <Clock />, label: 'THỜI GIAN', value: `${tour.durationDays} Ngày ${tour.durationNights} Đêm` },
    { icon: <BarChart />, label: 'CẤP ĐỘ', value: tour.difficulty },
    { icon: <Users />, label: 'TỈ LỆ HỖ TRỢ', value: '1:4' },
    { icon: <MapPin />, label: 'ĐỊA ĐIỂM', value: tour.region === 'nam' ? 'Miền Nam' : (tour.region === 'taynguyen' ? 'Tây Nguyên' : 'Miền Trung') },
  ]

  return (
    <>
      <Navbar alwaysScrolled />

      {/* Hero Header */}
      <section 
        className="td-hero" 
        style={{ backgroundImage: `url(${tour.heroImage || tour.cardImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80'})` }}
      >
        <div className="hero-overlay"></div>
        <div className="container td-hero-content">
          <FadeIn>
            <h1 className="td-title">{tour.name}</h1>
            <p className="td-summary">{tour.summary}</p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white pr-relative">
        <div className="container td-container">
          <div className="td-main">
            {/* Stats Grid */}
            <FadeIn className="td-stats">
              {stats.map((s, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-text">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-val">{s.value}</span>
                  </div>
                </div>
              ))}
            </FadeIn>

            {/* Description */}
            <FadeIn className="td-desc">
              <h2 className="section-title text-left">Tổng Quan Hành Trình</h2>
              {tour.description ? (
                <div className="desc-text" dangerouslySetInnerHTML={{ __html: tour.description }}></div>
              ) : (
                <div className="no-data-msg">Mô tả chi tiết đang được cập nhật...</div>
              )}
            </FadeIn>

            {/* Itinerary */}
            <FadeIn className="td-itinerary">
              <h2 className="section-title text-left">Lịch Trình Chi Tiết</h2>
              {tour.itineraries && tour.itineraries.length > 0 ? (
                <div className="itinerary-list">
                  {tour.itineraries.map((it) => (
                    <div className="it-day" key={it.id}>
                      <div className="it-day-marker">
                        <span className="day-num">NGÀY {it.dayNumber}</span>
                      </div>
                      <div className="it-day-content">
                        <h3 className="it-title">{it.title}</h3>
                        <div className="it-events">
                          {it.timelines && it.timelines.map((ev, i) => (
                            <div className="event-row" key={i}>
                              <span className="event-time">{ev.executionTime ? ev.executionTime.substring(0, 5) : ''}</span>
                              <span className="event-desc">{ev.activity}</span>
                            </div>
                          ))}
                          {(!it.timelines || it.timelines.length === 0) && (
                            <div className="event-desc">Lịch trình trong ngày đang được chi tiết hóa...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-msg">Lịch trình chi tiết từng ngày đang được cập nhật...</div>
              )}
            </FadeIn>

            {/* Cost Details */}
            <FadeIn className="td-accordion">
              <h2 className="section-title text-left">Chi Phí & Chuẩn Bị</h2>
              { ( (tour.costDetails && tour.costDetails.length > 0) || (tour.luggages && tour.luggages.length > 0) || (tour.faqs && tour.faqs.length > 0) ) ? (
                <>
                  <AccordionItem
                    title="DỊCH VỤ BAO GỒM"
                    content={tour.costDetails?.filter(c => c.isIncluded) || []}
                    isOpen={openAccordion === 0}
                    onClick={() => setOpenAccordion(0)}
                  />
                  <AccordionItem
                    title="DỊCH VỤ KHÔNG BAO GỒM"
                    content={tour.costDetails?.filter(c => !c.isIncluded) || []}
                    isOpen={openAccordion === 1}
                    onClick={() => setOpenAccordion(1)}
                  />
                  <AccordionItem
                    title="CHUẨN BỊ HÀNH LÝ"
                    content={tour.luggages || []}
                    isOpen={openAccordion === 2}
                    onClick={() => setOpenAccordion(2)}
                  />
                  <AccordionItem
                    title="CÂU HỎI THƯỜNG GẶP (FAQ)"
                    content={tour.faqs || []}
                    isOpen={openAccordion === 3}
                    onClick={() => setOpenAccordion(3)}
                  />
                </>
              ) : (
                <div className="no-data-msg">Thông tin chi phí và chuẩn bị đang được cập nhật...</div>
              )}
            </FadeIn>
          </div>

          <div className="td-sidebar">
            <div className="td-sticky-card">
              <div className="td-price-tag">
                <span className="label">Giá chỉ từ</span>
                <span className="amount">{formatVND(tour.basePrice)}</span>
              </div>
              <p className="td-note text-center">Tùy chọn ngày khởi hành để xem giá chi tiết</p>
              
              <div className="td-actions">
                <button className="btn btn-primary w-100" onClick={() => handleOpenModal()}>
                  Đăng Ký Ngay
                </button>
                <button className="btn btn-outline w-100 mt-3" onClick={handleConsultClick}>
                  Nhận Tư Vấn
                </button>
              </div>

              <div className="td-guarantee">
                <div className="gu-item"><Calendar size={16}/> Lịch trình linh hoạt</div>
                <div className="gu-item"><Users size={16}/> Tỉ lệ 1:4 bảo đảm an toàn</div>
                <div className="gu-item"><BarChart size={16}/> Đội ngũ chuyên nghiệp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departures Section */}
      <section className="section bg-grey">
        <div className="container">
          <FadeIn className="section-header">
            <h2 className="section-title">Lịch Khởi Hành</h2>
          </FadeIn>
          <FadeIn>
            <DepartureCarousel departures={departures} onSelect={handleOpenModal} />
          </FadeIn>
        </div>
      </section>

      {/* Similar Tours */}
      {similarTours.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <FadeIn className="section-header">
              <h2 className="section-title">Các Cung Tương Tự</h2>
            </FadeIn>
            <FadeIn>
                <SimilarToursCarousel tours={similarTours} />
            </FadeIn>
          </div>
        </section>
      )}

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDeparture={selectedDeparture}
        availableDepartures={departures}
        tourId={tour.id}
      />

      <Footer />
    </>
  )
}

export default TourDetail
