import React from 'react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './PolicyPage.css'

export default function PolicyPage() {
  return (
    <div className="policy-page">
      <Navbar />
      
      <div className="policy-container">
        <div className="policy-header">
          <h1>📋 Chính sách & Điều khoản</h1>
          <p className="header-subtitle">Quy định sử dụng dịch vụ đặt sân bóng đá</p>
        </div>

        <div className="policy-content">
          {/* Chính sách đặt sân */}
          <section className="policy-section">
            <div className="section-icon">⚽</div>
            <h2>1. Chính sách đặt sân</h2>
            
            <div className="policy-card">
              <h3>1.1. Quy định đặt sân</h3>
              <ul>
                <li>
                  <strong>Thời gian đặt trước:</strong> Khách hàng có thể đặt sân trước tối thiểu 2 giờ và tối đa 30 ngày.
                </li>
                <li>
                  <strong>Thời lượng thuê sân:</strong> Mỗi khung giờ đặt sân tối thiểu là 2 tiếng, tối đa 4 tiếng liên tục.
                </li>
                <li>
                  <strong>Xác nhận đặt sân:</strong> Sau khi đặt sân, vui lòng chờ quản lý xác nhận trong vòng 30 phút. Nếu không nhận được xác nhận, vui lòng liên hệ hotline: 0123-456-789
                </li>
                <li>
                  <strong>Thông tin đặt sân:</strong> Vui lòng cung cấp đầy đủ và chính xác thông tin (họ tên, số điện thoại, email) để được hỗ trợ tốt nhất.
                </li>
                <li>
                  <strong>Đặt lịch cố định:</strong> Đối với khách hàng có nhu cầu đặt lịch cố định hàng tuần/tháng, vui lòng liên hệ trực tiếp để được tư vấn và hưởng ưu đãi.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>1.2. Xác nhận và thông báo</h3>
              <ul>
                <li>Sau khi đặt sân thành công, hệ thống sẽ gửi email/SMS xác nhận về thông tin đặt sân.</li>
                <li>Khách hàng sẽ nhận được thông báo khi quản lý xác nhận hoặc từ chối yêu cầu đặt sân.</li>
                <li>Vui lòng kiểm tra email/tin nhắn thường xuyên để không bỏ lỡ thông tin quan trọng.</li>
                <li>Trong trường hợp có thay đổi, chúng tôi sẽ liên hệ qua số điện thoại đã đăng ký.</li>
              </ul>
            </div>
          </section>

          {/* Chính sách thanh toán */}
          <section className="policy-section">
            <div className="section-icon">💳</div>
            <h2>2. Chính sách thanh toán</h2>
            
            <div className="policy-card">
              <h3>2.1. Phương thức thanh toán</h3>
              <ul>
                <li>
                  <strong>Đặt cọc trước:</strong> Thanh toán đặt cọc 50% giá trị đặt sân qua chuyển khoản hoặc ví điện tử (Momo, ZaloPay, VNPay).
                </li>
                <li>
                  <strong>Thanh toán tại sân:</strong> Thanh toán số tiền còn lại (50%) khi đến sân. Chấp nhận tiền mặt hoặc chuyển khoản.
                </li>
                <li>
                  <strong>Thanh toán toàn bộ trước:</strong> Khách hàng có thể thanh toán 100% trước qua các kênh online để được ưu tiên và nhận ưu đãi.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>2.2. Thông tin chuyển khoản</h3>
              <div className="bank-info">
                <div className="bank-item">
                  <strong>🏦 Ngân hàng:</strong> Vietcombank - Chi nhánh Hà Nội
                </div>
                <div className="bank-item">
                  <strong>👤 Chủ tài khoản:</strong> NGUYEN VAN A
                </div>
                <div className="bank-item">
                  <strong>🔢 Số tài khoản:</strong> 0123456789
                </div>
                <div className="bank-item">
                  <strong>💬 Nội dung:</strong> [Họ tên] - [Số điện thoại] - Dat san [Ngày]
                </div>
              </div>
            </div>

            <div className="policy-card">
              <h3>2.3. Hóa đơn VAT</h3>
              <ul>
                <li>Hóa đơn VAT được xuất theo yêu cầu của khách hàng.</li>
                <li>Vui lòng cung cấp thông tin công ty (tên, mã số thuế, địa chỉ) khi đặt sân nếu có nhu cầu xuất hóa đơn.</li>
                <li>Hóa đơn sẽ được gửi qua email trong vòng 24 giờ sau khi hoàn thành thanh toán.</li>
              </ul>
            </div>
          </section>

          {/* Chính sách hủy/đổi lịch */}
          <section className="policy-section">
            <div className="section-icon">🔄</div>
            <h2>3. Chính sách hủy và đổi lịch</h2>
            
            <div className="policy-card">
              <h3>3.1. Hủy đặt sân</h3>
              <div className="refund-table">
                <div className="refund-row header">
                  <div className="refund-col">Thời gian hủy</div>
                  <div className="refund-col">Hoàn tiền</div>
                </div>
                <div className="refund-row">
                  <div className="refund-col">Hủy trước 48 giờ</div>
                  <div className="refund-col success">100% tiền đặt cọc</div>
                </div>
                <div className="refund-row">
                  <div className="refund-col">Hủy trước 24 giờ</div>
                  <div className="refund-col warning">70% tiền đặt cọc</div>
                </div>
                <div className="refund-row">
                  <div className="refund-col">Hủy trước 12 giờ</div>
                  <div className="refund-col danger">50% tiền đặt cọc</div>
                </div>
                <div className="refund-row">
                  <div className="refund-col">Hủy trong vòng 12 giờ</div>
                  <div className="refund-col error">Không hoàn tiền</div>
                </div>
              </div>
            </div>

            <div className="policy-card">
              <h3>3.2. Đổi lịch đặt sân</h3>
              <ul>
                <li>
                  <strong>Đổi lịch miễn phí:</strong> Được đổi lịch miễn phí 1 lần nếu thông báo trước ít nhất 12 giờ.
                </li>
                <li>
                  <strong>Đổi lịch lần 2:</strong> Từ lần thứ 2 trở đi, phí đổi lịch là 100.000 VNĐ/lần.
                </li>
                <li>
                  <strong>Điều kiện đổi lịch:</strong> Chỉ được đổi sang khung giờ khác trong vòng 7 ngày kể từ ngày đặt ban đầu.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>3.3. Trường hợp bất khả kháng</h3>
              <ul>
                <li>
                  <strong>Mưa to, thời tiết xấu:</strong> Hoàn 100% hoặc đổi lịch miễn phí, linh hoạt.
                </li>
                <li>
                  <strong>Sự cố kỹ thuật:</strong> Nếu sân không thể sử dụng do lỗi kỹ thuật, hoàn 100% và hỗ trợ đổi sang sân khác (nếu có).
                </li>
                <li>
                  <strong>Thiên tai, dịch bệnh:</strong> Hoàn tiền 100% hoặc giữ lại để sử dụng sau khi tình hình ổn định.
                </li>
              </ul>
            </div>
          </section>

          {/* Quy định sử dụng sân */}
          <section className="policy-section">
            <div className="section-icon">⚠️</div>
            <h2>4. Quy định sử dụng sân</h2>
            
            <div className="policy-card">
              <h3>4.1. Thời gian sử dụng</h3>
              <ul>
                <li>
                  <strong>Giờ vào sân:</strong> Vào sân đúng giờ đã đặt. Trễ quá 15 phút sẽ mất 30 phút của khung giờ thuê.
                </li>
                <li>
                  <strong>Giờ kết thúc:</strong> Kết thúc đúng giờ để không ảnh hưởng đến khách tiếp theo. Nếu muốn kéo dài, vui lòng liên hệ trước và thanh toán thêm.
                </li>
                <li>
                  <strong>Thời gian chuẩn bị:</strong> Khách được vào sân trước 10 phút để thay đồ và chuẩn bị.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>4.2. Vệ sinh và an toàn</h3>
              <ul>
                <li>Giữ gìn vệ sinh chung, không xả rác bừa bãi. Vi phạm sẽ bị phạt 200.000 VNĐ.</li>
                <li>Không mang đồ ăn, thức uống có cồn vào khu vực sân thi đấu.</li>
                <li>Không hút thuốc trong khu vực sân. Có khu vực riêng dành cho người hút thuốc.</li>
                <li>Tuân thủ các quy định về an toàn cháy nổ và an ninh.</li>
                <li>Báo ngay cho nhân viên nếu phát hiện hư hỏng thiết bị hoặc sự cố.</li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>4.3. Trang phục và thiết bị</h3>
              <ul>
                <li>
                  <strong>Giày đá bóng:</strong> Sử dụng giày phù hợp cho sân cỏ nhân tạo. Không sử dụng giày đinh sắt.
                </li>
                <li>
                  <strong>Trang phục:</strong> Mặc trang phục thể thao phù hợp, gọn gàng.
                </li>
                <li>
                  <strong>Thiết bị bảo hộ:</strong> Khuyến khích sử dụng bảo hộ (ống đồng, bó gối) để đảm bảo an toàn.
                </li>
                <li>
                  <strong>Bóng đá:</strong> Sân cung cấp bóng miễn phí. Nếu muốn sử dụng bóng riêng, vui lòng đảm bảo chất lượng tốt.
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>4.4. Trách nhiệm bồi thường</h3>
              <ul>
                <li>Khách hàng chịu trách nhiệm bồi thường thiết bị nếu có hư hỏng do lỗi người sử dụng.</li>
                <li>Không được tự ý di chuyển hoặc thay đổi thiết bị, trang thiết bị của sân.</li>
                <li>Mọi tranh chấp, xô xát trong quá trình sử dụng sân do khách hàng tự giải quyết.</li>
                <li>Sân không chịu trách nhiệm về tài sản cá nhân bị mất cắp. Vui lòng giữ gìn tài sản.</li>
              </ul>
            </div>
          </section>

          {/* Chính sách bảo mật */}
          <section className="policy-section">
            <div className="section-icon">🔒</div>
            <h2>5. Chính sách bảo mật thông tin</h2>
            
            <div className="policy-card">
              <h3>5.1. Thu thập thông tin</h3>
              <ul>
                <li>Chúng tôi chỉ thu thập thông tin cá nhân cần thiết: họ tên, số điện thoại, email, địa chỉ.</li>
                <li>Thông tin được sử dụng để xác nhận đặt sân, liên hệ và cải thiện dịch vụ.</li>
                <li>Mọi thông tin thanh toán được mã hóa và bảo mật tuyệt đối.</li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>5.2. Bảo vệ thông tin</h3>
              <ul>
                <li>Thông tin khách hàng được bảo mật tuyệt đối theo quy định pháp luật.</li>
                <li>Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý của khách hàng.</li>
                <li>Áp dụng các biện pháp bảo mật kỹ thuật cao để ngăn chặn truy cập trái phép.</li>
                <li>Khách hàng có quyền yêu cầu xóa hoặc cập nhật thông tin cá nhân bất kỳ lúc nào.</li>
              </ul>
            </div>
          </section>

          {/* Điều khoản khác */}
          <section className="policy-section">
            <div className="section-icon">📝</div>
            <h2>6. Điều khoản chung</h2>
            
            <div className="policy-card">
              <ul>
                <li>Chính sách này có hiệu lực từ ngày 01/01/2025.</li>
                <li>Chúng tôi có quyền thay đổi, điều chỉnh chính sách mà không cần báo trước. Mọi thay đổi sẽ được cập nhật trên website.</li>
                <li>Khách hàng có trách nhiệm theo dõi và cập nhật chính sách mới nhất.</li>
                <li>Mọi thắc mắc, khiếu nại vui lòng liên hệ: <strong>hotline@sanbongda.com</strong> hoặc <strong>0123-456-789</strong></li>
                <li>Chính sách được áp dụng thống nhất cho tất cả các sân thuộc hệ thống.</li>
              </ul>
            </div>
          </section>

          {/* Contact CTA */}
          <div className="policy-footer">
            <div className="footer-card">
              <h3>💬 Cần hỗ trợ?</h3>
              <p>Nếu bạn có bất kỳ thắc mắc nào về chính sách, đừng ngần ngại liên hệ với chúng tôi!</p>
              <div className="footer-actions">
                <a href="/user/contact" className="btn-contact">Liên hệ ngay</a>
                <a href="/user/fields" className="btn-fields">Đặt sân</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}