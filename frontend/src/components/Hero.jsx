import React from 'react'
import './Hero.css'

export default function Hero({ title, subtitle }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      </div>
    </header>
  )
}
