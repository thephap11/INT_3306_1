import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import './FieldDetailPage.css'

export default function FieldDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [field, setField] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  })
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    const fetchField = async () => {
      setLoading(true)
      try {
        const res = await ApiClient.get(`/user/fields/${id}`)
        setField(res)
      } catch (err) {
        console.error(err)
        setError('Failed to load field')
      } finally {
        setLoading(false)
      }
    }
    fetchField()
  }, [id])

  // Convert backend slots to calendar format grouped by day
  const timeSlots = field?.slots ? (() => {
    const grouped = {}
    field.slots.forEach(slot => {
      const start = new Date(slot.start_time)
      const dateKey = start.toLocaleDateString('vi-VN')
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][start.getDay()],
          date: start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          times: []
        }
      }
      const end = new Date(slot.end_time)
      grouped[dateKey].times.push({
        time: `${start.getHours()}:${String(start.getMinutes()).padStart(2,'0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2,'0')}`,
        price: field.price || '1200K',
        available: slot.available !== false,
        start_time: slot.start_time,
        end_time: slot.end_time
      })
    })
    return Object.values(grouped).slice(0, 4)
  })() : []

  const reviews = [
    { id: 1, user: 'Nguyễn Văn A', rating: 5, date: '15/10/2025', comment: 'Sân đẹp, cỏ tốt, giá cả hợp lý' },
    { id: 2, user: 'Trần Thị B', rating: 4, date: '12/10/2025', comment: 'Sân rộng, thoáng mát, nhân viên nhiệt tình' },
    { id: 3, user: 'Lê Văn C', rating: 5, date: '10/10/2025', comment: 'Sân chất lượng, vị trí thuận tiện' }
  ]

  const handleTimeSelect = (dayIndex, timeSlot) => {
    if (timeSlot.available) {
      setSelectedTime({ dayIndex, timeSlot })
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    

    if (!authAPI.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để đặt sân. Chuyển đến trang đăng nhập?')) {
        navigate('/user/login')
      }
      return
    }
    
    if (!selectedTime) {
      alert('Vui lòng chọn khung giờ đặt sân')
      return
    }

    if (!bookingForm.name || !bookingForm.phone) {
      alert('Vui lòng điền đầy đủ họ tên và số điện thoại')
      return
    }

    const currentUser = authAPI.getCurrentUser()

    const bookingData = {
      customer_id: currentUser?.person_id || 1,
      field_id: Number(field.field_id),
      field_name: field.field_name,
      location: field.location,
      start_time: selectedTime.timeSlot.start_time,
      end_time: selectedTime.timeSlot.end_time,
      price: 1200000,
      customer_name: bookingForm.name,
      customer_email: bookingForm.email,
      customer_phone: bookingForm.phone,
      note: bookingForm.note
    }
    
    // Lưu vào localStorage để trang thanh toán sử dụng
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData))
    
    navigate('/user/booking')
  }

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return <div className="field-detail-page"><Navbar /><div className="container">Loading…</div><Footer /></div>
  if (error) return <div className="field-detail-page"><Navbar /><div className="container">{error}</div><Footer /></div>

  return (
    <div className="field-detail-page">
      <Navbar />
      
      <div className="field-detail-container">
        {/* Header */}
        <div className="field-header">
          <div className="field-header-left">
            <h1>{field.field_name}</h1>
            <p className="field-address">
              📍 {field.location}
            </p>
          </div>
          <div className="field-header-right">
            <div className="field-rating">
              <span className="rating-score">Đánh giá: 4.5</span>
              <span className="rating-stars">⭐ (123 Đánh giá)</span>
            </div>
            <div className="field-actions">
              <button className="action-btn">🔗</button>
              <button className="action-btn">❤️</button>
              <button className="action-btn">⚠️</button>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="field-gallery">
          <div className="gallery-main">
            <img src={field.image || '/images/fields/placeholder.svg'} alt={field.field_name} />
          </div>
          <div className="gallery-grid">
            {[1,2,3].map((idx) => (
              <div key={idx} className="gallery-item">
                <img src={field.image || '/images/fields/placeholder.svg'} alt={`${field.field_name} ${idx + 1}`} />
                {idx === 2 && <div className="gallery-more">Xem thêm</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="field-content">
          {/* Left Column - Booking Form */}
          <div className="field-booking-section">
            <h2>Đặt sân theo yêu cầu</h2>
            
            <form onSubmit={handleBookingSubmit} className="booking-detail-form">
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleFormChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleFormChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleFormChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Chọn ngày</label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">Ghi chú</label>
                <textarea
                  id="note"
                  name="note"
                  value={bookingForm.note}
                  onChange={handleFormChange}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-submit-booking">
                Gửi yêu cầu →
              </button>
            </form>

            {/* Time Slots Calendar */}
            <div className="time-slots-section">
              <div className="time-slots-header">
                <button className="nav-btn">←</button>
                <span>Lịch đặt sân</span>
                <button className="nav-btn">→</button>
                <div className="time-filters">
                  <button className="filter-btn">Khung sáng</button>
                  <button className="filter-btn active">Khung chiều</button>
                </div>
              </div>

              <div className="time-slots-grid">
                {timeSlots.map((day, dayIndex) => (
                  <div key={dayIndex} className="day-column">
                    <div className="day-header">
                      <div className="day-name">{day.day}</div>
                      <div className="day-date">{day.date}</div>
                    </div>
                    <div className="time-list">
                      {day.times.map((slot, slotIndex) => (
                        <button
                          key={slotIndex}
                          className={`time-slot ${!slot.available ? 'booked' : ''} ${
                            selectedTime?.dayIndex === dayIndex && 
                            selectedTime?.timeSlot.time === slot.time ? 'selected' : ''
                          }`}
                          onClick={() => handleTimeSelect(dayIndex, slot)}
                          disabled={!slot.available}
                        >
                          <div className="time-range">{slot.time}</div>
                          <div className="time-price">{slot.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Reviews */}
          <div className="field-info-section">
            {/* Thông tin sân */}
            <div className="info-card">
              <h3>Thông tin sân</h3>
              <div className="info-row">
                <span>Giờ mở cửa:</span>
                <strong>5h-23h30</strong>
              </div>
              <div className="info-row">
                <span>Số sân thi đấu:</span>
                <strong>5 Sân</strong>
              </div>
              <div className="info-row">
                <span>Giá sân:</span>
                <strong>{field.price || 'Liên hệ'}</strong>
              </div>
              <div className="info-row">
                <span>Trạng thái:</span>
                <strong>{field.status}</strong>
              </div>
            </div>

            {/* Dịch vụ tiện ích */}
            <div className="facilities-card">
              <h3>Dịch vụ tiện ích</h3>
              <div className="facilities-grid">
                {(field.facilities || ['Bãi đỗ xe', 'Căng tin', 'Nước uống', 'Phòng thay đồ']).map((facility, index) => (
                  <div key={index} className="facility-item">
                    <span className="facility-icon">✓</span>
                    <span className="facility-name">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-section">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Thông tin
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Đánh giá
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('policy')}
                >
                  Chính sách
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact')}
                >
                  Liên hệ
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === 'info' && (
                  <div className="info-content">
                    <h4>Thông tin chung về {field.field_name}</h4>
                    <p><strong>Địa chỉ:</strong> {field.location}</p>
                    <p><strong>Giờ mở cửa:</strong> 5:00 - 23:30 hàng ngày</p>
                    <p><strong>Số sân:</strong> 5 sân thi đấu chất lượng cao</p>
                    <p><strong>Loại sân:</strong> Sân cỏ nhân tạo thế hệ mới</p>
                    <br />
                    <h4>Mô tả</h4>
                    <p>Sân bóng {field.field_name} là một trong những sân bóng chất lượng cao nhất khu vực. 
                    Với cơ sở vật chất hiện đại, cỏ nhân tạo thế hệ mới, hệ thống chiếu sáng chuyên nghiệp 
                    và đội ngũ nhân viên phục vụ tận tình, chúng tôi cam kết mang đến cho bạn những trải nghiệm 
                    tuyệt vời nhất.</p>
                    <p>Sân được trang bị đầy đủ tiện nghi: phòng thay đồ rộng rãi, khu vực nghỉ ngơi, 
                    căng tin với đầy đủ đồ uống và thức ăn nhẹ, bãi đỗ xe rộng rãi và an toàn.</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-big">4.8</div>
                        <div className="rating-stars-display">⭐⭐⭐⭐⭐</div>
                        <div className="rating-count">123 đánh giá</div>
                      </div>
                      <div className="rating-breakdown">
                        {[
                          { star: 5, percent: 85 },
                          { star: 4, percent: 10 },
                          { star: 3, percent: 3 },
                          { star: 2, percent: 1 },
                          { star: 1, percent: 1 }
                        ].map(item => (
                          <div key={item.star} className="rating-bar">
                            <span>{item.star} ⭐</span>
                            <div className="bar">
                              <div className="bar-fill" style={{width: `${item.percent}%`}}></div>
                            </div>
                            <span>{item.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="reviews-list">
                      <h4>Gửi đánh giá của bạn</h4>
                      <p>Chia sẻ trải nghiệm của bạn về sân bóng này:</p>
                      <div className="review-form">
                        <div className="star-rating-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              type="button"
                              className="star-btn"
                              title={`${star} sao`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Nhận xét của bạn về sân bóng này (dịch vụ, chất lượng sân, tiện nghi...)"
                          rows="4"
                        />
                        <button type="button" className="btn-submit-review">Gửi đánh giá</button>
                      </div>
                    </div>

                    {reviews.length > 0 && (
                      <div className="existing-reviews">
                        <h4>Đánh giá từ khách hàng</h4>
                        {reviews.map(review => (
                          <div key={review.id} className="review-item">
                            <div className="review-header">
                              <div className="review-user">
                                <div className="user-avatar">{review.user.charAt(0)}</div>
                                <div>
                                  <strong>{review.user}</strong>
                                  <div className="review-date">{review.date}</div>
                                </div>
                              </div>
                              <div className="review-rating">
                                {'⭐'.repeat(review.rating)}
                              </div>
                            </div>
                            <div className="review-comment">{review.comment}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'policy' && (
                  <div className="policy-content">
                    <h4>Chính sách đặt sân và sử dụng dịch vụ</h4>
                    
                    <div className="policy-section">
                      <h5>1. Chính sách đặt sân</h5>
                      <ul>
                        <li>Khách hàng có thể đặt sân trước tối thiểu 2 giờ và tối đa 7 ngày.</li>
                        <li>Mỗi khung giờ đặt sân là 2 tiếng.</li>
                        <li>Sau khi đặt sân, vui lòng chờ quản lý xác nhận trong vòng 30 phút.</li>
                        <li>Nếu không nhận được xác nhận, vui lòng liên hệ hotline: 0123-456-789</li>
                      </ul>
                    </div>

                    <div className="policy-section">
                      <h5>2. Chính sách thanh toán</h5>
                      <ul>
                        <li>Thanh toán đặt cọc 50% giá trị đặt sân qua chuyển khoản hoặc ví điện tử.</li>
                        <li>Thanh toán số tiền còn lại khi đến sân.</li>
                        <li>Chấp nhận thanh toán: Tiền mặt, chuyển khoản, ví điện tử (Momo, ZaloPay, VNPay).</li>
                        <li>Hóa đơn VAT được xuất theo yêu cầu.</li>
                      </ul>
                    </div>

                    <div className="policy-section">
                      <h5>3. Chính sách hủy/đổi lịch</h5>
                      <ul>
                        <li><strong>Hủy trước 24h:</strong> Hoàn lại 100% tiền đặt cọc.</li>
                        <li><strong>Hủy trước 12h:</strong> Hoàn lại 50% tiền đặt cọc.</li>
                        <li><strong>Hủy trong vòng 12h:</strong> Không hoàn tiền.</li>
                        <li><strong>Đổi lịch:</strong> Được đổi lịch miễn phí 1 lần (trước 12h).</li>
                        <li>Trường hợp bất khả kháng (mưa to, thiên tai): Hoàn 100% hoặc đổi lịch linh hoạt.</li>
                      </ul>
                    </div>

                    <div className="policy-section">
                      <h5>4. Quy định sử dụng sân</h5>
                      <ul>
                        <li>Vào sân đúng giờ, trễ quá 15 phút sẽ mất 30 phút của khung giờ đặt.</li>
                        <li>Không mang đồ ăn, thức uống có cồn vào khu vực sân thi đấu.</li>
                        <li>Giữ gìn vệ sinh chung, không xả rác bừa bãi.</li>
                        <li>Sử dụng giày phù hợp cho sân cỏ nhân tạo (không dùng giày đinh sắt).</li>
                        <li>Bồi thường thiết bị nếu có hư hỏng do lỗi người sử dụng.</li>
                      </ul>
                    </div>

                    <div className="policy-section">
                      <h5>5. Chính sách bảo mật thông tin</h5>
                      <ul>
                        <li>Thông tin khách hàng được bảo mật tuyệt đối.</li>
                        <li>Chỉ sử dụng thông tin để xác nhận đặt sân và liên hệ khi cần thiết.</li>
                        <li>Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="contact-content">
                    <h4>Thông tin liên hệ</h4>
                    
                    <div className="contact-info">
                      <div className="contact-item">
                        <div className="contact-icon">📍</div>
                        <div>
                          <strong>Địa chỉ</strong>
                          <p>{field.location}</p>
                        </div>
                      </div>

                      <div className="contact-item">
                        <div className="contact-icon">📞</div>
                        <div>
                          <strong>Hotline</strong>
                          <p>0123-456-789 (Hỗ trợ 24/7)</p>
                        </div>
                      </div>

                      <div className="contact-item">
                        <div className="contact-icon">📧</div>
                        <div>
                          <strong>Email</strong>
                          <p>contact@{field.field_name?.toLowerCase().replace(/\s+/g, '')}.com</p>
                        </div>
                      </div>

                      <div className="contact-item">
                        <div className="contact-icon">🕒</div>
                        <div>
                          <strong>Giờ làm việc</strong>
                          <p>5:00 - 23:30 (Hàng ngày)</p>
                        </div>
                      </div>

                      <div className="contact-item">
                        <div className="contact-icon">💬</div>
                        <div>
                          <strong>Mạng xã hội</strong>
                          <p>
                            Facebook: /sanbong{field.field_name?.toLowerCase().replace(/\s+/g, '')}<br />
                            Zalo: 0123-456-789
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="contact-form-section">
                      <h5>Gửi tin nhắn cho chúng tôi</h5>
                      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Họ và tên *</label>
                            <input type="text" placeholder="Nhập họ và tên" required />
                          </div>
                          <div className="form-group">
                            <label>Số điện thoại *</label>
                            <input type="tel" placeholder="Nhập số điện thoại" required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" placeholder="Nhập email (không bắt buộc)" />
                        </div>
                        <div className="form-group">
                          <label>Nội dung *</label>
                          <textarea rows="4" placeholder="Nhập nội dung cần liên hệ..." required></textarea>
                        </div>
                        <button type="submit" className="btn-send-message">Gửi tin nhắn</button>
                      </form>
                    </div>

                    <div className="map-section">
                      <h5>Bản đồ</h5>
                      <div className="map-placeholder">
                        <p>🗺️ Google Maps sẽ hiển thị tại đây</p>
                        <small>{field.location}</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}