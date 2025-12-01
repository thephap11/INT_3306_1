import React from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger' }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="confirm-backdrop" onClick={handleBackdropClick}>
            <div className="confirm-dialog">
                <div className={`confirm-icon confirm-icon-${type}`}>
                    {type === 'danger' ? '⚠️' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-btn-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button className={`confirm-btn-confirm confirm-btn-${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
