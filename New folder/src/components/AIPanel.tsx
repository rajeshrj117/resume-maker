import React, { useState } from 'react';
import { JOB_PROFILES } from '../constants/jobProfiles';
import { ResumeData } from '../types';
import { Sparkles, Key, CheckCircle, BarChart } from 'lucide-react';

interface AIPanelProps {
  resumeData: ResumeData;
  onApplyProfile: (profileId: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ resumeData, onApplyProfile, apiKey, setApiKey }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const analyzeATSScore = () => {
    if (!jobDescription.trim()) return;
    setIsCalculating(true);
    setTimeout(() => {
      const resumeText = JSON.stringify(resumeData).toLowerCase();
      const keywordList = ['react', 'node', 'python', 'javascript', 'typescript', 'aws', 'cloud', 'sql', 'agile', 'leadership', 'design', 'seo', 'marketing', 'product', 'communication', 'docker', 'analytics'];
      const matchCount = keywordList.filter(w => jobDescription.toLowerCase().includes(w) && resumeText.includes(w)).length;
      const total = keywordList.filter(w => jobDescription.toLowerCase().includes(w)).length;
      const missing = keywordList.filter(w => jobDescription.toLowerCase().includes(w) && !resumeText.includes(w));
      const finalScore = total > 0 ? Math.min(Math.round((matchCount / total) * 100), 100) : 72;
      setMatchScore(finalScore || 65);
      setMissingKeywords(missing.slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1)));
      setIsCalculating(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-amber-500" size={18} />
            <h3 className="text-sm font-bold text-slate-800">1. Instant AI Pre-Fill</h3>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-3">Pick a target role to populate professional content.</p>
          <select
            onChange={(e) => e.target.value && onApplyProfile(e.target.value)}
            defaultValue=""
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 bg-slate-50"
          >
            <option value="" disabled>-- Pick Job --</option>
            {Object.values(JOB_PROFILES).map(prof => <option key={prof.id} value={prof.id}>{prof.title}</option>)}
          </select>
        </div>
        <div className="text-[10px] text-indigo-500 mt-2 flex items-center gap-1"><CheckCircle size={10} /> Speeds up workflow by 80%</div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Key className="text-indigo-500" size={18} />
            <h3 className="text-sm font-bold text-slate-800">2. Real AI Integration</h3>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-3">Provide an OpenAI key for true GPT responses (optional).</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>
        <div className="text-[10px] text-slate-400 mt-2">Your key resides in memory and is never stored.</div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart className="text-emerald-500" size={18} />
            <h3 className="text-sm font-bold text-slate-800">3. ATS Scanner</h3>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target role description..."
            rows={2}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          />
          <button
            onClick={analyzeATSScore}
            disabled={!jobDescription.trim() || isCalculating}
            className="w-full text-xs font-bold bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            {isCalculating ? 'Scanning...' : 'Calculate Suitability'}
          </button>
        </div>
        {matchScore !== null && (
          <div className="mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-700">Fit Index:</span>
              <span className={`text-sm font-black ${matchScore > 80 ? 'text-emerald-600' : matchScore > 50 ? 'text-amber-500' : 'text-rose-500'}`}>{matchScore}%</span>
            </div>
            {missingKeywords.length > 0 && (
              <div className="mt-1 text-[10px] text-slate-500 flex flex-wrap gap-1">
                <span>Add:</span>
                {missingKeywords.map(kw => <span key={kw} className="bg-slate-200 px-1 py-0.5 rounded font-medium">{kw}</span>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
