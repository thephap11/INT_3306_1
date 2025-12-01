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
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <p>Không có dữ liệu</p>
            </div>
        );
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={column.sortable ? 'sortable' : ''}
                                onClick={() => handleSort(column)}
                            >
                                <div className="th-content">
                                    <span>{column.label}</span>
                                    {column.sortable && sortColumn === column.key && (
                                        <span className="sort-icon">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        {actions && <th className="actions-column">Hành động</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
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
    );
}
