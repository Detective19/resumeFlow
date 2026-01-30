/**
 * Login Page - User Authentication
 * 
 * Handles user login with email and password. Includes loading states,
 * error handling via toast notifications, and responsive design.
 * 
 * External Dependencies:
 * - react-router-dom: For navigation after successful login
 * - lucide-react: Icon library (Lock, Mail, LogIn, Loader icons)
 * - axios: Custom configured instance for API calls
 * - Toast system: For user feedback instead of alert() dialogs
 * 
 * Features:
 * - JWT token-based authentication
 * - Loading spinner during login
 * - Toast notifications for success/error
 * - Input validation
 * - Responsive design with gradient styling
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, Loader } from 'lucide-react';
import api from '../lib/axios';
import { useToast } from '../components/Toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login successful! Welcome back.');
            setTimeout(() => navigate('/generate'), 500);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Login failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative">
                {/* Decorative top border */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                        <LogIn className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Enter your credentials to access the system</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Mail className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Lock className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all mt-6 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <a href="/signup" className="text-blue-600 font-bold hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}
