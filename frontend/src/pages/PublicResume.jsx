import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ResumeViewer from '../components/ResumeViewer';

export default function PublicResume() {
    const { username, version, profileName } = useParams();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                let url = `${baseUrl}/public`;
                const isLockedProfile = location.pathname.includes('/v/');

                if (isLockedProfile) {
                    // Locked Profile Route
                    if (version) {
                        url += `/${username}/v/${profileName}/${version}`;
                    } else {
                        url += `/${username}/v/${profileName}`;
                    }
                } else {
                    // Standard Resume Route
                    if (version) {
                        url += `/${username}/${version}`;
                    } else {
                        url += `/${username}`;
                    }
                }

                const response = await axios.get(url);
                setData(response.data.content); // ResumeVersion.content is the JSON
            } catch (err) {
                setError('Resume not found');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username, version, profileName, location.pathname]);

    // Analytics Tracking
    useEffect(() => {
        if (!data) return;

        const trackView = async () => {
            try {
                // Determine endpoint based on environment
                // Local Dev (Vite): internal /api won't work without vercel dev, so hit backend directly
                // Production (Vercel): use /api/analytics/track proxy to capture headers
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

                const endpoint = isLocal ? `${baseUrl}/analytics/track` : '/api/analytics/track';

                await axios.post(endpoint, {
                    username,
                    version: version || null,
                    profileName: profileName || null,
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    screenWidth: window.innerWidth
                });
            } catch (err) {
                console.warn('Analytics tracking failed', err);
            }
        };

        trackView();
    }, [data, username, version, profileName]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <ResumeViewer data={data} />
        </div>
    );
}
