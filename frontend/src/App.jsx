import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserHomePage from './pages/user/UserHomePage.jsx'
import FieldsPage from './pages/user/FieldsPage.jsx'
import FieldDetailPage from './pages/user/FieldDetailPage.jsx'
import BookingPage from './pages/user/BookingPage.jsx'
import LoginPage from './pages/user/LoginPage.jsx'
import RegisterPage from './pages/user/RegisterPage.jsx'
import ForgotPasswordPage from './pages/user/ForgotPasswordPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserHomePage />} />
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/user/fields" element={<FieldsPage />} />
        <Route path="/user/fields/:id" element={<FieldDetailPage />} />
        <Route path="/user/booking" element={<BookingPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/register" element={<RegisterPage />} />
        <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  )
}

export default App