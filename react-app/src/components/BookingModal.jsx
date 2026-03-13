import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import DatePickerCalendar from './DatePickerCalendar'

const DEPOSIT = 500000
const PRICE_PER_PERSON = 2990000

// Format number to Vietnamese style: 2.990.000 VND
const formatVND = (n) =>
  n.toLocaleString('vi-VN').replace(/,/g, '.') + ' VND'

// Add N days to a date, return dd/MM/yyyy string
const addDays = (dateStr, n) => {
  if (!dateStr) return ''
  const [d, m, y] = dateStr.split('/').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '/')
}

const today = () => {
  const d = new Date()
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')
}

const BookingModal = ({ isOpen, onClose, initialDate, initialEndDate, availableDates = [] }) => {
  const [step, setStep] = useState(1)
  const [departureDate, setDepartureDate] = useState(initialDate || '')
  const [fixedEndDate, setFixedEndDate] = useState(initialEndDate || '')
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('chuyen-khoan')
  const [form, setForm] = useState({ ho: '', ten: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const overlayRef = useRef(null)

  // Sync initial date when modal is opened from a departure card
  useEffect(() => {
    if (isOpen) {
      setDepartureDate(initialDate || '')
      setFixedEndDate(initialEndDate || '')
      setStep(1)
      setQuantity(1)
      setPaymentMethod('chuyen-khoan')
      setForm({ ho: '', ten: '', phone: '', email: '' })
      setErrors({})
    }
  }, [isOpen, initialDate, initialEndDate])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const departureDateDisplay = departureDate // already DD/MM/YYYY
  const endDateDisplay = fixedEndDate || (departureDate ? addDays(departureDate, 1) : '')
  const totalPrice = PRICE_PER_PERSON * quantity
  const remaining = totalPrice - DEPOSIT
  const paymentLabel = paymentMethod === 'payon' ? 'Payon' : 'Chuyển khoản'

  const validate = () => {
    const e = {}
    if (!form.ho.trim()) e.ho = 'Vui lòng nhập họ'
    if (!form.ten.trim()) e.ten = 'Vui lòng nhập tên'
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại'
    if (!departureDate) e.departure = 'Vui lòng chọn ngày khởi hành'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  const handleConfirm = () => {
    // Scroll modal to top when finishing
    const modalBody = document.querySelector('.bm-modal')
    if (modalBody) modalBody.scrollTop = 0
    setStep(3)
  }

  const handleReturnHome = () => {
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className="bm-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Đặt chỗ của bạn">
      <div className="bm-modal">
        {/* Top bar */}
        <div className="bm-topbar">
          <span>Đặt chỗ của bạn</span>
          <button className="bm-close" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div className="bm-steps">
          <div className={`bm-step ${step === 1 ? 'active' : 'done'}`}>
            <div className="bm-step-circle">{step > 1 ? '✓' : '1'}</div>
            <span>ĐĂNG KÝ THÔNG TIN</span>
          </div>
          <div className="bm-step-line" />
          <div className={`bm-step ${step === 2 ? 'active' : (step > 2 ? 'done' : '')}`}>
            <div className="bm-step-circle">{step > 2 ? '✓' : '2'}</div>
            <span>XÁC NHẬN THÔNG TIN</span>
          </div>
        </div>

        {/* Body */}
        <div className="bm-body">
          {step < 3 ? (
            <>
              {/* ── Left column ── */}
              <div className="bm-left">
                {/* THÔNG TIN HÀNH TRÌNH */}
                <div className="bm-section">
                  <h3 className="bm-section-title">THÔNG TIN HÀNH TRÌNH</h3>
                  <div className="bm-tour-row">
                    <span className="bm-tour-name">Tà Năng - Phan Dũng</span>
                    <div className="bm-dates-row">
                      <div className="bm-field-group">
                        <label className="bm-sublabel">KHỞI HÀNH</label>
                        {step === 1 ? (
                          <>
                            <DatePickerCalendar
                              value={departureDate}
                              allowedDates={availableDates.map(d => d.date)}
                              hasError={!!errors.departure}
                              onChange={(val) => {
                                if (!val) {
                                  setDepartureDate('')
                                  setFixedEndDate('')
                                  return
                                }
                                const match = availableDates.find(d => d.date === val)
                                setDepartureDate(val)
                                setFixedEndDate(match?.endDate || '')
                                setErrors(prev => { const e = { ...prev }; delete e.departure; return e })
                              }}
                            />
                            {errors.departure && <span className="bm-error">{errors.departure}</span>}
                          </>
                        ) : (
                          <span className="bm-date-value">{departureDateDisplay}</span>
                        )}
                      </div>
                      <div className="bm-field-group">
                        <label className="bm-sublabel">KẾT THÚC</label>
                        <span className="bm-date-value">{endDateDisplay || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bm-price-qty-row">
                    <div>
                      <label className="bm-sublabel">SỐ TIỀN THANH TOÁN</label>
                      <span className="bm-total-price">{formatVND(totalPrice)}</span>
                    </div>
                    <div className="bm-qty-group">
                      <label className="bm-sublabel">SỐ LƯỢNG</label>
                      <div className="bm-qty-control">
                        <span>x</span>
                        {step === 1 ? (
                          <input
                            type="number"
                            className="bm-qty-input"
                            min={1}
                            max={20}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          />
                        ) : (
                          <span className="bm-qty-display">{String(quantity).padStart(2, '0')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHI TIẾT ĐƠN HÀNG */}
                <div className="bm-section">
                  <h3 className="bm-section-title">CHI TIẾT ĐƠN HÀNG</h3>
                  <div className="bm-order-grid">
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">CẦN ĐẶT CỌC</label>
                      <span className="bm-order-value bold">{formatVND(DEPOSIT)}</span>
                    </div>
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">NGÀY ĐẶT CỌC</label>
                      <span className="bm-order-value bold">{today()}</span>
                    </div>
                  </div>

                  <div className="bm-payment-method">
                    <label className="bm-sublabel">HÌNH THỨC THANH TOÁN</label>
                    <div className="bm-radios">
                      <label className="bm-radio-label">
                        <input
                          type="radio"
                          name="payment"
                          value="payon"
                          checked={paymentMethod === 'payon'}
                          onChange={() => setPaymentMethod('payon')}
                          disabled={step === 2}
                        /> Payon
                      </label>
                      <label className="bm-radio-label">
                        <input
                          type="radio"
                          name="payment"
                          value="chuyen-khoan"
                          checked={paymentMethod === 'chuyen-khoan'}
                          onChange={() => setPaymentMethod('chuyen-khoan')}
                          disabled={step === 2}
                        /> Chuyển khoản
                      </label>
                    </div>
                  </div>

                  <div className="bm-order-grid" style={{ marginTop: '1rem' }}>
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">CÒN LẠI</label>
                      <span className="bm-order-value">{formatVND(remaining)}</span>
                    </div>
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">HẠN THANH TOÁN</label>
                      <span className="bm-order-value">{departureDateDisplay ? addDays(departureDateDisplay, -2) : '—'}</span>
                    </div>
                  </div>
                </div>

                {/* THÔNG TIN CỦA BẠN */}
                <div className="bm-section">
                  <h3 className="bm-section-title">THÔNG TIN CỦA BẠN</h3>
                  <div className="bm-form-row">
                    <div className="bm-form-group">
                      <label className="bm-form-label">HỌ <span className="bm-required">*</span></label>
                      {step === 1 ? (
                        <>
                          <input
                            className={`bm-input ${errors.ho ? 'bm-input-error' : ''}`}
                            placeholder="Họ"
                            value={form.ho}
                            onChange={(e) => setForm({ ...form, ho: e.target.value })}
                          />
                          {errors.ho && <span className="bm-error">{errors.ho}</span>}
                        </>
                      ) : (
                        <span className="bm-readonly">{form.ho}</span>
                      )}
                    </div>
                    <div className="bm-form-group">
                      <label className="bm-form-label">TÊN <span className="bm-required">*</span></label>
                      {step === 1 ? (
                        <>
                          <input
                            className={`bm-input ${errors.ten ? 'bm-input-error' : ''}`}
                            placeholder="Tên"
                            value={form.ten}
                            onChange={(e) => setForm({ ...form, ten: e.target.value })}
                          />
                          {errors.ten && <span className="bm-error">{errors.ten}</span>}
                        </>
                      ) : (
                        <span className="bm-readonly">{form.ten}</span>
                      )}
                    </div>
                  </div>
                  <div className="bm-form-group">
                    <label className="bm-form-label">SỐ ĐIỆN THOẠI <span className="bm-required">*</span></label>
                    {step === 1 ? (
                      <>
                        <input
                          className={`bm-input ${errors.phone ? 'bm-input-error' : ''}`}
                          placeholder="Số điện thoại"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        {errors.phone && <span className="bm-error">{errors.phone}</span>}
                      </>
                    ) : (
                      <span className="bm-readonly">{form.phone}</span>
                    )}
                  </div>
                  <div className="bm-form-group">
                    <label className="bm-form-label">EMAIL</label>
                    {step === 1 ? (
                      <input
                        className="bm-input"
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    ) : (
                      <span className="bm-readonly">{form.email || '—'}</span>
                    )}
                  </div>

                  {step === 1 && (
                    <button className="btn btn-primary bm-next-btn" onClick={handleNext}>
                      Nhập thông tin
                    </button>
                  )}
                </div>
              </div>

              {/* ── Right column (Sidebar) ── */}
              <div className="bm-right">
                {/* THÔNG TIN ĐĂNG KÝ */}
                <div className="bm-sidebar-section">
                  <h4 className="bm-sidebar-title">THÔNG TIN ĐĂNG KÝ</h4>
                  <div className="bm-reg-info">
                    <p className="bm-reg-detail">Họ Tên: <strong>{form.ho} {form.ten}</strong></p>
                    <p className="bm-reg-detail">Điện Thoại: <strong>{form.phone}</strong></p>
                    <p className="bm-reg-detail">Email: <strong>{form.email}</strong></p>
                  </div>
                </div>

                {/* THÔNG TIN ĐƠN HÀNG */}
                <div className="bm-sidebar-section">
                  <h4 className="bm-sidebar-title">THÔNG TIN ĐƠN HÀNG</h4>
                  <div className="bm-order-summary">
                    <div className="bm-summary-tour">
                      <span className="bm-summary-name">Tà Năng - Phan Dũng</span>
                      {departureDateDisplay && (
                        <span className="bm-summary-dates">({departureDateDisplay} - {endDateDisplay})</span>
                      )}
                    </div>

                    <div className="bm-summary-grid">
                      <div className="bm-summary-cell">
                        <label className="bm-sublabel">SỐ LƯỢNG:</label>
                        <strong>{String(quantity).padStart(2, '0')}</strong>
                      </div>
                      <div className="bm-summary-cell">
                        <label className="bm-sublabel">TỔNG GIÁ:</label>
                        <strong>{formatVND(totalPrice)}</strong>
                      </div>
                      <div className="bm-summary-cell">
                        <label className="bm-sublabel">CẦN ĐẶT CỌC:</label>
                        <strong>{formatVND(DEPOSIT)}</strong>
                      </div>
                    </div>

                    <div className="bm-summary-grid bm-summary-grid--2">
                      <div className="bm-summary-cell">
                        <label className="bm-sublabel">NGÀY ĐẶT CỌC:</label>
                        <strong>{today()}</strong>
                      </div>
                      <div className="bm-summary-cell">
                        <label className="bm-sublabel">PHƯƠNG THỨC THANH TOÁN:</label>
                        <strong>- {paymentLabel}</strong>
                      </div>
                    </div>

                    <p className="bm-note">
                      Lưu ý: Tổ Ong sẽ liên hệ với bạn để xác nhận đặt chỗ theo những thông tin bên trên.
                      Hãy kiểm tra lại thông tin đăng ký của bạn thật kỹ trước khi tiến hành đặt chỗ nhé!
                    </p>

                    <div className="bm-sidebar-actions">
                      <button
                        className={`btn btn-outline bm-edit-btn ${step === 1 ? 'bm-btn-disabled' : ''}`}
                        onClick={() => setStep(1)}
                        disabled={step === 1}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className={`btn btn-primary bm-confirm-btn ${step === 1 ? 'bm-btn-disabled' : ''}`}
                        disabled={step === 1}
                        onClick={handleConfirm}
                      >
                        Đặt chỗ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ── Step 3: Success Screen ── */
            <div className="bm-success-container">
              <div className="bm-success-header">
                <div className="bm-success-icon">✓</div>
                <h3>ĐẶT CHỖ THÀNH CÔNG</h3>
                <p>Cảm ơn bạn đã tin tưởng và lựa chọn Tổ Ong Adventure!</p>
              </div>

              <div className="bm-success-body">
                {paymentMethod === 'chuyen-khoan' && (
                  <div className="bm-bank-details">
                    <div className="bm-bank-left">
                      <img
                        src="file:///C:/Users/kiendh2/.gemini/antigravity/brain/8e0f9904-a580-4576-9b29-925f29af6da5/bank_qr_code_1773374472892.png"
                        alt="Mã QR Chuyển khoản"
                        className="bm-qr-code"
                      />
                      <p className="bm-qr-note">Quét mã để thanh toán nhanh</p>
                    </div>
                    <div className="bm-bank-right">
                      <h4 className="bm-bank-title">Thông tin chuyển khoản</h4>
                      <div className="bm-bank-row">
                        <span>Ngân hàng:</span>
                        <strong>Techcombank</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Chủ tài khoản:</span>
                        <strong>CÔNG TY TNHH TỔ ONG ADVENTURE</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Số tài khoản:</span>
                        <strong>19036785432015</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Số tiền đặt cọc:</span>
                        <strong className="primary">{formatVND(DEPOSIT)}</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Nội dung:</span>
                        <strong className="primary uppercase">TOONG {form.phone} {form.ten}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bm-success-footer">
                  <p className="bm-contact-note">
                    Tổ Ong sẽ liên hệ với bạn trong vòng 24h để xác nhận và hướng dẫn các bước tiếp theo.
                  </p>
                  <button className="btn btn-primary bm-home-btn" onClick={handleReturnHome}>
                    Trở về trang chủ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
