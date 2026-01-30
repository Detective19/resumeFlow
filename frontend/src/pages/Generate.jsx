/**
 * Generate Resume Page - Interactive Resume Builder
 * 
 * The core page where users create and edit their resume content.
 * Features a live preview, multiple customization options, and form validation.
 * 
 * External Dependencies:
 * - react-router-dom: For navigation
 * - lucide-react: Icon library for form fields and UI elements
 *   Icons: Mail, Phone, MapPin, User, Pencil, GraduationCap, Briefcase, Code, Zap, ArrowRight, Star
 * - axios: For API calls to save resume data
 * - ResumeViewer: Custom component for live resume preview
 * 
 * Features:
 * - Multi-step form with personal info, education, experience, skills, projects
 * - Live preview of resume while editing
 * - Theme selection (professional, modern, creative, technical, minimal, classic)
 * - Color palette customization
 * - Font family selection
 * - Save as master resume or create locked profile
 * - Form validation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail, Phone, MapPin, User,
    Pencil, GraduationCap, Briefcase, Code, Zap,
    ArrowRight, Star
} from 'lucide-react';
import api from '../lib/axios';
import ResumeViewer from '../components/ResumeViewer';

export default function Generate() {
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState({
        personal: { name: '', email: '', phone: '', location: '', summary: '' },
        experience: [],
        education: [],
        projects: [],
        skills: []
    });
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [template, setTemplate] = useState('classic');
    const [fontStyle, setFontStyle] = useState('modern');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!resumeData.personal.name?.trim()) newErrors.name = true;
        if (!resumeData.personal.email?.trim()) newErrors.email = true;
        if (resumeData.skills.length === 0 || resumeData.skills.every(s => s.trim() === '')) newErrors.skills = true;
        return newErrors;
    };

    const isValid = Object.keys(validate()).length === 0;

    // Real-time validation check for UI feedback
    useEffect(() => {
        setErrors(validate());
    }, [resumeData]);

    // Helper to update specific fields deeply
    const updatePersonal = (field, value) => {
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', role: '', start: '', end: '', bullets: [''] }]
        }));
    };

    const updateExperience = (idx, field, value) => {
        const newExp = [...resumeData.experience];
        newExp[idx][field] = value;
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const updateBullet = (expIdx, bulletIdx, value) => {
        const newExp = [...resumeData.experience];
        newExp[expIdx].bullets[bulletIdx] = value;
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const addBullet = (expIdx) => {
        const newExp = [...resumeData.experience];
        newExp[expIdx].bullets.push('');
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', start: '', end: '' }]
        }));
    };

    const updateEducation = (idx, field, value) => {
        const newEdu = [...resumeData.education];
        newEdu[idx][field] = value;
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(s => s.trim());
        setResumeData(prev => ({ ...prev, skills: skillsArray }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: '', role: '', start: '', end: '', bullets: [''] }]
        }));
    };

    const updateProject = (index, field, value) => {
        const newProjects = [...resumeData.projects];
        newProjects[index][field] = value;
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const addProjectBullet = (idx) => {
        const newProjects = [...resumeData.projects];
        newProjects[idx].bullets.push('');
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const updateProjectBullet = (idx, bIdx, value) => {
        const newProjects = [...resumeData.projects];
        newProjects[idx].bullets[bIdx] = value;
        setResumeData({ ...resumeData, projects: newProjects });
    };

    // Placeholder for addSkill, as it was referenced in the UI but not defined
    const addSkill = () => {
        // This function would typically add a new skill input field
        // For now, it does nothing as skills are managed by a single textarea
        alert('Skills are managed via comma-separated text input. To add a skill, type it in the box.');
    };


    const handleDemoData = () => {
        setResumeData({
            personal: {
                name: 'Alex Chen',
                email: 'alex.chen@example.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                summary: 'Senior Full Stack Engineer with 6+ years of experience building scalable web applications. Passionate about clean code, system architecture, and developer tools.'
            },
            experience: [
                {
                    company: 'TechNova',
                    role: 'Senior Software Engineer',
                    start: '2021',
                    end: 'Present',
                    bullets: [
                        'Architected a microservices-based payment system processing $1M+ monthly.',
                        'Reduced API latency by 40% through redis caching strategies.',
                        'Mentored 3 junior developers and established code review guidelines.'
                    ]
                },
                {
                    company: 'Creative Solutions',
                    role: 'Frontend Developer',
                    start: '2018',
                    end: '2021',
                    bullets: [
                        'Owned the redesign of the main dashboard using React and Tailwind.',
                        'Implemented CI/CD pipelines reducing deployment time by 60%.'
                    ]
                }
            ],
            education: [
                { institution: 'University of California, Berkeley', degree: 'B.S. Computer Science', start: '2014', end: '2018' }
            ],
            projects: [
                {
                    name: 'E-Commerce Platform',
                    role: 'Lead Developer',
                    start: '2020',
                    end: '2021',
                    bullets: ['Built a full-stack e-commerce solution using MERN stack.', 'Integrated Stripe for secure payments.']
                }
            ],
            skills: ['JavaScript (ES6+)', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'System Design']
        });
    };

    const handleSave = async () => {
        if (!isValid) {
            alert('Please complete all required fields (Name, Email, at least 1 Skill).');
            return;
        }
        setLoading(true);
        try {
            await api.post('/resume/version', { content: resumeData });
            navigate('/versions');
        } catch (error) {
            console.error('Save failed:', error.response?.data || error.message);
            alert('Failed to save version: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!isValid) {
            alert('Please save a valid version before exporting.');
            return;
        }
        setExporting(true);
        try {
            const response = await api.post('/export/pdf/master', { template, content: resumeData }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the DOM
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-3.5rem)] bg-gray-50 overflow-hidden">
            {/* Editor Pane - Left Card */}
            <div className="w-1/2 p-6 flex flex-col h-full">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                    {/* Editor Header - Fixed */}
                    <header className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                                <Pencil className="text-purple-600" size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Editor</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={fontStyle}
                                onChange={(e) => setFontStyle(e.target.value)}
                                className="bg-white border border-gray-200 text-xs font-semibold rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-400 text-gray-600 cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                <option value="modern">Modern (Sans)</option>
                                <option value="classic">Classic (Serif)</option>
                                <option value="technical">Technical (Mono)</option>
                            </select>

                            <button
                                onClick={handleExport}
                                disabled={exporting || !isValid}
                                className="px-4 py-1.5 rounded-md text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                title={!isValid ? "Save a valid version first" : "Export PDF"}
                            >
                                {exporting ? 'Exporting...' : 'Export PDF'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !isValid}
                                className="px-4 py-1.5 rounded-md text-xs font-bold bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                title={!isValid ? "Name, Email, and Skills are required" : "Save Version"}
                            >
                                {loading ? 'Saving...' : 'Save Version'}
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Editor Content */}
                    <div className="overflow-y-auto flex-1 p-8">
                        <div className="space-y-12 max-w-3xl mx-auto">
                            {/* Personal */}
                            <section>
                                <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-blue-50 rounded-md border border-blue-100">
                                            <User className="text-blue-600" size={14} />
                                        </div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Information</h3>
                                    </div>
                                    <button
                                        onClick={handleDemoData}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-100 transition-all uppercase tracking-wider"
                                    >
                                        Auto-Fill Resume
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="label flex items-center gap-2 text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide">Name <span className="text-red-500">*</span></label>
                                        <input type="text" className={`input w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white text-sm transition-all ${errors.name ? 'border-red-500' : ''}`} value={resumeData.personal.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="Jane Doe" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="label flex items-center gap-2 text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                                        <input type="email" className={`input w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white text-sm transition-all ${errors.email ? 'border-red-500' : ''}`} value={resumeData.personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="jane@example.com" />
                                    </div>
                                    <div>
                                        <label className="label flex items-center gap-2 text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide">Phone</label>
                                        <input type="text" placeholder="+1 (555) 000-0000" className="input w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-white text-sm transition-all" value={resumeData.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="label flex items-center gap-2 text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide">Location</label>
                                        <input type="text" placeholder="City, State" className="input w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:bg-white text-sm transition-all" value={resumeData.personal.location} onChange={e => updatePersonal('location', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="label text-gray-600 text-xs font-bold mb-2 block uppercase tracking-wide">Professional Summary</label>
                                        <textarea placeholder="Brief summary of your professional background..." className="input w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white text-sm transition-all" rows="3" value={resumeData.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
                                    </div>
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-indigo-50 rounded-md border border-indigo-100">
                                            <GraduationCap className="text-indigo-600" size={14} />
                                        </div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Education</h3>
                                    </div>
                                    <button onClick={addEducation} className="text-[10px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors uppercase tracking-widest">+ Add Education</button>
                                </div>
                                {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="mb-6 grid grid-cols-2 gap-5 p-6 border border-gray-100 rounded-xl bg-white hover:border-indigo-200 transition-all shadow-sm group">
                                        <input type="text" placeholder="Institution" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-300 outline-none transition-all" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} />
                                        <input type="text" placeholder="Degree" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-300 outline-none transition-all" value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} />
                                        <input type="text" placeholder="Start Year" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-300 outline-none transition-all" value={edu.start} onChange={e => updateEducation(idx, 'start', e.target.value)} />
                                        <input type="text" placeholder="End Year" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-300 outline-none transition-all" value={edu.end} onChange={e => updateEducation(idx, 'end', e.target.value)} />
                                    </div>
                                ))}
                            </section>

                            {/* Experience */}
                            <section>
                                <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-emerald-50 rounded-md border border-emerald-100">
                                            <Briefcase className="text-emerald-600" size={14} />
                                        </div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Work Experience</h3>
                                    </div>
                                    <button onClick={addExperience} className="text-[10px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors uppercase tracking-widest">+ Add Position</button>
                                </div>
                                {resumeData.experience.map((exp, idx) => (
                                    <div key={idx} className="mb-8 p-6 border border-gray-100 rounded-xl bg-white hover:border-emerald-200 transition-all shadow-sm">
                                        <div className="grid grid-cols-2 gap-5 mb-5">
                                            <input type="text" placeholder="Company Name" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-300 outline-none transition-all" value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} />
                                            <input type="text" placeholder="Your Role" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-300 outline-none transition-all" value={exp.role} onChange={e => updateExperience(idx, 'role', e.target.value)} />
                                            <input type="text" placeholder="MM/YYYY" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-300 outline-none transition-all" value={exp.start} onChange={e => updateExperience(idx, 'start', e.target.value)} />
                                            <input type="text" placeholder="Present/YYYY" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-300 outline-none transition-all" value={exp.end} onChange={e => updateExperience(idx, 'end', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label text-[10px] font-bold text-gray-400 mb-3 block uppercase tracking-widest">Key Achievements</label>
                                            <div className="space-y-3">
                                                {exp.bullets.map((b, bIdx) => (
                                                    <div key={bIdx} className="flex gap-3 group/bullet">
                                                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-200 group-hover/bullet:bg-emerald-400 transition-colors shrink-0" />
                                                        <input type="text" className="input w-full px-3 py-2 bg-gray-50/50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-100 focus:ring-0 outline-none transition-all placeholder-gray-300" placeholder="e.g. Optimized database queries by 30%..." value={b} onChange={e => updateBullet(idx, bIdx, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => addBullet(idx)} className="text-[10px] font-bold text-gray-400 hover:text-emerald-600 ml-4.5 mt-4 transition-colors uppercase tracking-widest">+ Add Line</button>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Projects */}
                            <section>
                                <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-amber-50 rounded-md border border-amber-100">
                                            <Code className="text-amber-600" size={14} />
                                        </div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Projects</h3>
                                    </div>
                                    <button onClick={addProject} className="text-[10px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors uppercase tracking-widest">+ Add Project</button>
                                </div>
                                {(resumeData.projects || []).map((proj, idx) => (
                                    <div key={idx} className="mb-8 p-6 border border-gray-100 rounded-xl bg-white hover:border-amber-200 transition-all shadow-sm">
                                        <div className="grid grid-cols-2 gap-5 mb-5">
                                            <input type="text" placeholder="Project Name" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-amber-300 outline-none transition-all" value={proj.name} onChange={e => updateProject(idx, 'name', e.target.value)} />
                                            <input type="text" placeholder="Role (e.g. Lead Dev)" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-amber-300 outline-none transition-all" value={proj.role} onChange={e => updateProject(idx, 'role', e.target.value)} />
                                            <input type="text" placeholder="Start Date" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-amber-300 outline-none transition-all" value={proj.start} onChange={e => updateProject(idx, 'start', e.target.value)} />
                                            <input type="text" placeholder="End Date" className="input w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-amber-300 outline-none transition-all" value={proj.end} onChange={e => updateProject(idx, 'end', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="label text-[10px] font-bold text-gray-400 mb-3 block uppercase tracking-widest">Project Highlights</label>
                                            <div className="space-y-3">
                                                {proj.bullets.map((b, bIdx) => (
                                                    <div key={bIdx} className="flex gap-3 group/bullet">
                                                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-amber-200 group-hover/bullet:bg-amber-400 transition-colors shrink-0" />
                                                        <input type="text" className="input w-full px-3 py-2 bg-gray-50/50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-amber-100 focus:ring-0 outline-none transition-all placeholder-gray-300" placeholder="e.g. Integrated Stripe for payments..." value={b} onChange={e => updateProjectBullet(idx, bIdx, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => addProjectBullet(idx)} className="text-[10px] font-bold text-gray-400 hover:text-amber-600 ml-4.5 mt-4 transition-colors uppercase tracking-widest">+ Add Line</button>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Skills */}
                            <section>
                                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-gray-50">
                                    <div className="p-1.5 bg-rose-50 rounded-md border border-rose-100">
                                        <Zap className="text-rose-600" size={14} />
                                    </div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technical Skills <span className="text-red-500">*</span></h3>
                                </div>
                                <textarea
                                    placeholder="e.g. React, Node.js, Python, AWS, Docker..."
                                    className={`input w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-white text-sm transition-all leading-relaxed ${errors.skills ? 'border-red-500' : ''}`}
                                    rows="4"
                                    value={resumeData.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                />
                                <p className="mt-3 text-[10px] text-gray-400 font-medium italic">Pro tip: Separate multiple skills with commas.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Pane - Right Card */}
            <div className="w-1/2 p-6 pl-0 flex flex-col h-full">
                <div className="bg-gray-100 border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden relative flex flex-col">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200/50 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] z-10 shadow-sm flex items-center gap-2">
                        <Star size={10} className="text-amber-400 fill-amber-400" /> Live Preview <Star size={10} className="text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-12 pt-16 flex justify-center bg-gray-100/30">
                        <div className="scale-90 origin-top h-fit hover:scale-[0.92] transition-transform duration-500">
                            <ResumeViewer data={resumeData} fontStyle={fontStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
