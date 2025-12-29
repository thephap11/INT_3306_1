# TÀI LIỆU HỆ THỐNG QUẢN LÝ SÂN BÓNG
## Football Field Management System - Comprehensive Documentation

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Cơ sở dữ liệu](#4-cơ-sở-dữ-liệu)
5. [Chức năng hệ thống](#5-chức-năng-hệ-thống)
6. [API Endpoints](#6-api-endpoints)
7. [Phân quyền người dùng](#7-phân-quyền-người-dùng)
8. [Tính năng nâng cao](#8-tính-năng-nâng-cao)
9. [Bảo mật](#9-bảo-mật)
10. [Hướng dẫn cài đặt](#10-hướng-dẫn-cài-đặt)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Giới thiệu
Hệ thống quản lý sân bóng là một ứng dụng web toàn diện cho phép quản lý, đặt lịch và vận hành các sân bóng đá. Hệ thống hỗ trợ 3 loại người dùng chính: Admin, Manager và User (khách hàng).

### 1.2 Mục tiêu
- **Tự động hóa**: Quy trình đặt sân, thanh toán và quản lý lịch trình
- **Tối ưu hóa**: Quản lý doanh thu và tài nguyên sân bóng
- **Trải nghiệm người dùng**: Giao diện thân thiện, dễ sử dụng
- **Báo cáo thông minh**: Thống kê doanh thu, đánh giá và phân tích

### 1.3 Đặc điểm nổi bật
- ✅ Quản lý đa cấp (Admin/Manager/User)
- ✅ Đặt lịch sân bóng trực tuyến
- ✅ Hệ thống thanh toán tích hợp
- ✅ Đánh giá và nhận xét sân bóng
- ✅ Chat trực tiếp giữa khách hàng và quản lý
- ✅ AI Assistant hỗ trợ gợi ý và phát hiện gian lận
- ✅ Báo cáo doanh thu chi tiết
- ✅ Quản lý nhân viên và phân quyền
- ✅ Khôi phục mật khẩu qua email OTP

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1 Kiến trúc tổng thể
Hệ thống sử dụng kiến trúc **Monorepo** với mô hình **Client-Server** phân tách rõ ràng:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│              Vite + React Router + Axios                 │
│                 Port: 5173 (dev)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 BACKEND (Express.js)                     │
│           Node.js + Sequelize ORM + JWT                  │
│                  Port: 5000                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────┐
│              DATABASE (PostgreSQL/MySQL)                 │
│              Sequelize Migrations + Models               │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Cấu trúc thư mục

#### Backend Structure
```
backend/
├── config/
│   ├── config.json          # Database configuration
│   └── config.cjs           # Sequelize config
├── database/
│   └── chat_tables.sql      # SQL schema cho chat
├── public/
│   └── uploads/             # User uploaded files
│       └── reviews/         # Review images
├── src/
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   ├── index.js             # Alternative entry
│   ├── config/
│   │   ├── database.js      # DB connection
│   │   └── dotenv.js        # Environment config
│   ├── controllers/
│   │   ├── admin/           # Admin controllers
│   │   ├── manager/         # Manager controllers
│   │   ├── user/            # User controllers
│   │   ├── aiController.js  # AI features
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── upload.js        # File upload handler
│   ├── migrations/          # Database migrations
│   ├── models/              # Sequelize models
│   ├── routes/
│   │   ├── admin/
│   │   ├── manager/
│   │   ├── user/
│   │   ├── aiRoutes.js
│   │   └── chatRoutes.js
│   ├── services/            # Business logic
│   └── utils/               # Helper functions
└── package.json
```

#### Frontend Structure
```
frontend/
├── public/
│   ├── images/              # Static assets
│   └── readme.txt
├── src/
│   ├── main.jsx             # App entry point
│   ├── App.jsx              # Root component
│   ├── index.css            # Global styles
│   ├── api/                 # API clients
│   ├── components/          # Reusable components
│   ├── pages/
│   │   ├── admin/           # Admin pages
│   │   ├── manager/         # Manager pages
│   │   └── user/            # User pages
│   └── services/            # Frontend services
├── vite.config.js
└── package.json
```

### 2.3 Luồng dữ liệu (Data Flow)

```
User Action (Frontend)
    ↓
React Component
    ↓
API Service (Axios)
    ↓
HTTP Request → Backend Express Route
    ↓
Middleware (Auth, Role Check)
    ↓
Controller (Business Logic)
    ↓
Service Layer (Optional)
    ↓
Model (Sequelize ORM)
    ↓
Database (PostgreSQL/MySQL)
    ↓
Response ← Controller
    ↓
JSON Response ← Frontend
    ↓
Update UI State
```

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 3.1 Backend Technologies

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | ^4.21.2 | Web framework |
| **Sequelize** | ^6.35.2 | ORM for database |
| **PostgreSQL** | ^8.11.3 | Primary database |
| **JWT** | ^9.0.2 | Authentication tokens |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **Multer** | ^2.0.2 | File upload handling |
| **Nodemailer** | ^7.0.11 | Email sending (OTP) |
| **Morgan** | ^1.10.1 | HTTP logging |
| **CORS** | ^2.8.5 | Cross-origin requests |
| **Google Generative AI** | ^0.24.1 | AI features |
| **dotenv** | ^16.6.1 | Environment variables |

### 3.2 Frontend Technologies

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | 18.2.0 | UI library |
| **Vite** | ^4.4.11 | Build tool & dev server |
| **React Router** | ^6.16.0 | Client-side routing |
| **Axios** | ^1.5.0 | HTTP client |
| **React Hot Toast** | ^2.6.0 | Notifications |
| **Recharts** | ^3.6.0 | Data visualization |

### 3.3 Development Tools

- **Sequelize CLI**: Database migrations
- **ESM (ES Modules)**: Modern JavaScript modules
- **Git**: Version control
- **npm**: Package management

---

## 4. CƠ SỞ DỮ LIỆU

### 4.1 Database Schema

Hệ thống sử dụng **PostgreSQL** với 17 bảng chính:

#### 4.1.1 Core Tables

**1. person** - Quản lý người dùng
```sql
- person_id (PK)
- person_name
- birthday
- sex
- address
- email (UNIQUE)
- phone
- username (UNIQUE)
- password (hashed)
- role (user/manager/admin)
- status (active/inactive)
- fieldId (FK to fields)
```

**2. fields** - Quản lý sân bóng
```sql
- field_id (PK)
- manager_id (FK to person)
- field_name
- location
- status (active/inactive)
- rental_price
```

**3. field_images** - Hình ảnh sân bóng
```sql
- image_id (PK)
- field_id (FK)
- image_url
- is_primary
- created_at
```

**4. field_schedules** - Lịch trình sân
```sql
- schedule_id (PK)
- field_id (FK)
- manager_id (FK)
- date
- start_time
- end_time
- status (available/booked)
- price
- created_at
```

#### 4.1.2 Booking & Payment Tables

**5. bookings** - Đặt sân
```sql
- booking_id (PK)
- customer_id (FK)
- field_id (FK)
- manager_id (FK)
- start_time
- end_time
- status (pending/confirmed/completed/cancelled)
- price
- note
- created_at, updated_at
```

**6. payments** - Thanh toán
```sql
- payment_id (PK)
- booking_id (FK)
- customer_id (FK)
- field_id (FK)
- amount
- payment_method
- payment_status
- transaction_id
- paid_at
- created_at
```

#### 4.1.3 Review & Feedback Tables

**7. reviews** - Đánh giá sân
```sql
- review_id (PK)
- customer_id (FK)
- field_id (FK)
- booking_id (FK)
- rating (1-5)
- comment
- images (JSON array)
- created_at, updated_at
```

**8. feedbacks** - Phản hồi chung
```sql
- feedback_id (PK)
- person_id (FK)
- subject
- message
- status
- created_at
```

**9. replies** - Trả lời phản hồi
```sql
- reply_id (PK)
- feedback_id (FK)
- admin_id (FK)
- message
- created_at
```

#### 4.1.4 Chat System Tables

**10. chats** - Cuộc trò chuyện
```sql
- chat_id (PK)
- user_id (FK)
- manager_id (FK)
- created_at, updated_at
```

**11. messages** - Tin nhắn
```sql
- message_id (PK)
- chat_id (FK)
- sender_id (FK)
- message_text
- is_read
- created_at
```

#### 4.1.5 Revenue Tracking Tables

**12. revenue_daily** - Doanh thu ngày
```sql
- id (PK)
- date
- field_id (FK)
- total_bookings
- total_revenue
- created_at
```

**13. revenue_weekly** - Doanh thu tuần
```sql
- id (PK)
- year, week
- field_id (FK)
- total_bookings
- total_revenue
- created_at
```

**14. revenue_monthly** - Doanh thu tháng
```sql
- id (PK)
- year, month
- field_id (FK)
- total_bookings
- total_revenue
- created_at
```

#### 4.1.6 Security Table

**15. password_resets** - Khôi phục mật khẩu
```sql
- id (PK)
- email
- token
- expires_at
- created_at
```

### 4.2 Relationships

```
person (1) ────────── (n) fields        [manager manages fields]
person (1) ────────── (n) bookings      [customer books]
fields (1) ────────── (n) bookings      [field is booked]
fields (1) ────────── (n) field_images  
fields (1) ────────── (n) field_schedules
bookings (1) ─────── (1) payments
bookings (1) ─────── (n) reviews
person (1) ────────── (n) chats         [user/manager]
chats (1) ─────────── (n) messages
```

### 4.3 Indexes

Hệ thống tạo indexes cho:
- Foreign keys (tất cả)
- username, email (person)
- status fields
- date ranges (bookings, schedules)
- Chat timestamps

---

## 5. CHỨC NĂNG HỆ THỐNG

### 5.1 Chức năng theo vai trò

#### 5.1.1 ADMIN - Quản trị viên hệ thống

**Dashboard & Analytics**
- 📊 Xem tổng quan toàn hệ thống
- 📈 Báo cáo doanh thu theo ngày/tuần/tháng
- 📉 Thống kê booking và sân bóng
- 💰 Phân tích doanh thu theo sân, theo khoảng thời gian

**User Management**
- 👥 Quản lý tất cả người dùng (CRUD)
- 🔒 Thay đổi trạng thái tài khoản (active/inactive)
- 📊 Xem thống kê người dùng
- ➕ Tạo tài khoản admin/manager/user
- 🔄 Cập nhật thông tin người dùng

**Field Management**
- 🏟️ Quản lý tất cả sân bóng (CRUD)
- 📸 Upload/xóa hình ảnh sân
- 💵 Cập nhật giá thuê sân
- 🔄 Thay đổi trạng thái sân
- 📊 Xem thống kê sân bóng

**Booking Management**
- 📅 Xem tất cả booking
- ✅ Duyệt/từ chối booking
- 🔄 Thay đổi trạng thái booking
- 📊 Thống kê booking theo thời gian
- ❌ Hủy booking

**Employee Management**
- 👨‍💼 Quản lý nhân viên (manager)
- 🏟️ Phân công sân cho manager
- 📊 Xem thống kê nhân viên

#### 5.1.2 MANAGER - Quản lý sân bóng

**Dashboard**
- 📊 Xem thống kê sân được phân công
- 💰 Doanh thu của các sân quản lý
- 📈 Báo cáo booking

**Field Management**
- 🏟️ Quản lý sân được phân công
- ✏️ Cập nhật thông tin sân
- 📅 Quản lý lịch trình sân

**Booking Management**
- 📋 Xem danh sách booking
- ✅ Duyệt booking
- ❌ Từ chối booking
- ✔️ Hoàn thành booking
- 🔄 Cập nhật trạng thái

**Payment Tracking**
- 💳 Xem thông tin thanh toán
- 📊 Theo dõi doanh thu

**Chat Support**
- 💬 Chat với khách hàng
- 📩 Nhận và trả lời tin nhắn

#### 5.1.3 USER - Khách hàng

**Browse & Search**
- 🔍 Tìm kiếm sân bóng
- 📍 Lọc theo vị trí
- 💰 Lọc theo giá
- ⭐ Xem đánh giá sân

**Booking**
- 📅 Xem lịch trống
- 🕐 Chọn khung giờ
- 📝 Đặt sân
- 💳 Thanh toán
- 🧾 Xem lịch sử đặt sân

**Reviews**
- ⭐ Đánh giá sân (1-5 sao)
- 💬 Viết nhận xét
- 📸 Upload hình ảnh
- 👁️ Xem đánh giá của người khác

**Profile Management**
- 👤 Cập nhật thông tin cá nhân
- 🔒 Đổi mật khẩu
- 📜 Xem lịch sử giao dịch

**Support**
- 💬 Chat với manager
- 📧 Gửi feedback
- ❓ Hỗ trợ khách hàng

### 5.2 Chức năng chung

**Authentication**
- 🔐 Đăng ký tài khoản
- 🔑 Đăng nhập (username/email)
- 🔄 Refresh token
- 📧 Quên mật khẩu (OTP qua email)
- ✅ Xác thực OTP
- 🔒 Đặt lại mật khẩu
- 🚪 Đăng xuất

**AI Features**
- 🤖 AI Chat Assistant
- 💡 Gợi ý sân phù hợp
- 🌤️ Thông tin thời tiết
- 🕐 Gợi ý khung giờ tối ưu
- 🔍 Phát hiện gian lận booking

---

## 6. API ENDPOINTS

### 6.1 Authentication APIs (`/api/auth`)

```
POST   /api/auth/register          - Đăng ký tài khoản mới
POST   /api/auth/login             - Đăng nhập
POST   /api/auth/refresh           - Refresh access token
GET    /api/auth/me                - Lấy thông tin user hiện tại [Protected]
POST   /api/auth/logout            - Đăng xuất [Protected]
POST   /api/auth/forgot-password   - Gửi OTP reset password
POST   /api/auth/verify-otp        - Xác thực OTP
POST   /api/auth/reset-password    - Đặt lại mật khẩu
POST   /api/auth/resend-otp        - Gửi lại OTP
```

### 6.2 Admin APIs (`/api/admin`)

**Dashboard**
```
GET    /api/admin/dashboard                    - Thống kê tổng quan
GET    /api/admin/revenue/date-range           - Doanh thu theo khoảng thời gian
GET    /api/admin/revenue/field/:fieldId       - Doanh thu theo sân
GET    /api/admin/revenue/monthly              - Doanh thu theo tháng
```

**User Management**
```
GET    /api/admin/users                        - Danh sách users
GET    /api/admin/users/stats                  - Thống kê users
GET    /api/admin/users/:id                    - Chi tiết user
POST   /api/admin/users                        - Tạo user mới
PUT    /api/admin/users/:id                    - Cập nhật user
DELETE /api/admin/users/:id                    - Xóa user
PATCH  /api/admin/users/:id/status             - Thay đổi trạng thái
```

**Field Management**
```
GET    /api/admin/fields                       - Danh sách sân
GET    /api/admin/fields/stats                 - Thống kê sân
GET    /api/admin/fields/:id                   - Chi tiết sân
POST   /api/admin/fields                       - Tạo sân mới
PUT    /api/admin/fields/:id                   - Cập nhật sân
DELETE /api/admin/fields/:id                   - Xóa sân
PATCH  /api/admin/fields/:id/status            - Thay đổi trạng thái
POST   /api/admin/fields/:id/images            - Upload hình ảnh
DELETE /api/admin/fields/images/:imageId       - Xóa hình ảnh
```

**Booking Management**
```
GET    /api/admin/bookings                     - Danh sách bookings
GET    /api/admin/bookings/stats               - Thống kê bookings
GET    /api/admin/bookings/date-range          - Bookings theo thời gian
GET    /api/admin/bookings/:id                 - Chi tiết booking
PATCH  /api/admin/bookings/:id/status          - Cập nhật trạng thái
POST   /api/admin/bookings/:id/cancel          - Hủy booking
```

**Employee Management**
```
GET    /api/admin/employees                    - Danh sách nhân viên
GET    /api/admin/employees/stats              - Thống kê nhân viên
GET    /api/admin/employees/:id                - Chi tiết nhân viên
POST   /api/admin/employees                    - Tạo nhân viên
PUT    /api/admin/employees/:id                - Cập nhật nhân viên
DELETE /api/admin/employees/:id                - Xóa nhân viên
POST   /api/admin/employees/assign-field       - Phân công sân
```

### 6.3 Manager APIs (`/api/manager`)

**Dashboard**
```
GET    /api/manager/dashboard/stats            - Thống kê dashboard
GET    /api/manager/dashboard/revenue          - Doanh thu
GET    /api/manager/dashboard/monthly-revenue  - Doanh thu tháng
```

**Booking Management**
```
GET    /api/manager/bookings                   - Danh sách bookings
GET    /api/manager/bookings/:id               - Chi tiết booking
PUT    /api/manager/bookings/:id/approve       - Duyệt booking
PUT    /api/manager/bookings/:id/reject        - Từ chối booking
PUT    /api/manager/bookings/:id/complete      - Hoàn thành booking
PUT    /api/manager/bookings/:id/cancel        - Hủy booking
```

**Field Management**
```
GET    /api/manager/fields                     - Danh sách sân quản lý
POST   /api/manager/fields                     - Tạo sân
GET    /api/manager/fields/:id                 - Chi tiết sân
PUT    /api/manager/fields/:id                 - Cập nhật sân
DELETE /api/manager/fields/:id                 - Xóa sân
PATCH  /api/manager/fields/:id/status          - Cập nhật trạng thái
GET    /api/manager/fields/:id/stats           - Thống kê sân
```

**Payment**
```
GET    /api/manager/payments                   - Xem payments
```

### 6.4 User APIs (`/api/user`)

**Fields**
```
GET    /api/user/fields                        - Danh sách sân
GET    /api/user/fields/:id                    - Chi tiết sân
GET    /api/user/fields/:id/bookings           - Lịch đặt của sân
```

**Bookings**
```
GET    /api/user/bookings/history              - Lịch sử đặt sân
POST   /api/user/bookings                      - Tạo booking [Auth]
GET    /api/user/bookings/:id                  - Chi tiết booking
PUT    /api/user/bookings/:id                  - Cập nhật booking
```

**Reviews**
```
GET    /api/user/reviews                       - Danh sách reviews
POST   /api/user/reviews                       - Tạo review [Auth]
GET    /api/user/reviews/stats/:fieldId        - Thống kê review sân
POST   /api/user/reviews/upload                - Upload hình ảnh [Auth]
```

### 6.5 Chat APIs (`/api/chat`)

```
GET    /api/chat/managers                      - Danh sách managers
GET    /api/chat/list                          - Danh sách chats
POST   /api/chat/create                        - Tạo chat mới
GET    /api/chat/:chatId/messages              - Lấy tin nhắn
POST   /api/chat/:chatId/send                  - Gửi tin nhắn
```

### 6.6 AI APIs (`/api/ai`)

```
POST   /api/ai/chat                            - AI chat assistant
POST   /api/ai/recommend-fields                - Gợi ý sân phù hợp
GET    /api/ai/weather                         - Thông tin thời tiết
GET    /api/ai/suggest-timeslots/:fieldId      - Gợi ý khung giờ
POST   /api/ai/detect-fraud                    - Phát hiện gian lận [Auth]
```

### 6.7 Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

**Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

**Pagination Response**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 7. PHÂN QUYỀN NGƯỜI DÙNG

### 7.1 Role-Based Access Control (RBAC)

Hệ thống có 3 roles chính:

#### Admin (Quản trị viên)
- **Quyền cao nhất** trong hệ thống
- Quản lý toàn bộ users, fields, bookings
- Xem báo cáo toàn hệ thống
- Phân quyền và quản lý nhân viên

#### Manager (Quản lý sân)
- Quản lý các sân được phân công
- Duyệt/từ chối booking
- Xem doanh thu sân quản lý
- Chat với khách hàng

#### User (Khách hàng)
- Đặt sân bóng
- Xem lịch sử booking
- Đánh giá sân
- Chat với manager

### 7.2 Authentication Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT Access Token (15m expiry)
   ↓
4. Generate Refresh Token (7d expiry)
   ↓
5. Return tokens to client
   ↓
6. Client stores in localStorage/cookies
   ↓
7. Include token in Authorization header
   ↓
8. Server validates token on each request
```

### 7.3 Middleware Protection

**requireAuth** - Yêu cầu đăng nhập
```javascript
const requireAuth = (req, res, next) => {
  // Kiểm tra JWT token
  // Verify token validity
  // Attach user to request
}
```

**requireRole** - Kiểm tra role
```javascript
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Check if user.role in allowed roles
  }
}
```

**Usage Example**
```javascript
router.get('/admin/users', 
  requireAuth, 
  requireRole('admin'), 
  getAllUsers
);
```

---

## 8. TÍNH NĂNG NÂNG CAO

### 8.1 AI Integration (Google Generative AI)

**AI Chat Assistant**
- Trò chuyện tự nhiên với AI
- Tư vấn về sân bóng
- Trả lời câu hỏi thường gặp

**Field Recommendation**
- Phân tích preferences của user
- Gợi ý sân phù hợp dựa trên location, budget, rating
- Machine learning cho personalization

**Time Slot Suggestions**
- Phân tích booking patterns
- Đề xuất khung giờ tối ưu
- Tránh conflict scheduling

**Fraud Detection**
- Phát hiện booking bất thường
- Cảnh báo multiple bookings
- Pattern recognition

**Weather Integration**
- Real-time weather data
- Forecast cho ngày đặt sân
- Gợi ý dựa trên thời tiết

### 8.2 Real-time Chat System

**Features**
- 1-on-1 chat (User ↔ Manager)
- Message persistence
- Read status tracking
- Real-time updates
- Chat history

**Database Design**
```
chats (conversation container)
  ↓
messages (individual messages)
  ↓
Indexed by chat_id, sender_id, created_at
```

### 8.3 File Upload System

**Multer Configuration**
- Review images upload
- File size limits
- File type validation (images only)
- Auto-generate unique filenames
- Organized storage structure

**Storage**
```
public/uploads/
  └── reviews/
      └── {userId}_{timestamp}_{originalname}
```

### 8.4 Email System (Nodemailer)

**Password Reset Flow**
1. User requests password reset
2. Generate 6-digit OTP
3. Send email với OTP
4. OTP expires sau 10 phút
5. User verify OTP
6. Allow password reset
7. Cleanup expired tokens

**Email Templates**
- Password reset OTP
- Welcome email (optional)
- Booking confirmation (optional)

### 8.5 Revenue Tracking

**Automatic Aggregation**
- Daily revenue calculation
- Weekly revenue rollup
- Monthly revenue summary
- Per-field breakdown

**Analytics**
- Revenue trends
- Booking patterns
- Popular time slots
- Field performance comparison

---

## 9. BẢO MẬT

### 9.1 Password Security

**Hashing**
- bcryptjs với salt rounds = 10
- Auto-hash trước khi lưu database
- Never store plain-text passwords

**Password Requirements**
- Minimum 6 characters
- Stored in VARCHAR(255) for hashed value

### 9.2 JWT Security

**Access Token**
- Expiry: 15 minutes
- Contains: userId, username, role
- Signed with JWT_SECRET

**Refresh Token**
- Expiry: 7 days
- Used to renew access tokens
- Stored client-side

**Best Practices**
- Use HTTPS in production
- Secure token storage
- Token rotation
- Logout invalidation

### 9.3 Input Validation

- SQL Injection prevention (Sequelize ORM)
- XSS protection
- CORS configuration
- Request rate limiting (recommended)
- File upload validation

### 9.4 Database Security

**Indexes**
- Optimized queries
- Fast lookups on email, username

**Foreign Keys**
- Referential integrity
- CASCADE deletes where appropriate
- Prevent orphaned records

**Constraints**
- UNIQUE constraints on email, username
- NOT NULL on critical fields
- DEFAULT values

---

## 10. HƯỚNG DẪN CÀI ĐẶT

### 10.1 Yêu cầu hệ thống

- **Node.js**: 16.x hoặc cao hơn
- **PostgreSQL**: 13.x hoặc MySQL 8.x
- **npm**: 8.x hoặc cao hơn
- **Git**: Latest version

### 10.2 Backend Setup

**1. Clone repository**
```bash
git clone <repository-url>
cd INT_3306_1/backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Environment Variables**

Tạo file `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=football_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AI
GOOGLE_AI_API_KEY=your-google-ai-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**4. Database Setup**

**PostgreSQL:**
```sql
CREATE DATABASE football_management;
```

**MySQL:**
```sql
CREATE DATABASE football_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**5. Run Migrations**
```bash
npm run db:migrate
```

**6. Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:5000`

### 10.3 Frontend Setup

**1. Navigate to frontend**
```bash
cd ../frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Environment Variables**

Tạo file `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**4. Start Development Server**
```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

**5. Build for Production**
```bash
npm run build
```

### 10.4 Database Migration Commands

```bash
# Run all migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Reset database (undo all + migrate)
npm run db:migrate:reset

# Check migration status
npm run db:migrate:status
```

### 10.5 Create Admin Account

Có 2 cách:

**Cách 1: Qua API**
```bash
POST /api/auth/register
{
  "person_name": "Administrator",
  "username": "admin",
  "password": "admin123",
  "email": "admin@example.com",
  "role": "admin"
}
```

**Cách 2: Script (nếu có)**
```bash
npm run create-admin
```

### 10.6 Testing API

**Health Check**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/health
```

**Login Test**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 11. TRIỂN KHAI (DEPLOYMENT)

### 11.1 Production Checklist

**Backend**
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT secrets
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Configure CORS properly
- [ ] Set up process manager (PM2)
- [ ] Enable rate limiting
- [ ] Set up monitoring

**Frontend**
- [ ] Update VITE_API_URL to production
- [ ] Build optimized bundle
- [ ] Configure CDN (optional)
- [ ] Set up analytics (optional)
- [ ] Enable service workers (PWA)

### 11.2 Database Backup

```bash
# PostgreSQL backup
pg_dump football_management > backup.sql

# PostgreSQL restore
psql football_management < backup.sql

# MySQL backup
mysqldump -u root -p football_management > backup.sql

# MySQL restore
mysql -u root -p football_management < backup.sql
```

### 11.3 Recommended Hosting

**Backend**
- Heroku
- DigitalOcean
- AWS EC2
- Google Cloud Platform
- Railway

**Frontend**
- Vercel
- Netlify
- Firebase Hosting
- Cloudflare Pages

**Database**
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- AWS RDS
- Google Cloud SQL

---

## 12. BẢO TRÌ & MỞ RỘNG

### 12.1 Future Enhancements

**Planned Features**
- [ ] Payment gateway integration (VNPay, Momo)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Social login (Google, Facebook)
- [ ] Advanced analytics dashboard
- [ ] Automated email notifications
- [ ] Loyalty program
- [ ] Discount & promotion system
- [ ] Multi-language support
- [ ] Dark mode

### 12.2 Performance Optimization

**Database**
- Add more indexes
- Query optimization
- Connection pooling
- Caching (Redis)

**Backend**
- Response compression
- API rate limiting
- Load balancing
- CDN for static files

**Frontend**
- Code splitting
- Lazy loading
- Image optimization
- Service workers

---

## 13. TROUBLESHOOTING

### 13.1 Common Issues

**Database Connection Failed**
```
- Check .env credentials
- Verify database is running
- Check firewall settings
- Verify network connectivity
```

**Migration Errors**
```bash
# Reset and re-run
npm run db:migrate:reset
```

**Port Already in Use**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**CORS Errors**
```javascript
// Update CORS configuration in backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 13.2 Logs & Debugging

**Backend Logs**
- Morgan logs HTTP requests
- Console.log for debugging
- Error stack traces

**Database Queries**
```javascript
// Enable Sequelize logging
logging: console.log
```

---

## 14. LIÊN HỆ & HỖ TRỢ

### 14.1 Development Team

- **Project**: Football Field Management System
- **Version**: 0.1.0
- **License**: Private

### 14.2 Documentation

- **API Documentation**: Postman Collection
- **Database Schema**: `Database/database_schema.sql`
- **Setup Guide**: `backend/SETUP.md`
- **Auth Guide**: `backend/AUTH_GUIDE.md`

---

## 15. APPENDIX

### 15.1 Environment Variables Reference

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=football_management
DB_USER=postgres
DB_PASSWORD=
DB_DIALECT=postgres

# JWT
JWT_SECRET=
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# AI
GOOGLE_AI_API_KEY=

# Frontend
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 15.2 Scripts Reference

**Backend**
```json
{
  "dev": "node src/server.js",
  "start": "node src/server.js",
  "db:migrate": "sequelize-cli db:migrate",
  "db:migrate:undo": "sequelize-cli db:migrate:undo",
  "db:migrate:reset": "sequelize-cli db:migrate:undo:all && sequelize-cli db:migrate"
}
```

**Frontend**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 📝 CHANGELOG

### Version 0.1.0 (Current)
- ✅ Initial system setup
- ✅ User authentication & authorization
- ✅ Field management system
- ✅ Booking system
- ✅ Payment tracking
- ✅ Review system
- ✅ Chat functionality
- ✅ AI integration
- ✅ Revenue analytics
- ✅ Admin dashboard
- ✅ Manager dashboard
- ✅ User interface

---

## 🎯 KẾT LUẬN

Hệ thống quản lý sân bóng là một giải pháp toàn diện, hiện đại với đầy đủ các tính năng cần thiết cho việc quản lý và vận hành sân bóng đá. Hệ thống được xây dựng với kiến trúc rõ ràng, dễ bảo trì và mở rộng, tích hợp AI và các công nghệ tiên tiến.

**Điểm mạnh:**
- ✅ Kiến trúc phân tách rõ ràng (Frontend/Backend)
- ✅ Bảo mật tốt (JWT, bcrypt, CORS)
- ✅ Phân quyền chi tiết (Admin/Manager/User)
- ✅ Tích hợp AI thông minh
- ✅ Giao diện thân thiện
- ✅ Dễ triển khai và mở rộng

**Công nghệ hiện đại:**
- React + Vite (Frontend nhanh)
- Express + Sequelize (Backend mạnh mẽ)
- PostgreSQL (Database tin cậy)
- Google AI (Tính năng thông minh)

Hệ thống sẵn sàng cho việc triển khai thực tế và có thể mở rộng thêm nhiều tính năng trong tương lai.

---

**Document Version**: 1.0  
**Last Updated**: December 29, 2025  
**Author**: Development Team  
**Status**: Complete & Ready for Presentation

---
