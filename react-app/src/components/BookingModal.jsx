import { useState, useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import DatePickerCalendar from './DatePickerCalendar'
import { bookingApi } from '../api/api'

const DEPOSIT_PERCENT = 0.2 // 20% deposit

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const formatDateDisplay = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const formatDatePayload = (dateString) => {
    // If it's already YYYY-MM-DD
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString
    // If it's DD/MM/YYYY
    const parts = dateString.split('/')
    if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    return dateString
}

const BookingModal = ({ isOpen, onClose, initialDeparture, tourId, availableDepartures = [] }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedDeparture, setSelectedDeparture] = useState(initialDeparture || null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [form, setForm] = useState({ ho: '', ten: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [bookingCode, setBookingCode] = useState(null)
  
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedDeparture(initialDeparture || null)
      setStep(1)
      setQuantity(1)
      setPaymentMethod('bank_transfer')
      setForm({ ho: '', ten: '', phone: '', email: '' })
      setErrors({})
      setBookingCode(null)
    }
  }, [isOpen, initialDeparture])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const basePrice = selectedDeparture?.price || 0
  const totalPrice = basePrice * quantity
  const depositAmount = totalPrice * DEPOSIT_PERCENT
  const remainingAmount = totalPrice - depositAmount

  const validate = () => {
    const e = {}
    if (!form.ho.trim()) e.ho = 'Vui lòng nhập họ'
    if (!form.ten.trim()) e.ten = 'Vui lòng nhập tên'
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại'
    if (!selectedDeparture) e.departure = 'Vui lòng chọn ngày khởi hành'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const payload = {
        departureId: selectedDeparture.id,
        firstName: form.ten,
        lastName: form.ho,
        phone: form.phone,
        email: form.email,
        quantity: quantity,
        paymentMethod: paymentMethod.toUpperCase() // API uses Enum in uppercase
      }
      
      const response = await bookingApi.createBooking(payload)
      if (response.data && response.data.status === 'success') {
        // Based on BookingController, data field is the bookingCode string
        setBookingCode(response.data.data)
        setStep(3)
        // Scroll modal to top
        const modalBody = document.querySelector('.bm-modal')
        if (modalBody) modalBody.scrollTop = 0
      } else {
        alert('Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại.')
      }
    } catch (err) {
      console.error('Booking error:', err)
      alert('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Convert backend dates (camelCase) to frontend format for DatePicker
  const allowedDatesFrontend = availableDepartures.map(d => {
    const date = new Date(d.startDate)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  })

  const currentSelectedDateFrontend = selectedDeparture ? (() => {
    const date = new Date(selectedDeparture.startDate)
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  })() : ''

  return (
    <div className="bm-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Đặt chỗ của bạn">
      <div className="bm-modal">
        <div className="bm-topbar">
          <span>Đặt chỗ của bạn</span>
          <button className="bm-close" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>

        {step < 3 && (
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
        )}

        <div className="bm-body">
          {step < 3 ? (
            <>
              <div className="bm-left">
                <div className="bm-section">
                  <h3 className="bm-section-title">THÔNG TIN HÀNH TRÌNH</h3>
                  <div className="bm-tour-row">
                    <span className="bm-tour-name">Thông tin chuyến đi</span>
                    <div className="bm-dates-row">
                      <div className="bm-field-group">
                        <label className="bm-sublabel">KHỞI HÀNH</label>
                        {step === 1 ? (
                          <>
                            <DatePickerCalendar
                              value={currentSelectedDateFrontend}
                              allowedDates={allowedDatesFrontend}
                              hasError={!!errors.departure}
                              onChange={(val) => {
                                const payloadDate = formatDatePayload(val)
                                const match = availableDepartures.find(d => d.startDate === payloadDate)
                                setSelectedDeparture(match || null)
                                setErrors(prev => { const e = { ...prev }; delete e.departure; return e })
                              }}
                            />
                            {errors.departure && <span className="bm-error">{errors.departure}</span>}
                          </>
                        ) : (
                          <span className="bm-date-value">{formatDateDisplay(selectedDeparture?.startDate)}</span>
                        )}
                      </div>
                      <div className="bm-field-group">
                        <label className="bm-sublabel">KẾT THÚC</label>
                        <span className="bm-date-value">{formatDateDisplay(selectedDeparture?.endDate) || '—'}</span>
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
                            max={(selectedDeparture?.totalSlots - selectedDeparture?.bookedSlots) || 20}
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

                <div className="bm-section">
                  <h3 className="bm-section-title">CHI TIẾT ĐƠN HÀNG</h3>
                  <div className="bm-order-grid">
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">CẦN ĐẶT CỌC (20%)</label>
                      <span className="bm-order-value bold">{formatVND(depositAmount)}</span>
                    </div>
                  </div>

                  <div className="bm-payment-method">
                    <label className="bm-sublabel">HÌNH THỨC THANH TOÁN</label>
                    <div className="bm-radios">
                      <label className="bm-radio-label">
                        <input
                          type="radio"
                          name="payment"
                          value="vnpay"
                          checked={paymentMethod === 'vnpay'}
                          onChange={() => setPaymentMethod('vnpay')}
                          disabled={step === 2}
                        /> VNPAY
                      </label>
                      <label className="bm-radio-label">
                        <input
                          type="radio"
                          name="payment"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          disabled={step === 2}
                        /> Chuyển khoản
                      </label>
                    </div>
                  </div>

                  <div className="bm-order-grid" style={{ marginTop: '1rem' }}>
                    <div className="bm-order-cell">
                      <label className="bm-sublabel">CÒN LẠI</label>
                      <span className="bm-order-value">{formatVND(remainingAmount)}</span>
                    </div>
                  </div>
                </div>

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

              <div className="bm-right">
                <div className="bm-sidebar-section">
                  <h4 className="bm-sidebar-title">THÔNG TIN ĐĂNG KÝ</h4>
                  <div className="bm-reg-info">
                    <p className="bm-reg-detail">Họ Tên: <strong>{form.ho} {form.ten}</strong></p>
                    <p className="bm-reg-detail">Điện Thoại: <strong>{form.phone}</strong></p>
                    <p className="bm-reg-detail">Email: <strong>{form.email}</strong></p>
                  </div>
                </div>

                <div className="bm-sidebar-section">
                  <h4 className="bm-sidebar-title">THÔNG TIN ĐƠN HÀNG</h4>
                  <div className="bm-order-summary">
                    <div className="bm-summary-tour">
                      <span className="bm-summary-name">Chi tiết tour</span>
                      {selectedDeparture && (
                        <span className="bm-summary-dates">({formatDateDisplay(selectedDeparture.startDate)} - {formatDateDisplay(selectedDeparture.endDate)})</span>
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
                        <label className="bm-sublabel">CẦN ĐẶC CỌC:</label>
                        <strong>{formatVND(depositAmount)}</strong>
                      </div>
                    </div>

                    <p className="bm-note">
                      Lưu ý: Tổ Kiến sẽ liên hệ với bạn để xác nhận đặt chỗ theo những thông tin bên trên.
                    </p>

                    <div className="bm-sidebar-actions">
                      <button
                        className={`btn btn-outline bm-edit-btn ${step === 1 ? 'bm-btn-disabled' : ''}`}
                        onClick={() => setStep(1)}
                        disabled={step === 1 || loading}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className={`btn btn-primary bm-confirm-btn ${step === 1 ? 'bm-btn-disabled' : ''}`}
                        disabled={step === 1 || loading}
                        onClick={handleConfirm}
                      >
                        {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Đặt chỗ'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bm-success-container">
              <div className="bm-success-header">
                <div className="bm-success-icon">✓</div>
                <h3>ĐẶT CHỖ THÀNH CÔNG</h3>
                <p>Mã đặt chỗ của bạn: <strong className="primary">{bookingCode}</strong></p>
                <p>Cảm ơn bạn đã tin tưởng và lựa chọn Tổ Kiến Adventure!</p>
              </div>

              <div className="bm-success-body">
                {paymentMethod === 'bank_transfer' && (
                  <div className="bm-bank-details">
                    <div className="bm-bank-right">
                      <h4 className="bm-bank-title">Thông tin chuyển khoản</h4>
                      <div className="bm-bank-row">
                        <span>Ngân hàng:</span>
                        <strong>Techcombank</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Chủ tài khoản:</span>
                        <strong>CÔNG TY TNHH Tổ Kiến Adventure</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Số tài khoản:</span>
                        <strong>19036785432015</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Số tiền đặt cọc:</span>
                        <strong className="primary">{formatVND(depositAmount)}</strong>
                      </div>
                      <div className="bm-bank-row">
                        <span>Nội dung:</span>
                        <strong className="primary uppercase">TOONG {bookingCode}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bm-success-footer">
                  <p className="bm-contact-note">
                    Tổ Kiến sẽ liên hệ với bạn trong vòng 24h để xác nhận và hướng dẫn các bước tiếp theo.
                  </p>
                  <button className="btn btn-primary bm-home-btn" onClick={onClose}>
                    Đóng
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
