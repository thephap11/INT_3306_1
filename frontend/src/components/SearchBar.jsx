import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

export default function SearchBar() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [price, setPrice] = useState('')

  const handleSearch = () => {
    // Xây dựng URL với query params
    const params = new URLSearchParams()
    
    if (location.trim()) {
      params.append('location', location.trim())
    }
    
    if (fieldType) {
      params.append('category', fieldType)
    }
    
    if (price.trim()) {
      params.append('maxPrice', price.trim())
    }
    
    // Navigate sang trang fields với query params
    navigate(`/user/fields?${params.toString()}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo địa điểm (VD: Hà Nội, TP.HCM...)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      <select
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value)}
        className="search-select"
      >
        <option value="">Tất cả loại sân</option>
        <option value="5v5">Sân 5 người</option>
        <option value="7v7">Sân 7 người</option>
        <option value="11v11">Sân 11 người</option>
      </select>
      <input
        type="number"
        placeholder="Giá tối đa (VNĐ)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
        min="0"
      />
      <button onClick={handleSearch} className="search-button">
        🔍 Tìm kiếm
      </button>
    </div>
  )
}