import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './PolicyPage.modern.css'

export default function PolicyPage() {
  const navigate = useNavigate()

  return (
    <div className="policy-page-modern">
      <Navbar />
      
      <div className="policy-container">
        {/* Hero Section */}
        <div className="policy-hero">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h1>Chính sách & Điều khoản</h1>
          <p>Vui lòng đọc kỹ các chính sách để đảm bảo quyền lợi của bạn khi sử dụng dịch vụ đặt sân</p>
        </div>

        {/* Policy Sections */}
        <div className="policy-sections">
          {/* Booking Policy */}
          <div className="policy-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="section-title">
                <h2>Chính sách đặt sân</h2>
                <p>Quy định về việc đặt và sử dụng sân bóng</p>
              </div>
            </div>
            <div className="section-body">
              <ul className="policy-list">
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Thời gian đặt sân</h3>
                    <p>Quý khách vui lòng đặt sân trước ít nhất 2 giờ so với giờ bắt đầu để đảm bảo sân được chuẩn bị tốt nhất.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Xác nhận đặt sân</h3>
                    <p>Đơn đặt sân sẽ được xác nhận trong vòng 30 phút. Quý khách vui lòng kiểm tra email hoặc tin nhắn để nhận thông báo xác nhận.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Thời gian nhận sân</h3>
                    <p>Vui lòng đến đúng giờ đã đặt. Nếu đến muộn quá 15 phút, đơn đặt sân có thể bị hủy và mất phí đặt cọc.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Gia hạn thời gian</h3>
                    <p>Nếu muốn chơi thêm giờ, vui lòng liên hệ trực tiếp với quản lý sân. Việc gia hạn phụ thuộc vào lịch trống của sân.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Quy định sử dụng</h3>
                    <p>Quý khách có trách nhiệm giữ gìn cơ sở vật chất của sân. Mọi hư hỏng do quý khách gây ra sẽ phải bồi thường theo giá trị thực tế.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Policy */}
          <div className="policy-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div className="section-title">
                <h2>Chính sách thanh toán</h2>
                <p>Hướng dẫn và quy định về phương thức thanh toán</p>
              </div>
            </div>
            <div className="section-body">
              <ul className="policy-list">
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Phương thức thanh toán</h3>
                    <p>Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, VNPay).</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Đặt cọc</h3>
                    <p>Đối với các đơn đặt sân vào giờ cao điểm (18h-22h), quý khách cần đặt cọc 30% giá trị đơn hàng để giữ chỗ.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Thanh toán phần còn lại</h3>
                    <p>Quý khách thanh toán số tiền còn lại khi đến nhận sân. Vui lòng mang theo mã đặt sân để đối chiếu.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Hóa đơn VAT</h3>
                    <p>Nếu cần xuất hóa đơn VAT, vui lòng thông báo trước khi thanh toán và cung cấp đầy đủ thông tin công ty.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Cancellation & Refund Policy */}
          <div className="policy-section">
            <div className="section-header">
              <div className="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </div>
              <div className="section-title">
                <h2>Chính sách hủy sân & hoàn tiền</h2>
                <p>Quy định về việc hủy đặt sân và mức hoàn tiền</p>
              </div>
            </div>
            <div className="section-body">
              <ul className="policy-list">
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Quyền hủy đặt sân</h3>
                    <p>Quý khách có quyền hủy đặt sân bất kỳ lúc nào. Tuy nhiên, mức hoàn tiền sẽ phụ thuộc vào thời điểm hủy.</p>
                  </div>
                </li>
                <li className="policy-item">
                  <div className="item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="item-content">
                    <h3>Thời gian xử lý hoàn tiền</h3>
                    <p>Tiền sẽ được hoàn lại trong vòng 3-7 ngày làm việc kể từ ngày hủy đơn. Phương thức hoàn tiền theo hình thức đã thanh toán.</p>
                  </div>
                </li>
              </ul>

              <div className="refund-table-container">
                <table className="refund-table">
                  <thead>
                    <tr>
                      <th>Thời gian hủy</th>
                      <th>Mức hoàn tiền</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Trước 24 giờ</td>
                      <td><span className="refund-percentage">100%</span></td>
                      <td>Hoàn lại toàn bộ số tiền đã đặt cọc</td>
                    </tr>
                    <tr>
                      <td>12-24 giờ trước</td>
                      <td><span className="refund-percentage">70%</span></td>
                      <td>Hoàn lại 70% số tiền đã đặt cọc</td>
                    </tr>
                    <tr>
                      <td>6-12 giờ trước</td>
                      <td><span className="refund-percentage low">50%</span></td>
                      <td>Hoàn lại 50% số tiền đã đặt cọc</td>
                    </tr>
                    <tr>
                      <td>2-6 giờ trước</td>
                      <td><span className="refund-percentage low">30%</span></td>
                      <td>Hoàn lại 30% số tiền đã đặt cọc</td>
                    </tr>
                    <tr>
                      <td>Dưới 2 giờ</td>
                      <td><span className="refund-percentage none">0%</span></td>
                      <td>Không hoàn lại tiền đặt cọc</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="important-notes">
                <h4>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Lưu ý quan trọng
                </h4>
                <ul>
                  <li>Trong trường hợp bất khả kháng (mưa to, thiên tai, dịch bệnh), chúng tôi sẽ hoàn lại 100% số tiền hoặc cho phép đổi lịch miễn phí.</li>
                  <li>Nếu quý khách đến muộn quá 15 phút mà không thông báo, đơn đặt sân sẽ bị hủy và không hoàn tiền.</li>
                  <li>Các trường hợp đặc biệt sẽ được xem xét và giải quyết dựa trên từng tình huống cụ thể.</li>
                  <li>Vui lòng liên hệ với chúng tôi ngay khi cần hủy đặt sân để được hỗ trợ tốt nhất.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="contact-cta">
          <h3>Cần hỗ trợ thêm?</h3>
          <p>Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn</p>
          <button className="contact-button" onClick={() => navigate('/user/contact')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Liên hệ ngay
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
