/**
 * Layout Component - Main app wrapper with navigation
 * 
 * This component provides the core layout structure for the entire application.
 * It includes a responsive navigation bar with mobile hamburger menu support.
 * 
 * External Dependencies:
 * - react-router-dom: For navigation and routing
 * - lucide-react: Beautiful open-source icon library (GitBranch, Menu, X icons)
 * 
 * Features:
 * - Desktop navigation menu (visible on tablets and above)
 * - Mobile slide-out menu with smooth animations
 * - Sticky header that stays visible while scrolling
 * - User authentication state display
 */

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GitBranch, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Footer from './Footer';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-green-600';
    const isMobileActive = (path) => location.pathname === path ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700 hover:bg-gray-50';

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-lg font-bold tracking-tight flex items-center gap-2">
                            <GitBranch className="text-green-600" size={20} />
                            <span className="hidden sm:inline">ResumeFlow</span>
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                            <Link to="/" className={isActive('/')}>Home</Link>
                            <Link to="/generate" className={isActive('/generate')}>Generate Resume</Link>
                            <Link to="/versions" className={isActive('/versions')}>Control Versions</Link>
                            <Link to="/analytics" className={isActive('/analytics')}>Analytics</Link>
                            <Link to="/how-it-works" className={isActive('/how-it-works')}>How It Works</Link>
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-sm text-gray-900 font-medium hover:underline">Login</Link>
                                <Link to="/signup" className="btn-primary">Sign Up</Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-600 font-mono">{JSON.parse(user).username}</span>
                                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Log Out</button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* Mobile Menu Panel */}
                <div className={`fixed top-14 right-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="space-y-1 px-3">
                                <Link to="/" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-lg transition-colors ${isMobileActive('/')}`}>Home</Link>
                                <Link to="/generate" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-lg transition-colors ${isMobileActive('/generate')}`}>Generate Resume</Link>
                                <Link to="/versions" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-lg transition-colors ${isMobileActive('/versions')}`}>Control Versions</Link>
                                <Link to="/analytics" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-lg transition-colors ${isMobileActive('/analytics')}`}>Analytics</Link>
                                <Link to="/how-it-works" onClick={closeMobileMenu} className={`block px-4 py-3 rounded-lg transition-colors ${isMobileActive('/how-it-works')}`}>How It Works</Link>
                            </div>
                        </div>

                        {/* Mobile Auth Section */}
                        <div className="border-t border-gray-200 p-4">
                            {!user ? (
                                <div className="space-y-2">
                                    <Link to="/login" onClick={closeMobileMenu} className="block w-full text-center px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Login</Link>
                                    <Link to="/signup" onClick={closeMobileMenu} className="block w-full text-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">Sign Up</Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Logged in as</p>
                                        <p className="text-sm text-gray-900 font-mono font-semibold">{JSON.parse(user).username}</p>
                                    </div>
                                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50">Log Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
