import { Mail, Phone, MapPin } from 'lucide-react';

export default function ResumeViewer({ data, fontStyle = 'modern' }) {
    if (!data) return <div className="p-10 text-gray-500">No resume data provided.</div>;

    const { personal, education, experience, projects, skills } = data;

    const fontClasses = {
        modern: 'font-sans',
        classic: 'font-serif',
        technical: 'font-mono'
    };

    // Check if the resume is effectively empty to show the prompt
    const isEmpty = !personal.name && !personal.email && !personal.phone && education.length === 0 && experience.length === 0;

    if (isEmpty) {
        return (
            <div className={`w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg ${fontClasses[fontStyle]} flex items-center justify-center p-10 text-center`}>
                <div className="text-gray-400">
                    <p className="text-lg font-medium mb-2">Start filling the form to see your resume preview</p>
                    <p className="text-sm">Your resume will appear here in real-time.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-[210mm] min-h-[297mm] mx-auto bg-white p-10 shadow-lg ${fontClasses[fontStyle]}`}>
            {/* Personal Header */}
            <header className="border-b-2 border-gray-800 pb-5 mb-5">
                <h1 className="text-4xl font-bold uppercase tracking-wider">{personal?.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 items-center">
                    {personal?.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail size={14} />
                            {personal.email}
                        </span>
                    )}
                    {personal?.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone size={14} />
                            {personal.phone}
                        </span>
                    )}
                    {personal?.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {personal.location}
                        </span>
                    )}
                </div>
                {personal?.summary && <p className="mt-4 text-gray-700 leading-relaxed">{personal.summary}</p>}
            </header>

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{edu.institution}</h3>
                                    <span className="text-sm text-gray-500">{edu.start} - {edu.end}</span>
                                </div>
                                <div>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-lg">{exp.company}</h3>
                                    <span className="text-sm text-gray-500">{exp.start} - {exp.end || 'Present'}</span>
                                </div>
                                <div className="italic text-gray-700 mb-1">{exp.role}</div>
                                <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-700">
                                    {exp.bullets?.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-lg">{proj.name}</h3>
                                    <span className="text-sm text-gray-500">{proj.start} - {proj.end}</span>
                                </div>
                                <div className="italic text-gray-700 mb-1">{proj.role}</div>
                                <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-700">
                                    {proj.bullets?.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1">Skills</h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-gray-700">{skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
