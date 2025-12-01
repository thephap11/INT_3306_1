import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Custom toast notifications
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10b981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    });
};

export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#ef4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
        },
    });
};

export const showWarning = (message) => {
    toast(message, {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
        style: {
            background: '#f59e0b',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    });
};

export const showInfo = (message) => {
    toast(message, {
        duration: 3000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
            background: '#3b82f6',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    });
};

// Toast container component
export default function ToastContainer() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                className: '',
                duration: 3000,
            }}
        />
    );
}
