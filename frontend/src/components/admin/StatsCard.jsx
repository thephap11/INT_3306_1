import React from 'react';
import './StatsCard.css';

export default function StatsCard({ title, value, icon, color = 'blue', trend, subtitle }) {
    return (
        <div className={`stats-card stats-card-${color}`}>
            <div className="stats-card-header">
                <div className="stats-card-info">
                    <p className="stats-card-title">{title}</p>
                    <h3 className="stats-card-value">{value}</h3>
                    {subtitle && <p className="stats-card-subtitle">{subtitle}</p>}
                </div>
                <div className={`stats-card-icon stats-icon-${color}`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="stats-card-footer">
                    <span className={`stats-trend ${trend.direction}`}>
                        {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                    </span>
                    <span className="stats-trend-label">{trend.label}</span>
                </div>
            )}
        </div>
    );
}
