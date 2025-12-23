import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './AIChatbot.css';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat, recommend, weather
  const messagesEndRef = useRef(null);

  // Form states for recommendations
  const [preferences, setPreferences] = useState({
    location: '',
    budget: '',
    time: '',
    playerCount: ''
  });

  // Weather form
  const [weatherDate, setWeatherDate] = useState('');
  const [weatherLocation, setWeatherLocation] = useState('Hanoi,VN');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        message: m.content
      }));

      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory
      });

      if (response.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          content: response.message,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    if (!preferences.location && !preferences.budget && !preferences.time) {
      alert('Vui lòng nhập ít nhất một tiêu chí');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/ai/recommend-fields', preferences);

      if (response.success) {
        setMessages([{
          id: Date.now(),
          role: 'ai',
          content: response.recommendation,
          timestamp: new Date()
        }]);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Recommendation Error:', error);
      alert('Không thể tạo gợi ý');
    } finally {
      setLoading(false);
    }
  };

  const getWeather = async () => {
    if (!weatherDate) {
      alert('Vui lòng chọn ngày');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/ai/weather?date=${weatherDate}&location=${weatherLocation}`);

      if (response.success) {
        setWeatherData(response.data);
      }
    } catch (error) {
      console.error('Weather Error:', error);
      alert('Không thể lấy dự báo thời tiết');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ai-chatbot">
      {/* Toggle Button */}
      <button 
        className="ai-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Trợ lý"
      >
        🤖
        <span className="ai-badge">AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chatbot-window">
          {/* Header */}
          <div className="ai-chatbot-header">
            <div className="ai-header-title">
              <span className="ai-icon">🤖</span>
              <div>
                <h3>AI Trợ Lý</h3>
                <p>Tư vấn sân bóng thông minh</p>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Tabs */}
          <div className="ai-tabs">
            <button
              className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat
            </button>
            <button
              className={`ai-tab ${activeTab === 'recommend' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommend')}
            >
              ⚽ Gợi ý sân
            </button>
            <button
              className={`ai-tab ${activeTab === 'weather' ? 'active' : ''}`}
              onClick={() => setActiveTab('weather')}
            >
              🌤️ Thời tiết
            </button>
          </div>

          {/* Content */}
          <div className="ai-chatbot-content">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <>
                <div className="ai-messages">
                  {messages.length === 0 && (
                    <div className="ai-welcome">
                      <h4>👋 Xin chào!</h4>
                      <p>Tôi là AI trợ lý. Tôi có thể giúp bạn:</p>
                      <ul>
                        <li>🔍 Tìm sân phù hợp</li>
                        <li>💰 Tư vấn giá và khung giờ</li>
                        <li>📅 Gợi ý thời gian đặt sân</li>
                        <li>❓ Giải đáp thắc mắc</li>
                      </ul>
                    </div>
                  )}

                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`ai-message ${msg.role === 'user' ? 'user' : 'ai'} ${msg.error ? 'error' : ''}`}
                    >
                      <div className="ai-message-content">
                        {msg.content}
                      </div>
                      <div className="ai-message-time">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="ai-message ai typing">
                      <div className="ai-message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form className="ai-input-form" onSubmit={sendMessage}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập câu hỏi..."
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading || !inputMessage.trim()}>
                    ➤
                  </button>
                </form>
              </>
            )}

            {/* Recommend Tab */}
            {activeTab === 'recommend' && (
              <div className="ai-recommend-form">
                <h4>🎯 Tìm sân phù hợp</h4>
                <p className="ai-form-desc">Điền thông tin để nhận gợi ý từ AI</p>

                <div className="ai-form-group">
                  <label>📍 Khu vực</label>
                  <input
                    type="text"
                    value={preferences.location}
                    onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                    placeholder="VD: Cầu Giấy, Hà Nội"
                  />
                </div>

                <div className="ai-form-group">
                  <label>💰 Ngân sách</label>
                  <input
                    type="text"
                    value={preferences.budget}
                    onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                    placeholder="VD: 500k-800k"
                  />
                </div>

                <div className="ai-form-group">
                  <label>⏰ Thời gian muốn chơi</label>
                  <input
                    type="text"
                    value={preferences.time}
                    onChange={(e) => setPreferences({...preferences, time: e.target.value})}
                    placeholder="VD: Tối thứ 7"
                  />
                </div>

                <div className="ai-form-group">
                  <label>👥 Số người chơi</label>
                  <input
                    type="text"
                    value={preferences.playerCount}
                    onChange={(e) => setPreferences({...preferences, playerCount: e.target.value})}
                    placeholder="VD: 7 người"
                  />
                </div>

                <button
                  className="ai-submit-btn"
                  onClick={getRecommendations}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang phân tích...' : '✨ Nhận gợi ý từ AI'}
                </button>
              </div>
            )}

            {/* Weather Tab */}
            {activeTab === 'weather' && (
              <div className="ai-weather-form">
                <h4>🌤️ Dự báo thời tiết</h4>
                <p className="ai-form-desc">Kiểm tra thời tiết cho ngày đặt sân</p>

                <div className="ai-form-group">
                  <label>📅 Ngày đặt sân</label>
                  <input
                    type="date"
                    value={weatherDate}
                    onChange={(e) => setWeatherDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="ai-form-group">
                  <label>📍 Khu vực</label>
                  <select
                    value={weatherLocation}
                    onChange={(e) => setWeatherLocation(e.target.value)}
                  >
                    <option value="Hanoi,VN">Hà Nội</option>
                    <option value="HoChiMinh,VN">TP. Hồ Chí Minh</option>
                    <option value="DaNang,VN">Đà Nẵng</option>
                  </select>
                </div>

                <button
                  className="ai-submit-btn"
                  onClick={getWeather}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang lấy dữ liệu...' : '🔍 Xem dự báo'}
                </button>

                {weatherData && (
                  <div className="ai-weather-result">
                    <div className="weather-header">
                      <h5>{weatherData.location}</h5>
                      <p>{new Date(weatherData.date).toLocaleDateString('vi-VN')}</p>
                    </div>

                    <div className="weather-main">
                      <div className="weather-temp">{weatherData.temperature}°C</div>
                      <div className="weather-condition">{weatherData.condition}</div>
                    </div>

                    <div className="weather-details">
                      <div className="weather-item">
                        <span>💧 Độ ẩm:</span>
                        <strong>{weatherData.humidity}%</strong>
                      </div>
                      <div className="weather-item">
                        <span>💨 Gió:</span>
                        <strong>{weatherData.windSpeed} km/h</strong>
                      </div>
                      <div className="weather-item">
                        <span>🌧️ Mưa:</span>
                        <strong>{weatherData.rainChance}%</strong>
                      </div>
                    </div>

                    <div className="weather-recommendation">
                      {weatherData.recommendation}
                    </div>

                    {weatherData.isMock && (
                      <div className="weather-note">
                        ℹ️ Dữ liệu mẫu (cần API key để có dự báo thực)
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
