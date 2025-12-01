import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import './ReviewPage.css'

export default function ReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const fieldIdFromUrl = searchParams.get('fieldId')

  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(fieldIdFromUrl || '')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Filter state
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchFields()
  }, [])

  useEffect(() => {
    if (selectedField) {
      fetchReviews(selectedField)
      setSearchParams({ fieldId: selectedField })
    }
  }, [selectedField])

  const fetchFields = async () => {
    try {
      const res = await ApiClient.get('/user/fields?limit=100')
      setFields(res)
      if (fieldIdFromUrl && res.length > 0) {
        setSelectedField(fieldIdFromUrl)
      }
    } catch (err) {
      console.error('Failed to fetch fields:', err)
    }
  }

  const fetchReviews = async (fieldId) => {
    setLoading(true)
    try {
      const res = await ApiClient.get(`/user/reviews?field_id=${fieldId}`)
      setReviews(res || [])
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      alert('Tối đa 5 hình ảnh')
      return
    }

    setImages([...images, ...files])
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
    
    // Revoke URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra đăng nhập
    if (!authAPI.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để gửi đánh giá. Chuyển đến trang đăng nhập?')) {
        navigate('/user/login')
      }
      return
    }

    if (!selectedField) {
      alert('Vui lòng chọn sân cần đánh giá')
      return
    }

    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá')
      return
    }

    if (!comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá')
      return
    }

    setSubmitting(true)

    try {
      let imageUrls = []
      
      // Upload images first if any
      if (images.length > 0) {
        const formData = new FormData()
        images.forEach(image => {
          formData.append('images', image)
        })
        
        const token = localStorage.getItem('token')
        const uploadRes = await fetch('http://localhost:5000/api/user/reviews/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload images')
        }
        
        const uploadData = await uploadRes.json()
        imageUrls = uploadData.images || []
      }
      
      // Get current user info
      const currentUser = authAPI.getCurrentUser()
      
      // Create review with image URLs
      const reviewData = {
        field_id: Number(selectedField),
        customer_id: currentUser?.person_id || 1,
        rating,
        comment: comment.trim(),
        images: imageUrls
      }

      await ApiClient.post('/user/reviews', reviewData)
      
      // Reset form
      setRating(0)
      setComment('')
      setImages([])
      setImagePreviews([])
      
      // Refresh reviews
      fetchReviews(selectedField)
      
      alert('Đánh giá của bạn đã được gửi thành công!')
    } catch (err) {
      console.error('Failed to submit review:', err)
      alert('Không thể gửi đánh giá: ' + (err.message || 'Vui lòng thử lại'))
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReviews = reviews
    .filter(r => filterRating === 'all' || r.rating === Number(filterRating))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at || b.review_date) - new Date(a.created_at || a.review_date)
      if (sortBy === 'oldest') return new Date(a.created_at || a.review_date) - new Date(b.created_at || b.review_date)
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      return 0
    })

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length * 100).toFixed(0) : 0
  }))

  return (
    <div className="review-page">
      <Navbar />
      
      <div className="review-container">
        <div className="review-header">
          <h1>Đánh giá sân bóng</h1>
          <p>Chia sẻ trải nghiệm của bạn để giúp người khác lựa chọn sân phù hợp</p>
        </div>

        <div className="review-content">
          {/* Left: Write Review Form */}
          <div className="review-form-section">
            <div className="form-card">
              <h2>✍️ Viết đánh giá</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Select Field */}
                <div className="form-group">
                  <label htmlFor="field-select">Chọn sân bóng *</label>
                  <select
                    id="field-select"
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn sân --</option>
                    {fields.map(field => (
                      <option key={field.field_id} value={field.field_id}>
                        {field.field_name} - {field.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div className="form-group">
                  <label>Đánh giá của bạn *</label>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        title={`${star} sao`}
                      >
                        ⭐
                      </button>
                    ))}
                    <span className="rating-text">
                      {rating > 0 ? `${rating} sao` : 'Chọn số sao'}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="form-group">
                  <label htmlFor="comment">Nhận xét của bạn *</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về chất lượng sân, dịch vụ, giá cả, tiện nghi..."
                    rows="5"
                    required
                  />
                  <small>{comment.length}/500 ký tự</small>
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label>Hình ảnh (Tối đa 5 ảnh)</label>
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload" className="upload-btn">
                      📷 Thêm hình ảnh
                    </label>
                    
                    {imagePreviews.length > 0 && (
                      <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                              title="Xóa ảnh"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-submit-review" disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="reviews-list-section">
            {selectedField ? (
              <>
                {/* Statistics */}
                <div className="reviews-stats-card">
                  <h3>Thống kê đánh giá</h3>
                  <div className="stats-overview">
                    <div className="average-rating">
                      <div className="rating-number">{averageRating}</div>
                      <div className="rating-stars">{'⭐'.repeat(Math.round(averageRating))}</div>
                      <div className="total-reviews">{reviews.length} đánh giá</div>
                    </div>
                    <div className="rating-breakdown">
                      {ratingDistribution.map(item => (
                        <div key={item.star} className="breakdown-row">
                          <span className="star-label">{item.star} ⭐</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="percentage">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="reviews-filters">
                  <div className="filter-group">
                    <label>Lọc theo:</label>
                    <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                      <option value="all">Tất cả</option>
                      <option value="5">5 sao</option>
                      <option value="4">4 sao</option>
                      <option value="3">3 sao</option>
                      <option value="2">2 sao</option>
                      <option value="1">1 sao</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Sắp xếp:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="highest">Điểm cao nhất</option>
                      <option value="lowest">Điểm thấp nhất</option>
                    </select>
                  </div>
                </div>

                {/* Reviews */}
                <div className="reviews-list">
                  {loading ? (
                    <div className="loading">Đang tải đánh giá...</div>
                  ) : filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                      <div key={review.review_id || review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.customer_name?.charAt(0) || review.person_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="reviewer-name">
                                {review.customer_name || review.person_name || 'Anonymous'}
                              </div>
                              <div className="review-date">
                                {review.created_at 
                                  ? new Date(review.created_at).toLocaleDateString('vi-VN')
                                  : review.review_date
                                    ? new Date(review.review_date).toLocaleDateString('vi-VN')
                                    : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                        <div className="review-comment">
                          {review.comment}
                        </div>
                        {review.images && review.images.length > 0 && (
                          <div className="review-images">
                            {review.images.map((img, idx) => (
                              <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>Chưa có đánh giá nào cho sân này.</p>
                      <p>Hãy là người đầu tiên đánh giá! 🌟</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="select-field-prompt">
                <div className="prompt-icon">🏟️</div>
                <h3>Chọn sân để xem đánh giá</h3>
                <p>Vui lòng chọn sân bóng ở bên trái để xem các đánh giá</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}