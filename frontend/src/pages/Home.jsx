/**
 * Home Page - Landing page for ResumeFlow
 * 
 * This is the main landing page that introduces visitors to ResumeFlow's
 * core value proposition: Git-style version control for professional resumes.
 * 
 * External Dependencies:
 * - react-router-dom: For navigation between pages
 * - lucide-react: Icon library for beautiful, consistent icons
 *   Icons: ArrowRight, CheckCircle2, GitBranch, History, Link2, Database, Terminal
 * 
 * Design Elements:
 * - Hero section with gradient text
 * - Feature showcase with icons
 * - Decorative images (visible only on large screens)
 * - Call-to-action buttons
 * - Fully responsive layout
 */

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GitBranch, History, Link2, Database, Terminal } from 'lucide-react';

export default function Home() {
    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-50 overflow-x-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent -z-10" />

            {/* Section 1 — Hero (Version Control First) */}
            <section className="pt-32 pb-24 px-6 max-w-5xl mx-auto text-center relative">
                {/* Left Decorative Image */}
                <img
                    src="/left-decoration.png"
                    alt="Version Control Tree"
                    className="hidden xl:block absolute left-[-180px] top-1/2 -translate-y-1/2 w-56 opacity-60 pointer-events-none"
                />

                {/* Right Decorative Image */}
                <img
                    src="/right-decoration.png"
                    alt="Versioned Documents"
                    className="hidden xl:block absolute right-[-180px] top-1/2 -translate-y-1/2 w-56 opacity-60 pointer-events-none"
                />

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-900 to-gray-700">
                    Version Control <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">for Resumes</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    Resumes change over time, but links shouldn't.
                    ResumeFlow gives you immutable versions and permanent URLs.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/generate" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                        Generate Resume
                    </Link>
                    <Link to="/how-it-works" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        How It Works
                    </Link>
                </div>
            </section>

            {/* Section 2 — The Core Problem (Framed Technically) */}
            <section className="py-24 px-6 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16 text-center sm:text-left">
                        <h2 className="text-3xl font-bold mb-6 tracking-tight text-gray-900">Resumes don’t have version control</h2>
                        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
                            Most resume tools treat resumes as editable documents.
                            Every update overwrites the past, breaks shared links,
                            and makes it impossible to track what you actually sent.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "No history", desc: "You can’t see or recover past resume states.", border: "border-t-blue-500" },
                            { title: "Broken references", desc: "Links change when resumes are edited.", border: "border-t-rose-500" },
                            { title: "Manual branching", desc: "Job-specific resumes require copy-paste.", border: "border-t-indigo-500" },
                            { title: "Unstructured data", desc: "Resumes are stored as fragile documents, not data.", border: "border-t-amber-500" }
                        ].map((item, i) => (
                            <div key={i} className={`p-6 bg-white border border-gray-200 ${item.border} border-t-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3 — The Mental Model Shift */}
            <section className="py-32 px-6 max-w-4xl mx-auto text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-3xl -z-10" />
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
                    A resume is an artifact, not a document
                </h2>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed font-medium">
                    ResumeFlow applies version-control principles to resumes:
                    immutable snapshots, permanent links, and controlled branching.
                </p>
                <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                    <p className="font-bold text-lg">
                        Every resume state is preserved. Nothing is overwritten.
                    </p>
                </div>
            </section>

            {/* Section 4 — What This System Enables */}
            <section className="py-24 px-6 border-y border-gray-100 bg-gray-50/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 tracking-tight text-center">
                        What you get with resume version control
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            { title: "Immutable versions", desc: "Each change creates a new snapshot.", icon: <History className="text-blue-600" size={20} />, bg: "bg-blue-50", bdr: "border-blue-100" },
                            { title: "Permanent public URLs", desc: "Links always resolve to the correct version.", icon: <Link2 className="text-emerald-600" size={20} />, bg: "bg-emerald-50", bdr: "border-emerald-100" },
                            { title: "Locked job profiles", desc: "Create role-specific branches without duplication.", icon: <GitBranch className="text-indigo-600" size={20} />, bg: "bg-indigo-50", bdr: "border-indigo-100" },
                            { title: "Structured JSON storage", desc: "Resumes stored as data, not files.", icon: <Database className="text-amber-600" size={20} />, bg: "bg-amber-50", bdr: "border-amber-100" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start p-6 bg-white border border-gray-200 rounded-3xl transition-all hover:border-gray-300 shadow-sm">
                                <div className={`p-3 ${item.bg} rounded-2xl border ${item.bdr} flex-shrink-0 animate-pulse-slow`}>
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5 — Who This Makes Sense For */}
            <section className="py-32 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-12 tracking-tight">Who this model is for</h2>
                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                    {[
                        "Developers and engineers",
                        "Students applying to multiple roles",
                        "Anyone sharing resumes via links",
                        "People who value traceability and consistency"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors group">
                            <div className="p-1.5 bg-emerald-50 rounded-full border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                                <CheckCircle2 className="text-emerald-500" size={16} />
                            </div>
                            <span className="font-bold text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 6 — Closing (System-first CTA) */}
            <section className="mb-24 px-6 max-w-6xl mx-auto text-center p-20 rounded-[3rem] bg-gradient-to-b from-blue-50/50 to-indigo-50/50 border border-blue-100 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl" />

                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 relative">
                    Stop editing resumes. <br />
                    <span className="text-blue-600">Start versioning them.</span>
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
                    <Link to="/generate" className="px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-gray-400/50">
                        Generate Resume <ArrowRight size={20} />
                    </Link>
                    <Link to="/how-it-works" className="px-10 py-5 bg-white text-gray-900 border border-gray-200 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        How It Works
                    </Link>
                </div>
            </section>
        </div>
    );
}
