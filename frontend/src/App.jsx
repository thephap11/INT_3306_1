import React, { useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RoleSwitcher from './components/RoleSwitcher.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import AIChatbot from './components/AIChatbot.jsx'
import UserHomePage from './pages/user/UserHomePage.jsx'
import FieldsPage from './pages/user/FieldsPage.jsx'
import FieldDetailPage from './pages/user/FieldDetailPage.jsx'
import BookingPage from './pages/user/BookingPage.jsx'
import BookingPaymentPage from './pages/user/BookingPaymentPage.jsx'
import BookingHistoryPage from './pages/user/BookingHistoryPage.jsx'
import LoginPage from './pages/user/LoginPage.jsx'
import RegisterPage from './pages/user/RegisterPage.jsx'
import ForgotPasswordPage from './pages/user/ForgotPasswordPage.jsx'
import BookingStatusPage from './pages/user/BookingStatusPage.jsx'
import PolicyPage from './pages/user/PolicyPage.jsx'
import ContactPage from './pages/user/ContactPage.jsx'

// Manager imports
import ManagerLayout from './pages/manager/ManagerLayout.jsx'
import ManagerDashboardPage from './pages/manager/DashboardPage.jsx'
import ManagerBookingsPage from './pages/manager/BookingsManagementPage.jsx'
import ManagerFieldsPage from './pages/manager/FieldsManagementPage.jsx'

// Admin imports
import AdminLayout from './pages/admin/AdminLayout.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import FieldManagementPage from './pages/admin/FieldManagementPage.jsx'
import UserManagementPage from './pages/admin/UserManagementPage.jsx'
import EmployeeManagementPage from './pages/admin/EmployeeManagementPage.jsx'
import BookingManagementPage from './pages/admin/BookingManagementPage.jsx'

export const ChatWidgetContext = React.createContext(null);

function App() {
  const chatWidgetRef = useRef();

  return (
    <>
      <Router>
        <ChatWidgetContext.Provider value={chatWidgetRef}>
          <RoleSwitcher />
          <ChatWidget ref={chatWidgetRef} />
          <AIChatbot />
          <Routes>
          {/* User routes */}
          <Route path="/" element={<UserHomePage />} />
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/user/fields" element={<FieldsPage />} />
        <Route path="/user/fields/:id" element={<FieldDetailPage />} />
        <Route path="/user/booking" element={<BookingPaymentPage />} />
        <Route path="/user/bookings" element={<BookingPage />} />
        <Route path="/user/booking-history" element={<BookingHistoryPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/register" element={<RegisterPage />} />
        <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/user/booking-status" element={<BookingStatusPage />} />
        <Route path="/user/policy" element={<PolicyPage />} />
        <Route path="/user/contact" element={<ContactPage />} />

          {/* Manager routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboardPage />} />
            <Route path="dashboard" element={<ManagerDashboardPage />} />
            <Route path="bookings" element={<ManagerBookingsPage />} />
            <Route path="fields" element={<ManagerFieldsPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="fields" element={<FieldManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="employees" element={<EmployeeManagementPage />} />
            <Route path="bookings" element={<BookingManagementPage />} />
          </Route>
        </Routes>
        </ChatWidgetContext.Provider>
      </Router>
    </>
  )
}

export default App