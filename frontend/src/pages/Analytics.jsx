/**
 * Analytics Dashboard - Resume Performance Metrics
 * 
 * Displays comprehensive analytics about resume views, device types, geography,
 * and traffic sources. Helps users understand how their resume is being viewed.
 * 
 * External Dependencies:
 * - recharts: Popular React charting library for beautiful, responsive charts
 *   Components: LineChart, PieChart, ResponsiveContainer, Tooltip, Legend
 *   Note: Recharts is built on D3 but provides a simpler React API
 * 
 * - lucide-react: Icon library for UI elements
 *   Icons: Eye, Map, Monitor, Smartphone, Globe, Clock, ArrowUpRight, TrendingUp, History
 * 
 * - axios: For fetching analytics data from backend
 * 
 * Features:
 * - Total views and unique visitors counter
 * - 30-day view trend line chart
 * - Device type breakdown (Desktop vs Mobile) - pie chart
 * - Geographic distribution by country/city
 * - Traffic sources tracking
 * - Recent views timeline
 * - Responsive grid layout
 */

import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Eye, Map, Monitor, Smartphone, Globe, Clock,
    ArrowUpRight, TrendingUp, History
} from 'lucide-react';
import api from '../lib/axios';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const DEVICE_COLORS = {
    'Desktop': '#3b82f6',
    'Mobile': '#10b981',
    'Tablet': '#f59e0b'
};

export default function Analytics() {
    const [summary, setSummary] = useState({ totalViews: 0, countriesCount: 0, desktopViews: 0, mobileViews: 0 });
    const [timeline, setTimeline] = useState([]);
    const [detailed, setDetailed] = useState({ countries: [], devices: [], recent: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, timeRes, detRes] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/analytics/timeline'),
                    api.get('/analytics/detailed')
                ]);

                setSummary(sumRes.data);
                setTimeline(timeRes.data);
                setDetailed(detRes.data);
            } catch (error) {
                console.error('Failed to fetch analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium font-sans">Calculating Insights...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-sans selection:bg-green-100 selection:text-green-800">
            <div className="max-w-7xl mx-auto px-8 py-10">

                {/* Header */}
                <header className="mb-10 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Track views, locations, and engagement across all your resume versions.</p>
                </header>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Eye size={120} />
                        </div>
                        <div className="flex items-center gap-2.5 text-blue-500 text-xs font-bold uppercase tracking-widest mb-3">
                            <Eye size={16} /> Total Views
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{summary.totalViews}</div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                            <ArrowUpRight size={12} className="text-green-500" /> Lifetime Reach
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Globe size={120} />
                        </div>
                        <div className="flex items-center gap-2.5 text-purple-500 text-xs font-bold uppercase tracking-widest mb-3">
                            <Globe size={16} /> Countries
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{summary.countriesCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Global Footprint</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Monitor size={120} />
                        </div>
                        <div className="flex items-center gap-2.5 text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
                            <Monitor size={16} /> Desktop
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{summary.desktopViews}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Professional Views</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Smartphone size={120} />
                        </div>
                        <div className="flex items-center gap-2.5 text-green-500 text-xs font-bold uppercase tracking-widest mb-3">
                            <Smartphone size={16} /> Mobile
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{summary.mobileViews}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">On-the-go Views</div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-lg font-bold text-gray-900">Views Over Time</h2>
                        <div className="text-[10px] bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-green-100">Last 7 Days</div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeline}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid #f3f4f6',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#059669', fontWeight: 700 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#059669', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Top Countries */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-full">
                        <h2 className="text-lg font-bold text-gray-900 mb-8">Top Countries</h2>
                        <div className="space-y-6">
                            {detailed.countries.map((c, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 font-bold w-4 text-xs">{idx + 1}</span>
                                            <span className="font-bold text-gray-700">{c.name}</span>
                                        </div>
                                        <span className="font-mono text-gray-400 font-bold">{c.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${c.percentage}%`,
                                                backgroundColor: COLORS[idx % COLORS.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {detailed.countries.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm italic">Waiting for visits...</div>
                            )}
                        </div>
                    </div>

                    {/* Devices */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-full">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Devices</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={detailed.devices}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="count"
                                    >
                                        {detailed.devices.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DEVICE_COLORS[entry.name] || '#cbd5e1'} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        formatter={(value, entry) => (
                                            <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                                                {value} <span className="text-gray-400 text-[10px]">{entry.payload.percentage}%</span>
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Views Table */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                            <History size={20} className="text-gray-400" /> Recent Views
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Device</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {detailed.recent.map((view, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Clock size={14} className="text-gray-300" />
                                                {new Date(view.viewedAt).toLocaleDateString()}
                                                <span className="text-gray-300 ml-1">{new Date(view.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border ${view.resumeType === 'master' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                                    {view.resumeType}
                                                </span>
                                                <span className="text-gray-700">{view.profileName || 'Main Resume'}</span>
                                                {view.versionNumber && <span className="text-gray-400 font-mono text-xs italic">v{view.versionNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Map size={14} className="text-gray-300" />
                                                {view.city && view.city !== 'Unknown' ? `${view.city}, ` : ''}
                                                {view.country === 'Unknown' ? 'Local Visit' : view.country}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 text-sm text-gray-600 font-medium">
                                                {view.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                                {view.device}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {detailed.recent.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 text-sm italic">
                                            No recent activity detected.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
