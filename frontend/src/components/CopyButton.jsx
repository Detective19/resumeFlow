/**
 * CopyButton Component - One-click URL copying
 * 
 * A reusable button that copies text to the clipboard with visual feedback.
 * Provides a smooth user experience with icon transitions and confirmation messages.
 * 
 * External Dependencies:
 * - lucide-react: Icons library (Copy and Check icons)
 * - Browser Clipboard API: Native JavaScript API for clipboard operations
 * 
 * Features:
 * - One-click copy to clipboard
 * - Visual feedback: Check icon + "Copied!" message (2 seconds)
 * - Responsive: Hides text on mobile, shows icon only
 * - Accessible: Includes tooltip title
 * 
 * Props:
 * - text: String to copy to clipboard
 * - size: Icon size in pixels (default: 14)
 * - className: Additional CSS classes
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, className = '', size = 16 }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors ${className}`}
            title="Copy to clipboard"
        >
            {copied ? (
                <>
                    <Check size={size} className="text-green-600" />
                    <span className="text-xs font-medium text-green-600 hidden sm:inline">Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={size} />
                    <span className="text-xs font-medium hidden sm:inline">Copy</span>
                </>
            )}
        </button>
    );
}
