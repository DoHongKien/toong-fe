import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, BarChart, MapPin, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'

const allTours = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Tà Năng Phan Dũng',
    badge: 'Best Seller',
    badgeClass: '',
    title: 'Tà Năng - Phan Dũng',
    duration: '2N1Đ',
    difficulty: 'Vừa phải',
    location: 'Lâm Đồng',
    desc: 'Cung đường trekking đẹp nhất Việt Nam, băng qua những đồi cỏ xanh ngút ngàn.',
    price: '2,990,000đ',
    delay: '0ms',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Bù Gia Mập',
    badge: 'New',
    badgeClass: 'new',
    title: 'Vườn Quốc Gia Bù Gia Mập',
    duration: '2N1Đ',
    difficulty: 'Dễ',
    location: 'Bình Phước',
    desc: 'Khám phá hệ sinh thái đa dạng, tắm suối mát lạnh giữa rừng nguyên sinh.',
    price: '2,500,000đ',
    delay: '100ms',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: '8 Nàng Tiên',
    badge: null,
    badgeClass: '',
    title: '8 Nàng Tiên - Ninh Thuận',
    duration: '3N2Đ',
    difficulty: 'Thử thách',
    location: 'Ninh Thuận',
    desc: 'Chinh phục cung đường ven biển tuyệt đẹp, cắm trại lấp lánh dưới dải ngân hà.',
    price: '3,200,000đ',
    delay: '200ms',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Bidoup',
    badge: null,
    badgeClass: '',
    title: 'Đỉnh Bidoup Núi Bà',
    duration: '2N1Đ',
    difficulty: 'Khó',
    location: 'Lâm Đồng',
    desc: 'Thử thách nóc nhà cao nguyên Lâm Viên, băng qua rừng già nguyên sinh.',
    price: '2,800,000đ',
    delay: '300ms',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1504280390467-3334237dc6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'La Ngâu',
    badge: null,
    badgeClass: '',
    title: 'Cắm Trại La Ngâu',
    duration: '2N1Đ',
    difficulty: 'Rất Dễ',
    location: 'Bình Thuận',
    desc: 'Trải nghiệm cắm trại glamping bên suối, thư giãn tuyệt đối dịp cuối tuần.',
    price: '1,990,000đ',
    delay: '400ms',
  },
]

const Tours = () => {
  const [filterRegion, setFilterRegion] = useState('')
  const [filterDuration, setFilterDuration] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [activePage, setActivePage] = useState(1)

  const handleFilterRegionChange = (e) => setFilterRegion(e.target.value)
  const handleFilterDurationChange = (e) => setFilterDuration(e.target.value)
  const handleFilterDifficultyChange = (e) => setFilterDifficulty(e.target.value)
  const handleSearchClick = () => {
    // Filter logic would be implemented here with real data
  }
  const handlePageClick = (page) => setActivePage(page)

  return (
    <>
      <Navbar alwaysScrolled />

      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h1 className="page-title fade-in-up">Tất Cả Các Cung</h1>
          <p className="page-subtitle fade-in-up" style={{ animationDelay: '100ms' }}>
            Tìm hành trình phù hợp với bạn
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="filter-section">
        <div className="container">
          <FadeIn className="filter-bar">
            <div className="filter-group">
              <label htmlFor="filter-region">Khu vực</label>
              <select
                id="filter-region"
                className="filter-select"
                value={filterRegion}
                onChange={handleFilterRegionChange}
                aria-label="Lọc theo khu vực"
              >
                <option value="">Tất cả khu vực</option>
                <option value="nam">Miền Nam</option>
                <option value="trung">Miền Trung</option>
                <option value="taynguyen">Tây Nguyên</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-duration">Thời lượng</label>
              <select
                id="filter-duration"
                className="filter-select"
                value={filterDuration}
                onChange={handleFilterDurationChange}
                aria-label="Lọc theo thời lượng"
              >
                <option value="">Tất cả</option>
                <option value="2">2 Ngày 1 Đêm</option>
                <option value="3">3 Ngày 2 Đêm</option>
                <option value="4">4 Ngày 3 Đêm</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-difficulty">Độ khó</label>
              <select
                id="filter-difficulty"
                className="filter-select"
                value={filterDifficulty}
                onChange={handleFilterDifficultyChange}
                aria-label="Lọc theo độ khó"
              >
                <option value="">Tất cả</option>
                <option value="de">Dễ (Cho người mới)</option>
                <option value="vua">Vừa phải</option>
                <option value="kho">Thử thách</option>
              </select>
            </div>
            <button className="btn btn-primary filter-btn" onClick={handleSearchClick} aria-label="Tìm kiếm tour">
              Tìm Kiếm
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Tours Content */}
      <section className="section pt-0">
        <div className="container">
          <div className="tours-grid">
            {allTours.map((tour) => (
              <FadeIn key={tour.id} style={{ transitionDelay: tour.delay }}>
                <div className="tour-card">
                  <div className="tour-image">
                    <img src={tour.image} alt={tour.alt} />
                    {tour.badge && (
                      <div className={`tour-badge${tour.badgeClass ? ` ${tour.badgeClass}` : ''}`}>{tour.badge}</div>
                    )}
                  </div>
                  <div className="tour-info">
                    <h3>
                      <Link to="/tour-detail">{tour.title}</Link>
                    </h3>
                    <div className="tour-meta">
                      <span>
                        <Clock /> {tour.duration}
                      </span>
                      <span>
                        <BarChart /> {tour.difficulty}
                      </span>
                      <span>
                        <MapPin /> {tour.location}
                      </span>
                    </div>
                    <p>{tour.desc}</p>
                    <div className="tour-price-row">
                      <span className="price">{tour.price}</span>
                      <Link to="/tour-detail" className="btn btn-outline">
                        Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Pagination */}
          <FadeIn className="pagination mt-5">
            {[1, 2, 3].map((page) => (
              <a
                key={page}
                href="#"
                className={`page-link${activePage === page ? ' active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageClick(page)
                }}
                aria-label={`Trang ${page}`}
                aria-current={activePage === page ? 'page' : undefined}
                tabIndex={0}
              >
                {page}
              </a>
            ))}
            <a
              href="#"
              className="page-link"
              onClick={(e) => {
                e.preventDefault()
                handlePageClick(activePage < 3 ? activePage + 1 : activePage)
              }}
              aria-label="Trang tiếp theo"
              tabIndex={0}
            >
              <ChevronRight />
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer minimal />
    </>
  )
}

export default Tours
