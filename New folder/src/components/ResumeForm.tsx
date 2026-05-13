import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project, Certification } from '../types';
import { Plus, Trash2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onEnhanceBullet: (type: 'summary' | 'bullet', text: string, context?: string) => void;
}

const TABS = [
  { id: 'personal', label: 'Personal' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certs' }
];

const ResumeForm: React.FC<Props> = ({ data, setData, onEnhanceBullet }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const handlePI = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const addExp = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', position: '', duration: '', location: '', highlights: [''] };
    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const updExp = (id: string, field: keyof Experience, value: any) => {
    setData(prev => ({ ...prev, experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  };

  const rmExp = (id: string) => setData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));

  const addHL = (id: string) => setData(prev => ({ ...prev, experiences: prev.experiences.map(e => e.id === id ? { ...e, highlights: [...e.highlights, ''] } : e) }));
  const updHL = (id: string, idx: number, value: string) => setData(prev => ({ ...prev, experiences: prev.experiences.map(e => e.id === id ? { ...e, highlights: e.highlights.map((h, i) => i === idx ? value : h) } : e) }));
  const rmHL = (id: string, idx: number) => setData(prev => ({ ...prev, experiences: prev.experiences.map(e => e.id === id ? { ...e, highlights: e.highlights.filter((_, i) => i !== idx) } : e) }));

  const addEdu = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', duration: '', location: '' };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };
  const updEdu = (id: string, field: keyof Education, value: string) => setData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const rmEdu = (id: string) => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

  const updSkillCat = (id: string, value: string) => setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, category: value } : s) }));
  const updSkillItems = (id: string, value: string) => setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, items: value.split(',').map(i => i.trim()).filter(Boolean) } : s) }));

  const addProj = () => {
    const newProj: Project = { id: Date.now().toString(), title: '', description: '', technologies: [] };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };
  const updProj = (id: string, field: keyof Project, value: any) => {
    if (field === 'technologies') value = value.split(',').map((t: string) => t.trim()).filter(Boolean);
    setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p) }));
  };
  const rmProj = (id: string) => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));

  const addCert = () => {
    const newCert: Certification = { id: Date.now().toString(), name: '', issuer: '', date: '' };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };
  const updCert = (id: string, field: keyof Certification, value: string) => setData(prev => ({ ...prev, certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  const rmCert = (id: string) => setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));

  const tabIdx = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2 mb-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === t.id ? 'bg-indigo-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'personal' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="fullName" value={data.personalInfo.fullName} onChange={handlePI} placeholder="Full Name" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePI} placeholder="Desired Job Title" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="email" value={data.personalInfo.email} onChange={handlePI} placeholder="Email" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="phone" value={data.personalInfo.phone} onChange={handlePI} placeholder="Phone" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="location" value={data.personalInfo.location} onChange={handlePI} placeholder="Location" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="linkedin" value={data.personalInfo.linkedin} onChange={handlePI} placeholder="LinkedIn" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="website" value={data.personalInfo.website} onChange={handlePI} placeholder="Website / Portfolio" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2" />
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Professional Summary</label>
                <button onClick={() => onEnhanceBullet('summary', data.summary, data.personalInfo.jobTitle)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                  <Sparkles size={12} /> AI Enhance
                </button>
              </div>
              <textarea value={data.summary} onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief summary of your career and skills..." rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-3">
            <button onClick={addExp} className="flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              <Plus size={14} /> Add Experience
            </button>
            {data.experiences.map(exp => (
              <div key={exp.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex justify-end"><button onClick={() => rmExp(exp.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button></div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={exp.position} onChange={(e) => updExp(exp.id, 'position', e.target.value)} placeholder="Position" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={exp.company} onChange={(e) => updExp(exp.id, 'company', e.target.value)} placeholder="Company" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={exp.duration} onChange={(e) => updExp(exp.id, 'duration', e.target.value)} placeholder="Jan 2021 - Present" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={exp.location} onChange={(e) => updExp(exp.id, 'location', e.target.value)} placeholder="Location" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Achievements</label>
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex gap-1">
                      <input value={h} onChange={(e) => updHL(exp.id, i, e.target.value)} placeholder="Achievement bullet..." className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                      <button onClick={() => onEnhanceBullet('bullet', h, exp.position)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"><Sparkles size={12} /></button>
                      <button onClick={() => rmHL(exp.id, i)} className="p-1.5 text-rose-500"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => addHL(exp.id)} className="text-[10px] font-semibold text-slate-500 hover:text-slate-700"><Plus size={10} className="inline" /> Add bullet</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-3">
            <button onClick={addEdu} className="flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              <Plus size={14} /> Add Education
            </button>
            {data.education.map(edu => (
              <div key={edu.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex justify-end"><button onClick={() => rmEdu(edu.id)} className="text-rose-500"><Trash2 size={14} /></button></div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={edu.school} onChange={(e) => updEdu(edu.id, 'school', e.target.value)} placeholder="School" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={edu.degree} onChange={(e) => updEdu(edu.id, 'degree', e.target.value)} placeholder="Degree" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={edu.duration} onChange={(e) => updEdu(edu.id, 'duration', e.target.value)} placeholder="2017 - 2021" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={edu.gpa || ''} onChange={(e) => updEdu(edu.id, 'gpa', e.target.value)} placeholder="GPA (optional)" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-3">
            {data.skills.map(g => (
              <div key={g.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <input value={g.category} onChange={(e) => updSkillCat(g.id, e.target.value)} placeholder="Category" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-semibold bg-white" />
                <input value={g.items.join(', ')} onChange={(e) => updSkillItems(g.id, e.target.value)} placeholder="Skills, comma separated..." className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3">
            <button onClick={addProj} className="flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              <Plus size={14} /> Add Project
            </button>
            {data.projects.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex justify-end"><button onClick={() => rmProj(p.id)} className="text-rose-500"><Trash2 size={14} /></button></div>
                <input value={p.title} onChange={(e) => updProj(p.id, 'title', e.target.value)} placeholder="Project Title" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                <textarea value={p.description} onChange={(e) => updProj(p.id, 'description', e.target.value)} placeholder="Description..." rows={2} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                <input value={p.technologies.join(', ')} onChange={(e) => updProj(p.id, 'technologies', e.target.value)} placeholder="Technologies (comma separated)" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-3">
            <button onClick={addCert} className="flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
              <Plus size={14} /> Add Certification
            </button>
            {data.certifications.map(c => (
              <div key={c.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex justify-end"><button onClick={() => rmCert(c.id)} className="text-rose-500"><Trash2 size={14} /></button></div>
                <div className="grid grid-cols-3 gap-2">
                  <input value={c.name} onChange={(e) => updCert(c.id, 'name', e.target.value)} placeholder="Name" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={c.issuer} onChange={(e) => updCert(c.id, 'issuer', e.target.value)} placeholder="Issuer" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                  <input value={c.date} onChange={(e) => updCert(c.id, 'date', e.target.value)} placeholder="Date" className="px-2 py-1.5 border border-slate-200 rounded text-xs bg-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
        <button onClick={() => tabIdx > 0 && setActiveTab(TABS[tabIdx - 1].id)} disabled={tabIdx === 0}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg ${tabIdx === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}`}>
          <ChevronLeft size={14} /> Previous
        </button>
        <button onClick={() => tabIdx < TABS.length - 1 && setActiveTab(TABS[tabIdx + 1].id)} disabled={tabIdx === TABS.length - 1}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg ${tabIdx === TABS.length - 1 ? 'text-slate-300' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
