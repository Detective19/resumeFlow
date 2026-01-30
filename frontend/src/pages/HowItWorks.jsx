import { Link } from 'react-router-dom';
import {
    FileText, GitBranch, Lock, Link as LinkIcon, BarChart3,
    Layers, Cpu, Database, CheckCircle2, ArrowRight,
    Terminal, Globe, ShieldCheck
} from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-emerald-100 pb-20">
            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 mb-6">
                    <Terminal size={12} /> System Documentation
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                    How ResumeFlow Works
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    A technical overview of the resume infrastructure system. Permanent links, version control, and analytics built for developers.
                </p>
            </section>

            {/* Detailed Steps */}
            <div className="max-w-6xl mx-auto px-6 space-y-32 py-20">
                {/* Step 1: Create Your Resume */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-emerald-100 tracking-tighter">01</span>
                            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                <FileText className="text-emerald-600" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Create Your Resume</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Use our structured form editor to build your resume. Data is stored as JSON in the database, making it easily renderable across different templates.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800 font-mono text-sm group">
                            <div className="flex gap-1.5 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                            </div>
                            <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                                {`{
  "personalInfo": {
    "name": "Alex Chen",
    "email": "alex@example.com"
  },
  "experience": [...],
  "skills": ["React", "Node.js", "System Design"]
}`}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Step 2: Version Control */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-indigo-100 tracking-tighter">02</span>
                            <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                                <GitBranch className="text-indigo-600" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Version Control</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Every save creates a new version. Like Git commits, each version has a unique identifier and changelog. You can restore, compare, or roll back anytime.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
                            {[
                                { v: 'v5', msg: 'current (live)', color: 'text-emerald-600 font-bold' },
                                { v: 'v4', msg: 'Added Rust to skills', color: 'text-gray-600' },
                                { v: 'v3', msg: 'Updated TechCorp role', color: 'text-gray-600' },
                                { v: 'v2', msg: 'Initial skills section', color: 'text-gray-600' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-lg font-mono text-sm hover:border-indigo-200 transition-colors">
                                    <span className="text-indigo-400">{item.v}</span>
                                    <span className="text-gray-300">→</span>
                                    <span className={item.color}>"{item.msg}"</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 3: Lock Job Profiles */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-purple-100 tracking-tighter">03</span>
                            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                                <Lock className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Lock Job Profiles</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Create role-specific versions with their own permanent URLs. Perfect for tailoring your resume to different job types while keeping separate version histories.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg space-y-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Permanent Endpoints</div>
                            {[
                                { url: '/alex/v/frontend', status: 'v3 (live)' },
                                { url: '/alex/v/backend', status: 'v2 (live)' },
                                { url: '/alex/v/fullstack', status: 'v1 (live)' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg font-mono text-xs border border-transparent hover:border-purple-200 transition-all cursor-pointer">
                                    <span className="text-gray-600">{item.url}</span>
                                    <span className="text-purple-500 font-bold">→ {item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 4: Permanent Public Links */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-amber-100 tracking-tighter">04</span>
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                                <LinkIcon className="text-amber-600" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Permanent Public Links</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Your master resume always has one URL that shows the latest version. Locked profiles have their own permanent URLs. Snapshot links point to specific versions.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 overflow-hidden font-mono text-xs space-y-2">
                            {[
                                { path: '/username', type: 'latest master', color: 'text-blue-500' },
                                { path: '/username/v/frontend', type: 'locked profile', color: 'text-purple-500' },
                                { path: '/username/v/frontend/3', type: 'immutable snapshot', color: 'text-gray-400' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-2.5 bg-white border border-gray-100 rounded">
                                    <span className="flex-1 text-gray-700">{item.path}</span>
                                    <span className={`w-32 text-right ${item.color} font-bold`}>→ {item.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 5: Analytics & Insights */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black text-rose-100 tracking-tighter">05</span>
                            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                                <BarChart3 className="text-rose-600" size={24} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Track every view with detailed analytics. See which countries, devices, and browsers drive traffic to your resume. Understand which versions perform best.
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Views</div>
                                    <div className="text-2xl font-black text-emerald-900">2,543</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Countries</div>
                                    <div className="text-2xl font-black text-blue-900">12</div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Browser Distribution</span>
                                </div>
                                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="w-[70%] bg-blue-400" />
                                    <div className="w-[20%] bg-orange-400" />
                                    <div className="w-[10%] bg-emerald-400" />
                                </div>
                                <div className="flex gap-4 text-[10px] font-bold text-gray-500">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Chrome</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400" /> Safari</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Firefox</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Architecture Section */}
            <section className="bg-gray-50 py-32 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <Layers className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">System Architecture</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:border-blue-200 transition-all group">
                            <div className="p-3 bg-blue-50 w-fit rounded-xl border border-blue-100 group-hover:scale-110 transition-transform">
                                <Globe className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Frontend</h3>
                            <ul className="space-y-2 text-gray-500 text-sm font-medium">
                                <li className="flex items-center gap-2">• React + TypeScript</li>
                                <li className="flex items-center gap-2">• Tailwind CSS</li>
                                <li className="flex items-center gap-2">• Vite bundler</li>
                                <li className="flex items-center gap-2">• React Router</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:border-purple-200 transition-all group">
                            <div className="p-3 bg-purple-50 w-fit rounded-xl border border-purple-100 group-hover:scale-110 transition-transform">
                                <Cpu className="text-purple-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Backend</h3>
                            <ul className="space-y-2 text-gray-500 text-sm font-medium">
                                <li className="flex items-center gap-2">• Node.js + Express</li>
                                <li className="flex items-center gap-2">• Prisma ORM</li>
                                <li className="flex items-center gap-2">• Puppeteer PDF</li>
                                <li className="flex items-center gap-2">• JWT Auth</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4 hover:border-emerald-200 transition-all group">
                            <div className="p-3 bg-emerald-50 w-fit rounded-xl border border-emerald-100 group-hover:scale-110 transition-transform">
                                <Database className="text-emerald-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Database</h3>
                            <ul className="space-y-2 text-gray-500 text-sm font-medium">
                                <li className="flex items-center gap-2">• CockroachDB / SQL</li>
                                <li className="flex items-center gap-2">• JSONB indexing</li>
                                <li className="flex items-center gap-2">• Version tracking</li>
                                <li className="flex items-center gap-2">• Event logging</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 font-mono text-sm">
                        <div className="text-gray-500 mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Database schema overview
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 text-indigo-300">
                            <div className="space-y-2">
                                <div className="text-gray-300">User <span className="text-emerald-500">→ has many →</span> Resume</div>
                                <div className="text-gray-300">Resume <span className="text-emerald-500">→ has many →</span> Version</div>
                                <div className="text-gray-300">Resume <span className="text-emerald-500">→ has many →</span> LockedProfile</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-gray-300">LockedProfile <span className="text-emerald-500">→ has many →</span> Version</div>
                                <div className="text-gray-300">ResumeVersion <span className="text-emerald-500">→ has many →</span> Event</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section className="py-32 max-w-6xl mx-auto px-6">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-3xl font-extrabold tracking-tight">Core Features</h2>
                    <p className="text-gray-500 font-medium">Building the future of professional identity infrastructure.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        "Structured JSON storage for all resume data",
                        "Git-like version history with immutable snapshots",
                        "Permanent public URLs that never change",
                        "Role-specific locked profiles",
                        "Multiple template rendering options",
                        "PDF export for any version",
                        "Detailed view analytics",
                        "JWT authentication & rate limiting"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="p-2 bg-emerald-50 group-hover:bg-emerald-100 rounded-lg transition-colors">
                                <CheckCircle2 className="text-emerald-600" size={20} />
                            </div>
                            <span className="font-semibold text-gray-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Footer */}
            <section className="pt-20 pb-40 px-6 text-center max-w-4xl mx-auto">
                <div className="space-y-8">
                    <h2 className="text-4xl font-extrabold tracking-tight">Ready to Get Started?</h2>
                    <p className="text-lg text-gray-500 font-medium">Create your resume infrastructure in minutes.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link
                            to="/generate"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
                        >
                            Create Resume <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                        </Link>
                        <Link
                            to="/versions"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            View Versions
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
