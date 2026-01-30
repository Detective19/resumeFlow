/**
 * Toast Notification System
 * 
 * A global notification system that displays non-blocking messages to users.
 * Inspired by modern UI patterns from apps like GitHub and Vercel.
 * 
 * External Dependencies:
 * - lucide-react: Open-source icon library for beautiful, consistent icons
 *   Icons used: CheckCircle (success), XCircle (error), Info (info), 
 *   AlertCircle (warning), X (close button)
 * 
 * Features:
 * - Four toast types: success, error, info, warning
 * - Auto-dismiss after 3 seconds (customizable)
 * - Manual dismiss with close button
 * - Smooth slide-in animations
 * - Mobile-responsive (full-width on small screens)
 * - Stacks multiple toasts vertically
 * 
 * Usage:
 *   const toast = useToast();
 *   toast.success('Profile created!');
 *   toast.error('Failed to save');
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-4 z-50 space-y-2 pointer-events-none">
                {toasts.map(({ id, message, type }) => (
                    <Toast key={id} message={message} type={type} onClose={() => removeToast(id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ message, type, onClose }) {
    const icons = {
        success: <CheckCircle size={18} />,
        error: <XCircle size={18} />,
        info: <Info size={18} />,
        warning: <AlertCircle size={18} />
    };

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    const iconColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600',
        warning: 'text-yellow-600'
    };

    return (
        <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg w-full sm:min-w-[300px] sm:max-w-md animate-in slide-in-from-right duration-300 ${styles[type]}`}>
            <div className={iconColors[type]}>{icons[type]}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0">
                <X size={16} />
            </button>
        </div>
    );
}
