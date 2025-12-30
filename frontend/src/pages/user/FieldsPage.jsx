import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './FieldsPage.css'
import ApiClient from '../../services/api';

export default function FieldsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9);
  const [allFields, setAllFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef(null);

  const fieldTypes = [
    { id: 'all', name: 'Tất cả sân', icon: '⚽', color: '#3b82f6' },
    { id: '5', name: 'Sân 5 người', icon: '5️⃣', color: '#10b981' },
    { id: '7', name: 'Sân 7 người', icon: '7️⃣', color: '#f59e0b' },
    { id: '11', name: 'Sân 11 người', icon: '🏟️', color: '#8b5cf6' },
  ];

  const facilityOptions = [
    { id: 'parking', name: 'Bãi đỗ xe', icon: '🚗' },
    { id: 'canteen', name: 'Căng tin', icon: '🍔' },
    { id: 'locker', name: 'Tủ đồ', icon: '🔒' },
    { id: 'shower', name: 'Phòng tắm', icon: '🚿' },
    { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
    { id: 'ac', name: 'Điều hòa', icon: '❄️' },
  ];

  useEffect(() => {
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    
    if (location) setSearchTerm(location);
    if (category) setSelectedType(category);
    if (maxPrice) setPriceRange([0, parseInt(maxPrice)]);
  }, [searchParams]);

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const fetchFields = useCallback(async (page = 1, searchQuery = '') => {
    const params = new URLSearchParams();
    // Only append search query if it's not empty after trimming
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      params.append('q', trimmedQuery);
    }
    params.append('limit', '100'); // Fetch more to handle client-side pagination
    params.append('page', '1');

    setLoading(true);
    try {
      const res = await ApiClient.get(`/user/fields?${params.toString()}`);
      const rows = Array.isArray(res) ? res : (res.data || []);
      setAllFields(rows);
      setError(null);
    } catch (err) {
      console.error('Failed to load fields', err);
      setError('Không thể tải danh sách sân bóng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchFields]);

  // Filter and sort
  useEffect(() => {
    if (allFields.length === 0) {
      setFilteredFields([]);
      setFields([]);
      setTotalPages(1);
      return;
    }

    let filtered = [...allFields];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(field => {
        const name = field.field_name || field.name || '';
        return name.toLowerCase().includes(selectedType);
      });
    }

    // Filter by price range
    filtered = filtered.filter(field => {
      const price = parseFloat(field.rental_price || field.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by facilities
    if (selectedFacilities.length > 0) {
      filtered = filtered.filter(field => {
        const fieldFacilities = field.facilities || [];
        return selectedFacilities.every(fac => 
          fieldFacilities.some(f => f.toLowerCase().includes(fac.toLowerCase()))
        );
      });
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.rental_price || a.price || 0);
        const priceB = parseFloat(b.rental_price || b.price || 0);
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.rental_price || a.price || 0);
        const priceB = parseFloat(b.rental_price || b.price || 0);
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredFields(filtered);
    
    // Calculate total pages based on filtered results
    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount || 1);
    
    // Reset to page 1 if current page exceeds total pages
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(1);
    }
  }, [allFields, selectedType, priceRange, selectedFacilities, sortBy, itemsPerPage, currentPage]);

  // Paginate filtered fields
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFields = filteredFields.slice(startIndex, endIndex);
    setFields(paginatedFields);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredFields, currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    // Immediately update debounced term to trigger search
    setDebouncedSearchTerm(searchTerm.trim());
  };

  const toggleFacility = (facilityId) => {
    setSelectedFacilities(prev =>
      prev.includes(facilityId)
        ? prev.filter(f => f !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleBookField = (field) => {
    const id = field.field_id || field.id;
    navigate(`/user/fields/${id}`);
  };

  const formatPrice = (price) => {
    if (!price || price === 'undefined' || price === 'null') return '200000';
    const priceStr = String(price).replace(/[^\d]/g, '');
    const numPrice = parseInt(priceStr);
    if (isNaN(numPrice) || numPrice === 0) return '200000';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numPrice);
  };

  return (
    <div className="modern-fields-page">
      <Navbar />

      {/* Hero Section */}
      <section className="modern-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>Đặt sân nhanh chóng & tiện lợi</span>
          </div>
          <h1 className="hero-title">
            Tìm Sân Bóng <span className="highlight">Hoàn Hảo</span>
          </h1>
          <p className="hero-subtitle">
            Hơn 100+ sân bóng chất lượng cao trên toàn quốc, sẵn sàng phục vụ bạn
          </p>

          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-box">
              <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm sân bóng theo tên, địa điểm... (không phân biệt hoa thường)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchTerm && (
                  <button 
                    className="clear-search-btn" 
                    onClick={() => {
                      setSearchTerm('');
                      setDebouncedSearchTerm('');
                    }}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </button>
                )}
              </div>
              <button className="search-button" onClick={handleSearch}>
                <span>Tìm kiếm</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            {/* Quick Filters */}
            <div className="quick-filters">
              {fieldTypes.map(type => (
                <button
                  key={type.id}
                  className={`quick-filter-btn ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                  style={selectedType === type.id ? { borderColor: type.color, background: `${type.color}15` } : {}}
                >
                  <span className="filter-icon">{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="modern-container">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <h2 className="results-title">
              <span className="results-count">{filteredFields.length}</span> sân bóng được tìm thấy
            </h2>
          </div>

          <div className="toolbar-right">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Dạng lưới"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Dạng danh sách"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Sort */}
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Đề xuất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-low">Giá: Thấp đến cao</option>
              <option value="price-high">Giá: Cao đến thấp</option>
            </select>

            {/* Filter Toggle */}
            <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <span>Bộ lọc</span>
              {(selectedFacilities.length > 0 || priceRange[1] !== 2000000) && (
                <span className="filter-badge">{selectedFacilities.length + (priceRange[1] !== 2000000 ? 1 : 0)}</span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-section">
              <h3 className="filter-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Khoảng giá
              </h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>0đ</span>
                  <span className="price-value">{formatPrice(priceRange[1])}</span>
                  <span>2.000.000đ</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Tiện ích
              </h3>
              <div className="facilities-grid">
                {facilityOptions.map(facility => (
                  <button
                    key={facility.id}
                    className={`facility-btn ${selectedFacilities.includes(facility.id) ? 'active' : ''}`}
                    onClick={() => toggleFacility(facility.id)}
                  >
                    <span className="facility-icon">{facility.icon}</span>
                    <span>{facility.name}</span>
                    {selectedFacilities.includes(facility.id) && (
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button className="clear-filters-btn" onClick={() => {
              setSelectedFacilities([]);
              setPriceRange([0, 2000000]);
              setSelectedType('all');
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Fields Grid/List */}
        {!loading && !error && (
          <div className={`fields-layout ${viewMode}`}>
            {fields.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Không tìm thấy sân bóng phù hợp</h3>
                <p>Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              fields.map(field => (
                <article key={field.field_id || field.id} className="field-card-modern">
                  <div className="card-image-wrapper">
                    <img
                      src={field.image || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=800&q=80'}
                      alt={field.field_name || field.name}
                      className="card-image"
                    />
                    <div className="image-overlay">
                      <button className="favorite-btn-modern">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                      <div className="status-badge-modern">
                        <span className={`status-dot ${field.isOpen !== false ? 'open' : 'closed'}`}></span>
                        {field.isOpen !== false ? 'Đang mở cửa' : 'Đã đóng cửa'}
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{field.field_name || field.name}</h3>
                      {field.rating && (
                        <div className="rating-badge">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span>{field.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-details">
                      <div className="detail-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{field.location || 'Chưa cập nhật'}</span>
                      </div>
                      {field.openTime && (
                        <div className="detail-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>{field.openTime}</span>
                        </div>
                      )}
                    </div>

                    {field.facilities && field.facilities.length > 0 && (
                      <div className="facilities-tags">
                        {field.facilities.slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="facility-tag-modern">{facility}</span>
                        ))}
                        {field.facilities.length > 3 && (
                          <span className="more-tag">+{field.facilities.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="card-footer">
                      <div className="price-info">
                        <span className="price-label">Giá thuê</span>
                        <span className="price-amount">{formatPrice(field.rental_price || field.price)}</span>
                      </div>
                      <button className="book-btn-modern" onClick={() => handleBookField(field)}>
                        <span>Đặt sân ngay</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && fields.length > 0 && totalPages > 1 && (
          <div className="pagination-modern">
            <button
              className="pagination-btn-modern"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span>Trước</span>
            </button>

            <div className="pagination-numbers-modern">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn-modern"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Sau</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
