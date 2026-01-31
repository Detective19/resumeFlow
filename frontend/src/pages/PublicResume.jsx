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
        const fetchLocation = async () => {
            try {
                // 1.5s timeout to ensure resume loads fast even if geo-api is slow
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);

                const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    return { city: data.city, country: data.country_name };
                }
            } catch (e) {
                // Silently fail to console to keep UI clean
                console.warn('Location lookup skipped:', e.message);
            }
            return null;
        };

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

                // Append Analytics Data
                const loc = await fetchLocation();
                const params = new URLSearchParams();

                // Cache Busting
                params.append('_t', Date.now());

                if (loc) {
                    if (loc.city) params.append('city', loc.city);
                    if (loc.country) params.append('country', loc.country);
                }

                const separator = url.includes('?') ? '&' : '?';
                url += `${separator}${params.toString()}`;

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



    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <ResumeViewer data={data} />
        </div>
    );
}
