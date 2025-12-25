import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import './Navbar.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }
    
    checkAuth()
    
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
    window.dispatchEvent(new Event('userUpdated'));
    window.location.href = '/user/login'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo/logo.png" alt="DHP Logo" />
        </Link>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/user/fields">Danh sách sân bãi</Link></li>
          {user && <li><Link to="/user/booking-history">Lịch sử đặt sân</Link></li>}
          <li><Link to="/user/policy">Chính sách</Link></li>
          <li><Link to="/user/contact">Liên hệ</Link></li>
        </ul>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">Xin chào, {user.name || user.email}</span>
              <button onClick={handleLogout} className="navbar-btn logout-btn">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/user/login" className="navbar-btn login-btn">Đăng nhập</Link>
              <Link to="/user/register" className="navbar-btn register-btn">Đăng ký</Link>
            </>
          )}
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  )
}