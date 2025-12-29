import React from 'react';
import './DataTable.css';

export default function DataTable({ columns, data, actions, onSort, sortColumn, sortDirection, isLoading }) {
    const handleSort = (column) => {
        if (column.sortable && onSort) {
            onSort(column.key);
        }
    };

    if (isLoading) {
        return (
            <div className="table-loading">
                <div className="modern-spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
                <p className="loading-text">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                        <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
                        <line x1="9" y1="21" x2="9" y2="9" strokeWidth="2"/>
                    </svg>
                </div>
                <p className="empty-text">Không có dữ liệu</p>
                <p className="empty-subtext">Chưa có dữ liệu để hiển thị</p>
            </div>
        );
    }

    return (
        <div className="modern-table-wrapper">
            <div className="data-table-container">
                <table className="data-table modern-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={column.sortable ? 'sortable' : ''}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="th-content">
                                        <span className="th-label">{column.label}</span>
                                        {column.sortable && (
                                            <span className={`sort-icon ${sortColumn === column.key ? 'active' : ''}`}>
                                                {sortColumn === column.key ? (
                                                    sortDirection === 'asc' ? (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M7 14l5-5 5 5z"/>
                                                        </svg>
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M7 10l5 5 5-5z"/>
                                                        </svg>
                                                    )
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                                                        <path d="M7 10l5 5 5-5z"/>
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="actions-column">Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex} className="table-row">
                                {columns.map((column) => (
                                    <td key={column.key} className={column.className || ''}>
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
