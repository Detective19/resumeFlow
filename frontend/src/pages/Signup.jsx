import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import api from '../lib/axios';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/signup', { username, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/generate');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Signup failed. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative">
                {/* Decorative top border */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full" />

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
                        <UserPlus className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-sm text-gray-500">Start building your resume system</p>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-6 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Username</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <User className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="johndoe"
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50/50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Mail className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all mt-6"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <Link to="/how-it-works" className="text-xs text-gray-400 hover:text-gray-600 font-medium">How It Works</Link>
                </div>
            </div>
        </div>
    );
}
