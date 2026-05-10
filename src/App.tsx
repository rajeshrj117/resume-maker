import { useState } from 'react';
import {
  ResumeData,
  TemplateId,
  ThemeColor,
  FontSettings,
  FONT_FAMILIES,
} from './types';
import { INITIAL_RESUME_DATA, JOB_PROFILES } from './constants/jobProfiles';
import { THEME_COLORS } from './constants/themes';
import { generateWithAI } from './utils/aiHelper';

import JobPicker from './components/JobPicker';
import TemplatePicker from './components/TemplatePicker';
import ThemePicker from './components/ThemePicker';
import PhotoUpload from './components/PhotoUpload';
import FontPicker from './components/FontPicker';
import ResumeForm from './components/ResumeForm';
import AllTemplates from './templates/AllTemplates';

import ResumeParser, { ParsedResumeData } from './components/ResumeParser';
import { mapParsedToResumeData } from './utils/mapParsedData';
import { Sparkles, Download, RefreshCw, Check, Loader2 } from 'lucide-react';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(THEME_COLORS[0]);
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: FONT_FAMILIES[0].value,
    size: 'normal',
  });

  // If you use an API key, put it here / env var
  const [apiKey] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalData, setAiModalData] = useState({
    type: '' as 'summary' | 'bullet' | '',
    original: '',
    enhanced: '',
  });

  const [showParserModal, setShowParserModal] = useState(false);

  const handleApplyProfile = (profileId: string) => {
    const profile = JOB_PROFILES[profileId];
    if (!profile) return;

    setResumeData({
      personalInfo: {
        fullName: 'Jane Doe',
        email: 'janedoe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/janedoe',
        website: 'janedoe.dev',
        jobTitle: profile.title,
        photo: resumeData.personalInfo.photo,
      },
      summary: profile.suggestedSummary,
      experiences: [
        {
          id: '1',
          company: 'Acme Technologies',
          position: profile.title,
          duration: 'Jan 2021 - Present',
          location: 'San Francisco, CA',
          highlights: profile.suggestedHighlights,
        },
        {
          id: '2',
          company: 'TechStart Inc.',
          position: `Junior ${profile.title}`,
          duration: 'Jun 2018 - Dec 2020',
          location: 'Remote',
          highlights: [
            'Contributed to major product launches and feature development.',
            'Collaborated with cross-functional teams to deliver business solutions.',
          ],
        },
      ],
      education: [
        {
          id: '1',
          school: 'State University',
          degree: 'B.S. in Computer Science',
          duration: '2014 - 2018',
          location: 'Austin, TX',
          gpa: '3.9/4.0',
        },
      ],
      skills: [
        { id: '1', category: 'Technical Skills', items: profile.suggestedSkills.slice(0, 6) },
        { id: '2', category: 'Soft Skills', items: ['Leadership', 'Communication', 'Problem Solving'] },
      ],
      projects: [
        {
          id: '1',
          title: 'Intelligent App Suite',
          description: 'Built an advanced dashboard suite mapping targets against relevant performance models.',
          technologies: profile.suggestedSkills.slice(0, 3),
        },
      ],
      certifications: [{ id: '1', name: 'Expert Level Certification', issuer: 'Industry Board', date: 'Aug 2022' }],
    });
  };

  const handleEnhanceWithAI = async (
    type: 'summary' | 'bullet',
    text: string,
    context?: string
  ) => {
    setIsAILoading(true);

    const prompt =
      type === 'summary'
        ? `Write a compelling, professional resume summary for a ${context || 'professional'}.
Current draft: "${text}"
Make it powerful and concise (3-5 lines).`
        : `Rewrite this resume experience bullet to be highly descriptive and performance-oriented with concrete metrics.
Context: ${context || 'Work experience'}
Current bullet: "${text}"
Return one improved bullet sentence.`;

    try {
      const enhanced = await generateWithAI(prompt, apiKey);
      setAiModalData({ type, original: text, enhanced });
      setShowAIModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAILoading(false);
    }
  };

  const acceptAIEnhancement = () => {
    if (aiModalData.type === 'summary') {
      setResumeData(prev => ({ ...prev, summary: aiModalData.enhanced }));
    } else {
      setResumeData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp => ({
          ...exp,
          highlights: exp.highlights.map(h => (h === aiModalData.original ? aiModalData.enhanced : h)),
        })),
      }));
    }
    setShowAIModal(false);
  };

  const handleDataExtracted = (parsed: ParsedResumeData) => {
    setResumeData(prev => mapParsedToResumeData(parsed, prev));
    setShowParserModal(false);
    alert('Resume data imported successfully!');
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const element = document.getElementById('resume-document');
      if (!element) throw new Error('Resume element not found');
  
      // 🔥 REMOVE preview scaling BEFORE export
      const wrapper = element.parentElement;
      if (wrapper) wrapper.style.transform = 'scale(1)';
  
      const cleanName = (resumeData.personalInfo.fullName || 'My').replace(/[^a-zA-Z0-9]/g, '_');
  
      await html2pdf()
        .from(element)
        .set({
          margin: 0,
          filename: `${cleanName}_Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 1.5,   // 🔥 CHANGE 2 → 1.5
            useCORS: true,
            backgroundColor: '#ffffff',
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: {
            mode: ['avoid-all'], // 🔥 IMPORTANT
          },
        })
        .save();
  
      // restore preview scale
      if (wrapper) wrapper.style.transform = '';
    } catch (e) {
      console.error('PDF Error:', e);
      alert('PDF download had an issue. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    if (confirm('Clear all data?')) setResumeData(INITIAL_RESUME_DATA);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
              <Sparkles size={22} />
            </div>
        
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParserModal(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl font-semibold text-sm"
            >
              Upload Old Resume
            </button>
<div className='hidden lg:block'>
            <button
              onClick={resetForm}
              className="flex  items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200"
            >
              <RefreshCw size={16} /> Reset
            </button></div>

            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-md disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 xl:grid-cols-12 gap-6 print:p-0 print:block">
      <div className="xl:col-span-5 flex flex-col gap-4 print:hidden">
      <div className="order-1">
  <JobPicker onApplyProfile={handleApplyProfile} />
</div>

<div className="order-5 xl:order-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhotoUpload
              photo={resumeData.personalInfo.photo}
              onChange={photo =>
                setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, photo },
                }))
              }
            />
            <ThemePicker selected={selectedTheme} onSelect={setSelectedTheme} />
          </div>

          <div className="order-3 xl:order-3">
          <FontPicker settings={fontSettings} onChange={setFontSettings} />
        </div>
          <div className="order-4 xl:order-4">
          <TemplatePicker
            selectedId={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        </div>
          <div className="order-2 xl:order-5">
          <ResumeForm
            data={resumeData}
            setData={setResumeData}
            onEnhanceBullet={handleEnhanceWithAI}
          />
        </div>
        </div>

        <div className="xl:col-span-7 bg-slate-200/50 rounded-2xl p-3 border border-slate-200 overflow-auto max-h-[calc(100vh-100px)] xl:sticky xl:top-20 print:bg-transparent print:p-0 print:max-h-none print:static">
        <div className="preview-wrapper origin-top mx-auto w-fit print:scale-100">
            <AllTemplates
              data={resumeData}
              theme={selectedTheme}
              templateId={selectedTemplate}
              fontSettings={fontSettings}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </main>

      {/* AI Enhancement Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600" size={22} />
              <h3 className="text-lg font-bold">AI Enhancement Result</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Original</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg italic text-slate-600 mt-1">
                  {aiModalData.original || '— Empty —'}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-1">
                  <Check size={12} /> Enhanced
                </span>
                <p className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-medium mt-1">
                  {aiModalData.enhanced}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
              >
                Discard
              </button>
              <button
                onClick={acceptAIEnhancement}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PDF + DOCX Parser Modal */}
      {showParserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-2">Parse Old Resume</h2>
              <p className="text-slate-600 mb-6">Upload your old PDF/DOCX resume or paste the text below</p>

              <ResumeParser
                onDataExtracted={handleDataExtracted}
                onClose={() => setShowParserModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isAILoading && (
        <div className="fixed bottom-4 right-4 bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-2 text-sm print:hidden">
          AI working...
        </div>
      )}
    </div>
  );
}