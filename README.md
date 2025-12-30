# ⚽ Football Field Management System

> Hệ thống quản lý sân bóng đá toàn diện với giao diện web hiện đại

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Demo: https://dhpfootball.vercel.app/

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Sử dụng](#-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)

## 🎯 Giới thiệu

Hệ thống quản lý sân bóng là ứng dụng web full-stack cho phép:

- 🏟️ **Quản lý sân bóng**: Tạo, chỉnh sửa, và quản lý nhiều sân bóng
- 📅 **Đặt lịch online**: Đặt sân trực tuyến với lịch trình linh hoạt
- 💰 **Thanh toán tích hợp**: Xử lý thanh toán và theo dõi doanh thu
- ⭐ **Đánh giá & Review**: Khách hàng có thể đánh giá và nhận xét
- 💬 **Chat trực tiếp**: Giao tiếp giữa khách hàng và quản lý sân
- 🤖 **AI Assistant**: Hỗ trợ thông minh và phát hiện gian lận
- 📊 **Báo cáo thống kê**: Dashboard với biểu đồ doanh thu chi tiết
- 👥 **Quản lý phân quyền**: Hệ thống 3 cấp quyền (Admin/Manager/User)

## ✨ Tính năng

### Dành cho Admin
- ✅ Quản lý toàn bộ hệ thống
- ✅ Quản lý managers và phân quyền
- ✅ Xem báo cáo doanh thu tổng thể
- ✅ Quản lý tất cả sân bóng và booking
- ✅ Thống kê và phân tích hệ thống

### Dành cho Manager
- ✅ Quản lý sân bóng được giao
- ✅ Tạo và cập nhật lịch trình sân
- ✅ Xác nhận/từ chối booking
- ✅ Xem doanh thu theo sân
- ✅ Chat với khách hàng
- ✅ Quản lý review và phản hồi

### Dành cho User (Khách hàng)
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Tìm kiếm sân bóng
- ✅ Xem lịch trống và đặt sân
- ✅ Thanh toán online
- ✅ Lịch sử booking
- ✅ Đánh giá và review sân
- ✅ Chat với quản lý sân
- ✅ AI Assistant hỗ trợ

## 🛠 Công nghệ

### Frontend
- **React** 18.2.0 - Thư viện UI
- **Vite** 4.4.11 - Build tool & dev server
- **React Router** 6.16.0 - Routing
- **Axios** - HTTP client
- **Recharts** - Biểu đồ và thống kê
- **React Hot Toast** - Notifications
- **Vitest** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.21.2 - Web framework
- **Sequelize** 6.35.2 - ORM
- **PostgreSQL/MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Google Generative AI** - AI features
- **Jest** - Testing framework

### DevOps & Tools
- **Sequelize CLI** - Database migrations
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16.x
- PostgreSQL >= 13.x hoặc MySQL >= 8.x
- npm hoặc yarn
- Git

### Clone repository

```bash
git clone <repository-url>
cd INT_3306_1
```

### Cài đặt Backend

```bash
cd backend
npm install
```

### Cài đặt Frontend

```bash
cd frontend
npm install
```

## ⚙️ Cấu hình

### 1. Cấu hình Database

**Tạo database:**

```sql
CREATE DATABASE football_management;
```

### 2. Cấu hình Backend

Tạo file `.env` từ template:

```bash
cd backend
copy .env.example .env  # Windows
# hoặc
cp .env.example .env    # Linux/Mac
```



### 3. Cấu hình Frontend

```bash
cd frontend
copy .env.example .env  # Windows
```

Cập nhật `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Chạy Migrations

```bash
cd backend
npm run db:migrate
```

### 5. Tạo tài khoản Admin (optional)

```bash
npm run create-admin
```

## 🎮 Sử dụng


Server chạy tại: `https://dhpfootball.vercel.app/`


### Build Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Cấu trúc dự án

```
INT_3306_1/
├── backend/                    # Backend Express.js
│   ├── config/                # Database config
│   ├── database/              # SQL schemas
│   ├── src/
│   │   ├── config/           # App configuration
│   │   ├── controllers/      # Route controllers
│   │   │   ├── admin/        # Admin controllers
│   │   │   ├── manager/      # Manager controllers
│   │   │   └── user/         # User controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utilities
│   │   └── migrations/       # Database migrations
│   ├── __tests__/            # Test files
│   ├── uploads/              # Uploaded files
│   └── package.json
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── api/              # API services
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # Frontend services
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
│
├── Database/                   # Database schemas
│   ├── database_schema.sql   # Main schema
│   └── insert_sample_data.sql
│
├── docs/                       # Documentation
│   └── database-design.sql
│
├── README.md                   # Tài liệu này
└── SYSTEM_DOCUMENTATION.md     # Tài liệu chi tiết hệ thống
```

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

### Fields (Sân bóng)
- `GET /api/fields` - Lấy danh sách sân
- `GET /api/fields/:id` - Chi tiết sân
- `POST /api/fields` - Tạo sân mới (Manager/Admin)
- `PUT /api/fields/:id` - Cập nhật sân (Manager/Admin)
- `DELETE /api/fields/:id` - Xóa sân (Admin)

### Bookings
- `GET /api/bookings` - Lịch sử booking
- `POST /api/bookings` - Tạo booking mới
- `PUT /api/bookings/:id` - Cập nhật booking
- `DELETE /api/bookings/:id` - Hủy booking

### Reviews
- `GET /api/reviews/:fieldId` - Lấy reviews của sân
- `POST /api/reviews` - Tạo review mới
- `PUT /api/reviews/:id` - Cập nhật review
- `DELETE /api/reviews/:id` - Xóa review

### Chat
- `GET /api/chat/conversations` - Lấy danh sách chat
- `GET /api/chat/:conversationId/messages` - Lấy tin nhắn
- `POST /api/chat/messages` - Gửi tin nhắn

### Admin
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/revenue` - Báo cáo doanh thu
- `POST /api/admin/managers` - Tạo manager

Xem chi tiết tại: [SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Chạy tất cả tests
npm test

# Chạy unit tests
npm run test:unit

# Chạy integration tests
npm run test:integration

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Chạy tests
npm test

# Test với UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 📊 Database Schema

Hệ thống sử dụng các bảng chính:

- **person** - Người dùng (customers, managers, admins)
- **fields** - Sân bóng
- **field_schedules** - Lịch trình sân
- **bookings** - Đặt sân
- **payments** - Thanh toán
- **reviews** - Đánh giá
- **chats** - Tin nhắn
- **revenue_daily/weekly/monthly** - Thống kê doanh thu

Xem schema chi tiết: [database_schema.sql](./Database/database_schema.sql)

## 🔐 Bảo mật

- ✅ JWT Authentication với refresh tokens
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ SQL injection protection (Sequelize ORM)
- ✅ XSS protection

## 📚 Tài liệu bổ sung

- [SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md) - Tài liệu chi tiết hệ thống
- [backend/SETUP.md](./backend/SETUP.md) - Hướng dẫn setup backend
- [backend/AUTH_GUIDE.md](./backend/AUTH_GUIDE.md) - Hướng dẫn authentication
- [QUICKSTART_AUTH.md](./QUICKSTART_AUTH.md) - Quick start guide

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developers**: DHP Team
- **Course**: INT3306
- **Year**: 2024-2025

---

⭐ Star us on GitHub — it helps!

Made with ❤️ by INT_3306_1 Team