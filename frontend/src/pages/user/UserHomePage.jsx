import React from 'react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import QuickSearchTips from '../../components/QuickSearchTips.jsx'
import FeatureCards from '../../components/FeatureCards.jsx'
import './UserHomePage.css'

export default function UserHomePage() {
  return (
    <div className="user-home">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>HỆ THỐNG HỖ TRỢ TÌM KIẾM SÂN BÃI NHANH</h1>
          <p>Dịch vụ đa dạng, DHPoT247 của chúng tôi luôn sẵn sàng đáp ứng nhu cầu đặt sân nhanh chóng</p>
          <SearchBar />
          <QuickSearchTips />
        </div>
      </section>

      <section className="features-section">
        <FeatureCards />
      </section>

      <Footer />
    </div>
  )
}