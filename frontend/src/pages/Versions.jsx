/**
 * Versions Page - Resume Version Control Dashboard
 * 
 * This is the main dashboard where users manage their resume versions and locked profiles.
 * Think of it as a "Git dashboard" for resumes - showing version history, branches (locked profiles),
 * and providing tools to create snapshots of resumes for specific job applications.
 * 
 * External Dependencies:
 * - react-router-dom: For navigation
 * - lucide-react: Icon library for UI elements
 *   Icons: GitBranch, Clock, Shield, CheckCircle, RotateCcw, Eye, FileText, Plus, Search, MoreHorizontal, Loader
 * - axios: Custom configured instance for API calls
 * 
 * Features:
 * - Master resume timeline (like git's main branch)
 * - Version history with timestamps
 * - Locked profiles (like git branches for specific purposes)
 * - One-click URL copying for sharing
 * - Analytics overview with stats cards
 * - Loading skeletons for better UX
 * - Toast notifications for user feedback
 * - Mobile-responsive layout
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Clock, Shield, CheckCircle, Eye, FileText, Plus, Search, MoreHorizontal, Loader } from 'lucide-react';
import api from '../lib/axios';
import { useToast } from '../components/Toast';
import CopyButton from '../components/CopyButton';

export default function Versions() {
    const [versions, setVersions] = useState([]);
    const [lockedProfiles, setLockedProfiles] = useState([]);
    const [activeTab, setActiveTab] = useState('master'); // 'master' | 'locked'
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Initial Fetch
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [creating, setCreating] = useState(false);

    const toast = useToast();

    const fetchData = async () => {
        try {
            const [vRes, lRes] = await Promise.all([
                api.get('/resume/versions'),
                api.get('/locked-profiles')
            ]);
            setVersions(vRes.data);
            setLockedProfiles(lRes.data);
            setUser(JSON.parse(localStorage.getItem('user')));
        } catch (error) {
            console.error('Failed to load data', error);
            toast.error('Failed to load resume data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        if (!newProfileName.trim()) return;

        setCreating(true);
        try {
            await api.post('/locked-profiles', { name: newProfileName });
            setNewProfileName('');
            setShowCreateModal(false);
            toast.success(`Profile "${newProfileName}" created successfully!`);
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Failed to create profile', error);
            toast.error(error.response?.data?.error || 'Failed to create profile. Ensure you have a master resume.');
        } finally {
            setCreating(false);
        }
    };

    const handleSetLive = async (versionId) => {
        try {
            await api.post(`/resume/version/${versionId}/set-live`);
            toast.success('Version set as live successfully!');
            fetchData(); // Refresh the version list to show the new version
        } catch (error) {
            console.error('Failed to set version live', error);
            toast.error(error.response?.data?.error || 'Failed to set version live');
        }
    };

    const masterVersion = versions.find(v => v.isMaster);
    const versionHistory = versions.filter(v => !v.isMaster);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100 selection:text-green-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                <GitBranch className="text-green-600" size={24} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Control Versions</h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500">Manage your master resume and locked job profiles. Git-like version control.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">New Locked Profile</span>
                        <span className="sm:hidden">New Profile</span>
                    </button>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
                                <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                                <Eye size={14} className="text-blue-500" /> Master Resume
                            </div>
                            <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-2">
                                v{masterVersion?.versionNumber || 0}
                                {masterVersion && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">LIVE</span>}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-2">
                                /{user?.username || 'user'}
                                {user && <CopyButton text={`${window.location.origin}/public/${user.username}`} size={12} />}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                                <GitBranch size={14} className="text-purple-500" /> Total Versions
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{versions.length}</div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                                <Shield size={14} className="text-orange-500" /> Locked Profiles
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{lockedProfiles.length}</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('master')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'master' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Master Resume
                    </button>
                    <button
                        onClick={() => setActiveTab('locked')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'locked' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Locked Profiles
                    </button>
                </div>

                {/* Master Resume Timeline */}
                {activeTab === 'master' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Master Resume Timeline</h3>
                            <div className="text-sm text-gray-500 font-mono">Your main resume at <a href={`/public/${user?.username}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700 hover:underline bg-green-50 px-1 rounded transition-colors">/{user?.username}</a></div>
                        </div>

                        {versions.length === 0 ? (
                            <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50/50">
                                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-gray-900 font-medium text-lg mb-2">No Resume Versions Yet</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start building your professional resume to see version history and enable public sharing.</p>
                                <Link to="/generate" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                                    <Plus size={18} />
                                    Generate Your First Resume
                                </Link>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-gray-200 ml-4 pl-8 space-y-8 pb-4">
                                {/* Live Version */}
                                {masterVersion && (
                                    <div className="relative">
                                        <span className="absolute -left-[41px] top-4 h-5 w-5 rounded-full bg-white border-4 border-green-500 shadow-sm"></span>
                                        <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm ring-1 ring-green-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <GitBranch size={16} className="text-gray-400" />
                                                        <span className="font-bold text-gray-900 text-lg">v{masterVersion.versionNumber}</span>
                                                    </div>
                                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-green-200">LIVE</span>
                                                </div>
                                                <a href={`/public/${user?.username}/${masterVersion.versionNumber}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-green-700 flex items-center gap-1.5 text-xs transition-colors">
                                                    <span>Preview</span>
                                                    <Eye size={12} />
                                                </a>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3">Current active version visible to the public.</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                                                <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(masterVersion.createdAt).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-2">
                                                    <a href={`/public/${user?.username}/${masterVersion.versionNumber}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700 hover:underline transition-colors">/{user?.username}/v/{masterVersion.versionNumber}</a>
                                                    <CopyButton text={`${window.location.origin}/public/${user?.username}/${masterVersion.versionNumber}`} size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* History */}
                                {versionHistory.map(v => (
                                    <div key={v.id} className="relative group">
                                        <span className="absolute -left-[41px] top-4 h-4 w-4 rounded-full bg-gray-200 border-4 border-white shadow-sm group-hover:bg-gray-400 transition-colors"></span>
                                        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <GitBranch size={16} className="text-gray-400" />
                                                    <span className="font-bold text-gray-700">v{v.versionNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={`/public/${user?.username}/${v.versionNumber}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                                                        <Eye size={12} /> Preview
                                                    </a>

                                                    <button
                                                        onClick={() => handleSetLive(v.id)}
                                                        disabled={v.isMaster}
                                                        className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-50"
                                                        title={v.isMaster ? "This version is already live" : "Set this version as your new live resume"}
                                                    >
                                                        Set Live
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 font-mono mt-3">
                                                <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(v.createdAt).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-2">
                                                    <a href={`/public/${user?.username}/${v.versionNumber}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-700 hover:underline transition-colors">/{user?.username}/v/{v.versionNumber}</a>
                                                    <CopyButton text={`${window.location.origin}/public/${user?.username}/${v.versionNumber}`} size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Locked Profiles State */}
                {activeTab === 'locked' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {lockedProfiles.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <Shield size={40} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-gray-900 font-medium mb-1">No Locked Profiles</h3>
                                <p className="text-gray-500 text-sm mb-6">Create a locked profile to snapshot your resume for a specific job.</p>
                                <button
                                    onClick={() => {
                                        setActiveTab('locked');
                                        setShowCreateModal(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    Create Your First Profile
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lockedProfiles.map(p => (
                                    <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/public/${user?.username}/v/${p.name}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-green-600 hover:text-green-700 font-mono hover:underline transition-colors"
                                                    >
                                                        /{user?.username}/v/{p.name}
                                                    </a>
                                                    <CopyButton text={`${window.location.origin}/public/${user?.username}/v/${p.name}`} size={11} />
                                                </div>
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-mono border border-gray-200 shadow-sm">{p.versions.length} versions</span>
                                        </div>
                                        <a
                                            href={`/public/${user?.username}/v/${p.name}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Eye size={14} />
                                            Preview Locked Profile
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {/* Create Profile Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Create New Locked Profile</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <Plus className="rotate-45" size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateProfile} className="p-6">
                                <p className="text-sm text-gray-500 mb-4">
                                    This will create a permanent snapshot of your current <span className="font-bold text-green-600">Master Resume</span>. Perfect for applying to specific companies.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Profile Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="e.g. Google - Software Engineer"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                            value={newProfileName}
                                            onChange={(e) => setNewProfileName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={creating || !newProfileName.trim()}
                                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                                        >
                                            {creating ? 'Creating...' : 'Create Profile'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
