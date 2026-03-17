import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, BarChart, MapPin, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'
import { tourApi } from '../api/api'

const Tours = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filterRegion, setFilterRegion] = useState('')
  const [filterDuration, setFilterDuration] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [activePage, setActivePage] = useState(1)

  const fetchTours = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterRegion) params.region = filterRegion
      if (filterDuration) params.durationDays = filterDuration
      if (filterDifficulty) params.difficulty = filterDifficulty
      
      const response = await tourApi.getAllTours(params)
      // Extract data - check if response.data.data exists (standard wrapper) or just response.data
      let toursData = []
      if (response.data && response.data.status === 'success') {
        toursData = response.data.data
      } else {
        toursData = Array.isArray(response.data) ? response.data : []
      }
      setTours(toursData)
      setError(null)
    } catch (err) {
      console.error('Error fetching tours:', err)
      setError('Không thể tải danh sách tour. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, []) // Load on mount

  const handleFilterRegionChange = (e) => setFilterRegion(e.target.value)
  const handleFilterDurationChange = (e) => setFilterDuration(e.target.value)
  const handleFilterDifficultyChange = (e) => setFilterDifficulty(e.target.value)
  
  const handleSearchClick = () => {
    setActivePage(1)
    fetchTours()
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
                <option value="1">1 Ngày</option>
                <option value="2">2 Ngày</option>
                <option value="3">3 Ngày</option>
                <option value="4">4 Ngày</option>
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
                <option value="Rất Dễ">Rất Dễ</option>
                <option value="Dễ">Dễ</option>
                <option value="Vừa phải">Vừa phải</option>
                <option value="Thử thách">Thử thách</option>
                <option value="Khó">Khó</option>
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20">Không tìm thấy tour nào phù hợp.</div>
          ) : (
            <div className="tours-grid">
              {tours.map((tour, index) => (
                <FadeIn key={tour.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="tour-card">
                    <div className="tour-image">
                      {/* Using tour.cardImage instead of tour.card_image */}
                      <img src={tour.cardImage} alt={tour.name} />
                      {tour.badge && (
                        <div className="tour-badge">{tour.badge}</div>
                      )}
                    </div>
                    <div className="tour-info">
                      <h3>
                        <Link to={`/tours/${tour.slug}`}>{tour.name}</Link>
                      </h3>
                      <div className="tour-meta">
                        <span>
                          {/* Using tour.durationDays/Nights instead of duration_days/nights */}
                          <Clock /> {tour.durationDays}N{tour.durationNights}Đ
                        </span>
                        <span>
                          <BarChart /> {tour.difficulty}
                        </span>
                        <span>
                          <MapPin /> {tour.region === 'taynguyen' ? 'Tây Nguyên' : tour.region === 'nam' ? 'Miền Nam' : 'Miền Trung'}
                        </span>
                      </div>
                      <p>{tour.summary}</p>
                      <div className="tour-price-row">
                        {/* Using tour.basePrice instead of tour.base_price */}
                        <span className="price">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.basePrice || 0)}
                        </span>
                        <Link to={`/tours/${tour.slug}`} className="btn btn-outline">
                          Xem Chi Tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && tours.length > 0 && (
            <FadeIn className="pagination mt-5">
              {[1].map((page) => (
                <button
                  key={page}
                  className={`page-link${activePage === page ? ' active' : ''}`}
                  onClick={() => handlePageClick(page)}
                  aria-label={`Trang ${page}`}
                >
                  {page}
                </button>
              ))}
            </FadeIn>
          )}
        </div>
      </section>

      <Footer minimal />
    </>
  )
}

export default Tours
