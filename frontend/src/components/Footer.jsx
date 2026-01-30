import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50/50 to-white mt-auto relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Three Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Section 1 — Product */}
                    <div>
                        <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                            Product
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/generate" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
                                    Generate Resume
                                </Link>
                            </li>
                            <li>
                                <Link to="/versions" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
                                    Control Versions
                                </Link>
                            </li>
                            <li>
                                <Link to="/analytics" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
                                    Analytics
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2 — System */}
                    <div>
                        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                            System
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Versioning Model
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Locked Profiles
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Public Resume Links
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                                    Resume as JSON
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3 — Project */}
                    <div>
                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                            Project
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                    About ResumeFlow
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                    Architecture Overview
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                    GitHub Repository
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                    Report an Issue
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <GitBranch className="text-green-600" size={14} />
                            <p className="text-xs text-gray-500 font-medium">
                                © ResumeFlow — Resume Infrastructure System
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            Built as a system, not a template.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
