
import axios from 'axios';  // Using axios inside the function if environment supports module resolution, or native fetch
// Vercel serverless functions support standard Node.js. 
// However, 'axios' from frontend dependencies might not be bundled cleanly in a separate API function unless specified.
// Safe bet is native 'fetch' or careful import. 
// Given the project structure, it is safer to use native fetch for the proxy to avoid dependency issues in the API folder if build config varies.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const backendUrl = process.env.VITE_API_URL || 'http://localhost:3000'; // Or generic API_URL env if defined in Vercel
        // Note: In Vercel, env vars usually don't have VITE_ prefix exposed to serverless functions unless explicitly added.
        // We should check process.env.VITE_API_URL but also a fallback.

        // Extract Vercel Geo Headers
        const country = req.headers['x-vercel-ip-country'] || req.headers['x-vercel-ip-country-region'] || null;
        const city = req.headers['x-vercel-ip-city'] || null;

        // Forward to Backend
        // Using built-in fetch (Node 18+)
        const response = await fetch(`${backendUrl}/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward the headers to Render
                ...(country && { 'x-vercel-ip-country': country }),
                ...(city && { 'x-vercel-ip-city': city }),
                // Forward User Agent for device detection
                'user-agent': req.headers['user-agent'] || '',
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        return res.status(response.status).json(data);

    } catch (error) {
        console.error('Analytics Proxy Error:', error);
        return res.status(500).json({ error: 'Failed to proxy analytics' });
    }
}
