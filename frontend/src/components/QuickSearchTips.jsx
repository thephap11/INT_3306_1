import React from 'react'
import { useNavigate } from 'react-router-dom'
import './QuickSearchTips.css'

export default function QuickSearchTips() {
  const navigate = useNavigate()

  const quickSearches = [
    { icon: '📍', text: 'Sân gần tôi', query: '' },
    { icon: '⚽', text: 'Sân 5 người', category: '5v5' },
    { icon: '🏟️', text: 'Sân 7 người', category: '7v7' },
    { icon: '⭐', text: 'Sân 11 người', category: '11v11' },
    { icon: '💰', text: 'Giá rẻ', maxPrice: '300000' },
    { icon: '🌙', text: 'Mở cửa tối', query: '' },
  ]

  const handleQuickSearch = (item) => {
    const params = new URLSearchParams()
    
    if (item.query !== undefined && item.query) {
      params.append('q', item.query)
    }
    
    if (item.category) {
      params.append('category', item.category)
    }
    
    if (item.maxPrice) {
      params.append('maxPrice', item.maxPrice)
    }
    
    navigate(`/user/fields?${params.toString()}`)
  }

  return (
    <div className="quick-search-tips">
      <h3>Tìm kiếm nhanh</h3>
      <div className="quick-search-buttons">
        {quickSearches.map((item, index) => (
          <button
            key={index}
            className="quick-search-btn"
            onClick={() => handleQuickSearch(item)}
          >
            <span className="quick-icon">{item.icon}</span>
            <span className="quick-text">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
