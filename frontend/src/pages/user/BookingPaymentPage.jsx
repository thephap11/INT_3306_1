import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import './BookingPaymentPage.css'

export default function BookingPaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const bookingId = searchParams.get('id')
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [isNewBooking, setIsNewBooking] = useState(false)

  useEffect(() => {
    // Nếu có bookingId, load booking đã tồn tại
    if (bookingId) {
      const fetchBooking = async () => {
        setLoading(true)
        try {
          const res = await ApiClient.get(`/user/bookings/${bookingId}`)
          setBooking(res)
          setIsNewBooking(false)
        } catch (err) {
          console.error(err)
          setError('Không thể tải thông tin đặt sân')
        } finally {
          setLoading(false)
        }
      }
      fetchBooking()
    } else {
      // Không có bookingId, load từ localStorage (booking mới chưa tạo)
      const pendingBooking = localStorage.getItem('pendingBooking')
      if (!pendingBooking) {
        setError('Không tìm thấy thông tin đặt sân')
        setLoading(false)
        return
      }
      
      try {
        const data = JSON.parse(pendingBooking)
        setBooking(data)
        setIsNewBooking(true)
        setLoading(false)
      } catch (err) {
        setError('Dữ liệu đặt sân không hợp lệ')
        setLoading(false)
      }
    }
  }, [bookingId])

  const handlePayment = async (e) => {
    e.preventDefault()
    
    // Kiểm tra đăng nhập
    if (!authAPI.isAuthenticated()) {
      alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại')
      navigate('/user/login')
      return
    }
    
    try {
      if (isNewBooking) {
        // Get current user info
        const currentUser = authAPI.getCurrentUser()
        
        // Booking mới: Tạo booking trong DB lần đầu
        const bookingPayload = {
          customer_id: currentUser?.person_id || booking.customer_id,
          field_id: booking.field_id,
          start_time: booking.start_time,
          end_time: booking.end_time,
          price: booking.price,
          note: `Name: ${booking.customer_name}, Email: ${booking.customer_email}, Phone: ${booking.customer_phone}, Note: ${booking.note || ''} | Payment: ${paymentMethod}`
        }
        
        const res = await ApiClient.post('/user/bookings', bookingPayload)
        const createdBookingId = res.booking?.booking_id || res.booking?.id
        
        // Xóa pending booking khỏi localStorage
        localStorage.removeItem('pendingBooking')
        
        // Chuyển sang trang trạng thái chờ duyệt
        if (createdBookingId) {
          navigate(`/user/booking-status?id=${createdBookingId}`)
        } else {
          alert('Lỗi: Không nhận được mã đặt sân')
          navigate('/user/fields')
        }
      } else {
        // Booking đã tồn tại: Chỉ update payment method
        await ApiClient.put(`/user/bookings/${bookingId}`, {
          payment_method: paymentMethod,
          status: 'pending'
        })
        
        // Chuyển sang trang trạng thái
        navigate(`/user/booking-status?id=${bookingId}`)
      }
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra khi xử lý thanh toán: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  if (loading) return (
    <div className="booking-payment-page">
      <Navbar />
      <div className="container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
      <Footer />
    </div>
  )

  if (error) return (
    <div className="booking-payment-page">
      <Navbar />
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/user/fields')} className="btn-back">
          Quay lại danh sách sân
        </button>
      </div>
      <Footer />
    </div>
  )

  const depositAmount = booking?.price ? (booking.price * 0.5).toFixed(0) : 0
  const remainingAmount = booking?.price ? (booking.price * 0.5).toFixed(0) : 0

  return (
    <div className="booking-payment-page">
      <Navbar />
      
      <div className="payment-container">
        <div className="payment-header">
          <h1>Thanh toán đặt sân</h1>
          <div className="booking-status pending">
            <span className="status-icon">⏳</span>
            <span>Chờ xác nhận</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Left: Booking Details */}
          <div className="booking-details-section">
            <div className="section-card">
              <h3>Thông tin đặt sân</h3>
              <div className="booking-info">
                {isNewBooking ? (
                  <>
                    <div className="info-row">
                      <span className="label">Trạng thái:</span>
                      <strong className="text-warning">Chưa tạo (chờ xác nhận thanh toán)</strong>
                    </div>
                  </>
                ) : (
                  <div className="info-row">
                    <span className="label">Mã đặt sân:</span>
                    <strong>#{bookingId}</strong>
                  </div>
                )}
                <div className="info-row">
                  <span className="label">Sân:</span>
                  <strong>{booking?.field_name || 'Sân bóng'}</strong>
                </div>
                <div className="info-row">
                  <span className="label">Địa chỉ:</span>
                  <span>{booking?.location || 'Đang cập nhật'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Thời gian:</span>
                  <strong>
                    {booking?.start_time ? new Date(booking.start_time).toLocaleString('vi-VN') : ''} 
                    {' - '}
                    {booking?.end_time ? new Date(booking.end_time).toLocaleTimeString('vi-VN') : ''}
                  </strong>
                </div>
                <div className="info-row">
                  <span className="label">Thời lượng:</span>
                  <span>2 giờ</span>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Thông tin khách hàng</h3>
              <div className="customer-info">
                {isNewBooking ? (
                  <>
                    <div className="info-row">
                      <span className="label">Họ và tên:</span>
                      <span>{booking?.customer_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span>{booking?.customer_email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Số điện thoại:</span>
                      <span>{booking?.customer_phone}</span>
                    </div>
                    {booking?.note && (
                      <div className="info-row">
                        <span className="label">Ghi chú:</span>
                        <span>{booking.note}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {booking?.note && (() => {
                      const noteMatch = booking.note.match(/Name:\s*([^,]+),\s*Email:\s*([^,]+),\s*Phone:\s*([^,]+)/)
                      if (noteMatch) {
                        return (
                          <>
                            <div className="info-row">
                              <span className="label">Họ và tên:</span>
                              <span>{noteMatch[1]}</span>
                            </div>
                            <div className="info-row">
                              <span className="label">Email:</span>
                              <span>{noteMatch[2]}</span>
                            </div>
                            <div className="info-row">
                              <span className="label">Số điện thoại:</span>
                              <span>{noteMatch[3]}</span>
                            </div>
                          </>
                        )
                      }
                      return <div className="info-row"><span>{booking.note}</span></div>
                    })()}
                  </>
                )}
              </div>
            </div>

            <div className="section-card policy-reminder">
              <h4>📋 Lưu ý quan trọng</h4>
              <ul>
                <li>Vui lòng chờ quản lý xác nhận đặt sân trong vòng <strong>30 phút</strong>.</li>
                <li>Sau khi xác nhận, bạn sẽ nhận được thông báo qua email/SMS.</li>
                <li>Thanh toán đặt cọc <strong>50%</strong> để giữ sân.</li>
                <li>Số tiền còn lại thanh toán khi đến sân.</li>
                <li>Hủy trước 24h: Hoàn 100% | Hủy trước 12h: Hoàn 50%</li>
              </ul>
            </div>
          </div>

          {/* Right: Payment */}
          <div className="payment-section">
            <div className="section-card">
              <h3>Chi tiết thanh toán</h3>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Giá sân (2 giờ)</span>
                  <strong>{booking?.price ? `${booking.price.toLocaleString()} VNĐ` : 'Liên hệ'}</strong>
                </div>
                <div className="price-row deposit">
                  <span>Đặt cọc (50%)</span>
                  <strong className="highlight">{depositAmount ? `${Number(depositAmount).toLocaleString()} VNĐ` : 'Liên hệ'}</strong>
                </div>
                <div className="price-row remaining">
                  <span>Thanh toán khi đến sân</span>
                  <span>{remainingAmount ? `${Number(remainingAmount).toLocaleString()} VNĐ` : 'Liên hệ'}</span>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h3>Phương thức thanh toán</h3>
              <form onSubmit={handlePayment} className="payment-form">
                <div className="payment-methods">
                  <label className={`payment-method ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-icon">🏦</div>
                      <div className="method-info">
                        <strong>Chuyển khoản ngân hàng</strong>
                        <small>Chuyển khoản qua STK</small>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-method ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-icon">📱</div>
                      <div className="method-info">
                        <strong>Ví MoMo</strong>
                        <small>Thanh toán qua MoMo</small>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-method ${paymentMethod === 'zalopay' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="zalopay"
                      checked={paymentMethod === 'zalopay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-icon">💳</div>
                      <div className="method-info">
                        <strong>ZaloPay</strong>
                        <small>Thanh toán qua ZaloPay</small>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-icon">💵</div>
                      <div className="method-info">
                        <strong>Tiền mặt tại sân</strong>
                        <small>Thanh toán khi đến sân</small>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <div className="bank-info">
                    <h4>Thông tin chuyển khoản</h4>
                    <div className="bank-details">
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 1234567890</p>
                      <p><strong>Chủ tài khoản:</strong> CONG TY SAN BONG ABC</p>
                      <p><strong>Nội dung:</strong> DCS {bookingId}</p>
                    </div>
                    <small className="note">💡 Vui lòng ghi đúng nội dung để xác nhận tự động</small>
                  </div>
                )}

                {(paymentMethod === 'momo' || paymentMethod === 'zalopay') && (
                  <div className="qr-info">
                    <div className="qr-placeholder">
                      <p>📱 Mã QR thanh toán</p>
                      <div className="qr-code">QR CODE</div>
                      <small>Quét mã để thanh toán {depositAmount ? `${Number(depositAmount).toLocaleString()} VNĐ` : ''}</small>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" onClick={() => navigate(-1)} className="btn-back">
                    Quay lại
                  </button>
                  <button type="submit" className="btn-confirm-payment">
                    Xác nhận đặt sân
                  </button>
                </div>
              </form>
            </div>

            <div className="support-info">
              <p>📞 Cần hỗ trợ? Liên hệ: <strong>0123-456-789</strong></p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
