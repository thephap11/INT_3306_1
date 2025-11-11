import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './FieldsPage.css'

import Hero from '../../components/Hero';
import ApiClient from '../../services/api';

export default function FieldsPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '⚽', count: fields.length },
    { id: '5v5', name: 'Sân 5 người', icon: '5', count: 12 },
    { id: '7v7', name: 'Sân 7 người', icon: '7', count: 24 },
    { id: '11v11', name: 'Sân 11 người', icon: '11', count: 4 },
  ];

  // Build and run fetch using current filters/search
  const fetchWithQuery = async (opts = {}) => {
    const q = opts.q ?? searchTerm;
    const limit = opts.limit ?? 50;
    const page = opts.page ?? 1;
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    params.append('limit', String(limit));
    params.append('page', String(page));

    setLoading(true);
    try {
      const res = await ApiClient.get(`/user/fields?${params.toString()}`);
      const rows = Array.isArray(res) ? res : (res.data || []);
      setFields(rows);
      setError(null);
    } catch (err) {
      console.error('Failed to load fields', err);
      setError('Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    fetchWithQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookNow = (field) => {
    const id = field.field_id || field.id;
    navigate(`/user/fields/${id}`);
  }

  return (
    <div className="fields-page">
      <Navbar />

      <Hero title="Fields" subtitle="Find the perfect pitch for your match" />

      <div className="fields-hero">
        <div className="fields-hero-content">
          <h1>Tìm sân bóng phù hợp với bạn</h1>
          <p>Hàng chục sân bóng phủ sóng khắp thành phố — tìm, so sánh và đặt ngay.</p>

          <div className="fields-search-bar">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sân, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchWithQuery(); }}
              />
            </div>

            <select
              className="filter-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Tất cả giá</option>
              <option value="low">Dưới 500k</option>
              <option value="medium">500k - 1tr</option>
              <option value="high">Trên 1tr</option>
            </select>

            <button className="search-btn" onClick={() => fetchWithQuery()}>Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="fields-container">
        <aside className="fields-sidebar">
          <div className="sidebar-section">
            <h3>Loại sân</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(category.id); fetchWithQuery(); }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Tiện ích</h3>
            <div className="facilities-filter">
              <label className="facility-checkbox"><input type="checkbox" /> <span>Bãi đỗ xe</span></label>
              <label className="facility-checkbox"><input type="checkbox" /> <span>Căng tin</span></label>
              <label className="facility-checkbox"><input type="checkbox" /> <span>Phòng thay đồ</span></label>
            </div>
          </div>
        </aside>

        <main className="fields-main">
          <div className="fields-header">
            <div className="results-info">
              <h2>Danh sách sân bóng</h2>
              <p>Tìm thấy {fields.length} sân bóng</p>
            </div>

            <div className="fields-controls">
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="distance">Khoảng cách</option>
              </select>
            </div>
          </div>

          {loading && <p>Loading fields…</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="fields-grid">
              {fields.length === 0 && <p>No fields found.</p>}
              {fields.map(field => (
                <div key={field.field_id || field.id} className={`field-card ${field.featured ? 'featured' : ''}`}>
                  <div className="field-image">
                    <img src={field.image || 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=60'} alt={field.field_name || field.name} />
                    <div className="field-status"><span className={`status-badge ${field.isOpen ? 'open' : 'closed'}`}>{field.isOpen ? '● Đang mở cửa' : '● Đã đóng cửa'}</span></div>
                    <button className="favorite-btn">♡</button>
                  </div>

                  <div className="field-content">
                    <div className="field-header-info">
                      <h3>{field.field_name || field.name}</h3>
                      <div className="field-rating"><span className="rating-score">⭐ {field.rating}</span><span className="rating-count">({field.reviews})</span></div>
                    </div>

                    <div className="field-meta">
                      <div className="meta-item"><span className="meta-icon">📍</span><span>{field.location}</span></div>
                      {field.openTime && <div className="meta-item"><span className="meta-icon">⏰</span><span>{field.openTime}</span></div>}
                    </div>

                    <div className="field-facilities">
                      {(field.facilities || []).slice(0,3).map((f, i) => <span key={i} className="facility-tag">{f}</span>)}
                    </div>

                    <div className="field-footer">
                      <div className="field-price"><span className="price-value">{field.price || 'Liên hệ'}</span></div>
                      <button className="btn-book" onClick={() => handleBookNow(field)}>Đặt sân ngay →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
 