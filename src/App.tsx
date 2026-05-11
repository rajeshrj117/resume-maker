
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
import {
  Sparkles, Download, RefreshCw, Check, Loader2,
  Target, AlertCircle, XCircle, Key, CheckCircle2,
  PlusCircle, Wand2, X, Info, TrendingUp
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────
interface ATSResult {
  atsScore: number;
  breakdown: {
    keywordMatch: number;
    experienceQuality: number;
    sectionCompleteness: number;
    formatScore: number;
  };
  missingCriticalKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
  debugInfo: {
    totalJDKeywords: number;
    totalResumeWords: number;
    resumeSections: string[];
  };
}

interface QuickAddItem {
  type: 'skill' | 'summary_keyword' | 'experience_bullet';
  label: string;
  description: string;
  value: string;
  category?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CRITICAL FIX: Plain text extractor — strips ALL JSON from AI responses
// ═══════════════════════════════════════════════════════════════════════════
function extractPlainText(raw: string): string | null {
  if (!raw?.trim()) return null;
  let text = raw.trim();

  // Remove markdown code blocks entirely
  text = text.replace(/```[\s\S]*?```/g, '').trim();

  // If it's clearly JSON — try to salvage a useful string from it
  if (text.startsWith('{') || text.startsWith('[')) {
    // Try "suggestions" array first
    const sugMatch = text.match(/"suggestions"\s*:\s*\[\s*"([^"]{20,})"/);
    if (sugMatch) return sugMatch[1];

    // Try any long string value
    const allStrings = [...text.matchAll(/"([^"]{25,})"/g)]
      .map(m => m[1])
      .filter(s => !s.includes('atsScore') && !s.includes('keywordMatch') && !s.includes('breakdown') && !s.includes('http'));

    if (allStrings.length > 0) {
      return allStrings.sort((a, b) => b.length - a.length)[0];
    }

    // Last resort: strip all JSON syntax
    return text
      .replace(/[{}\[\]"]/g, ' ')
      .replace(/\b(atsScore|keywordMatch|experienceQuality|sectionCompleteness|formatScore|breakdown|missingCriticalKeywords|matchedKeywords|suggestions)\b\s*:\s*[\d\w"[\]{},]*/g, '')
      .replace(/\s+/g, ' ')
      .trim() || null;
  }

  // Remove any leftover JSON fragments from otherwise good text
  text = text
    .replace(/\{[^}]{0,200}\}/g, '')
    .replace(/\[[^\]]{0,200}\]/g, '')
    .replace(/"[a-z]+"\s*:\s*[\d"[{]/gi, '')
    .replace(/^\s*["']|["']\s*$/g, '') // strip surrounding quotes
    .trim();

  return text.length > 10 ? text : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: PURE CLIENT-SIDE TEXT EXTRACTION (NO AI)
// ═══════════════════════════════════════════════════════════════════════════
const STOP_WORDS = new Set([
  'the','and','for','with','that','this','have','from','are','will',
  'you','your','our','their','they','been','has','was','were','not',
  'but','can','all','also','its','into','more','who','may','any',
  'both','each','such','than','then','when','where','while','which',
  'would','could','should','must','shall','able','need','make','use',
  'work','team','strong','good','great','etc','per','via','yet','own',
  'new','get','how','one','two','three','us','or','if','in','on',
  'at','to','of','a','an','is','it','be','do','as','by','we','i',
  'he','she','they','his','her','him','me','my','no','up','so',
  'job','role','position','candidate','looking','seeking','experience',
  'working','across','within','well','other','about','over','year',
  'years','day','days','time','able','ability','skills','skill',
  'required','requirement','requirements','preferred','plus','bonus',
  'minimum','maximum','least','most','highly','very','key',
  'responsible','responsibilities','qualifications','qualified',
  'including','such','will','who','what','when','where','why','how',
  'been','have','had','did','does','doing','done','make','made',
  'take','taken','come','came','give','given','know','known',
  'think','thought','want','use','used','using','find','found',
  'tell','told','become','became','show','showed','shown',
]);

function extractSingleKeywords(text: string): string[] {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/c\+\+/g, 'cplusplus')
      .replace(/c#/g, 'csharp')
      .replace(/\.net/g, 'dotnet')
      .replace(/next\.js/gi, 'nextjs')
      .replace(/node\.js/gi, 'nodejs')
      .replace(/vue\.js/gi, 'vuejs')
      .replace(/react\.js/gi, 'reactjs')
      .replace(/[^a-z0-9\s\-+#]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  )];
}

function extractPhrases(text: string): string[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ').filter(w => w.length > 1);
  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (!STOP_WORDS.has(words[i]) || !STOP_WORDS.has(words[i + 1])) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  }
  return [...new Set(phrases)];
}

function buildResumeTextFromData(data: ResumeData): { fullText: string; sections: string[] } {
  const sections: string[] = [];
  const parts: string[] = [];
  const { personalInfo, summary, experiences, skills, projects, certifications, education } = data;

  if (personalInfo.fullName?.trim()) { parts.push(personalInfo.fullName); sections.push('Name'); }
  if (personalInfo.jobTitle?.trim()) { parts.push(personalInfo.jobTitle); sections.push('Job Title'); }
  if (personalInfo.location?.trim()) parts.push(personalInfo.location);
  if (personalInfo.linkedin?.trim()) parts.push(personalInfo.linkedin);

  if (summary?.trim()) { parts.push(summary); sections.push('Summary'); }

  if (experiences.length > 0) {
    sections.push('Experience');
    experiences.forEach(exp => {
      if (exp.position?.trim()) parts.push(exp.position);
      if (exp.company?.trim()) parts.push(exp.company);
      if (exp.location?.trim()) parts.push(exp.location);
      (exp.highlights || []).forEach(h => { if (h?.trim()) parts.push(h); });
    });
  }

  if (skills.length > 0) {
    sections.push('Skills');
    skills.forEach(sg => {
      if (sg.category?.trim()) parts.push(sg.category);
      (sg.items || []).forEach(item => { if (item?.trim()) parts.push(item); });
    });
  }

  if (projects && projects.length > 0) {
    sections.push('Projects');
    projects.forEach(p => {
      if (p.title?.trim()) parts.push(p.title);
      if (p.description?.trim()) parts.push(p.description);
      (p.technologies || []).forEach(t => { if (t?.trim()) parts.push(t); });
    });
  }

  if (education && education.length > 0) {
    sections.push('Education');
    education.forEach(e => {
      if (e.school?.trim()) parts.push(e.school);
      if (e.degree?.trim()) parts.push(e.degree);
    });
  }

  if (certifications && certifications.length > 0) {
    sections.push('Certifications');
    certifications.forEach(c => {
      if (c.name?.trim()) parts.push(c.name);
      if (c.issuer?.trim()) parts.push(c.issuer);
    });
  }

  return { fullText: parts.join(' ').toLowerCase(), sections };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: SCORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
function scoreKeywordMatch(resumeFullText: string, jobDescription: string) {
  const jdKeywords = extractSingleKeywords(jobDescription);
  const jdPhrases = extractPhrases(jobDescription);
  const resumeKeywords = extractSingleKeywords(resumeFullText);
  const resumeSet = new Set(resumeKeywords);
  const matched: string[] = [];
  const missing: string[] = [];
  let singleMatched = 0;

  jdKeywords.forEach(kw => {
    if (resumeSet.has(kw) || resumeFullText.includes(kw)) {
      singleMatched++;
      if (kw.length > 3) matched.push(kw);
    } else {
      if (kw.length > 3) missing.push(kw);
    }
  });

  let phraseMatched = 0;
  const importantPhrases = jdPhrases.filter(p => p.split(' ').some(w => !STOP_WORDS.has(w) && w.length > 3)).slice(0, 50);
  importantPhrases.forEach(phrase => { if (resumeFullText.includes(phrase)) phraseMatched++; });

  const singleScore = jdKeywords.length > 0 ? (singleMatched / jdKeywords.length) * 100 : 0;
  const phraseScore = importantPhrases.length > 0 ? (phraseMatched / importantPhrases.length) * 100 : singleScore;
  const finalScore = Math.round(singleScore * 0.6 + phraseScore * 0.4);

  return {
    score: Math.min(100, finalScore),
    matched: [...new Set(matched)].slice(0, 25),
    missing: [...new Set(missing)].slice(0, 20),
  };
}

function scoreExperienceQuality(data: ResumeData): number {
  const { experiences } = data;
  if (!experiences.length) return 0;
  let score = Math.min(25, experiences.length * 12);
  const metricPattern = /\b\d+\s*(%|percent|x|times|users|clients|k\b|million|billion|\$|hours|days|weeks|months|years|ms|seconds|projects|features|engineers|developers|members|teams|systems|services|apis|endpoints)\b/i;
  const actionVerbPattern = /^(led|built|developed|designed|implemented|created|managed|increased|reduced|improved|optimized|launched|delivered|achieved|scaled|automated|architected|engineered|collaborated|mentored|migrated|integrated|deployed|established|streamlined|spearheaded|orchestrated|pioneered|transformed|drove|generated|saved|boosted|accelerated|enhanced)/i;
  let totalBullets = 0, bulletsWithMetrics = 0, bulletsWithActionVerbs = 0, longBullets = 0;

  experiences.forEach(exp => {
    const bullets = (exp.highlights || []).filter(h => h?.trim());
    totalBullets += bullets.length;
    bullets.forEach(bullet => {
      if (metricPattern.test(bullet)) bulletsWithMetrics++;
      if (actionVerbPattern.test(bullet.trim())) bulletsWithActionVerbs++;
      if (bullet.trim().split(/\s+/).length >= 8) longBullets++;
    });
  });

  if (totalBullets > 0) {
    score += Math.round((bulletsWithMetrics / totalBullets) * 35);
    score += Math.round((bulletsWithActionVerbs / totalBullets) * 25);
    score += Math.round((longBullets / totalBullets) * 15);
  }
  return Math.min(100, score);
}

function scoreSectionCompleteness(data: ResumeData): number {
  let score = 0;
  const { personalInfo, summary, experiences, skills, education, projects, certifications } = data;
  if (personalInfo.fullName?.trim()) score += 5;
  if (personalInfo.email?.trim()) score += 5;
  if (personalInfo.phone?.trim()) score += 5;
  if (personalInfo.jobTitle?.trim()) score += 5;
  if (personalInfo.location?.trim()) score += 3;
  if (personalInfo.linkedin?.trim()) score += 2;
  const summaryWordCount = (summary || '').trim().split(/\s+/).filter(Boolean).length;
  if (summaryWordCount > 0) score += 8;
  if (summaryWordCount >= 20) score += 7;
  if (summaryWordCount >= 40) score += 5;
  if (experiences.length > 0) score += 8;
  if (experiences.length >= 2) score += 5;
  if (experiences.length >= 3) score += 2;
  const totalBullets = experiences.reduce((sum, e) => sum + (e.highlights?.filter(h => h?.trim()).length || 0), 0);
  if (totalBullets >= 3) score += 5;
  if (totalBullets >= 6) score += 5;
  const allSkills = skills.flatMap(s => s.items.filter(i => i?.trim()));
  if (allSkills.length > 0) score += 5;
  if (allSkills.length >= 5) score += 5;
  if (allSkills.length >= 10) score += 5;
  if (education && education.length > 0) score += 10;
  if (projects && projects.length > 0) score += 3;
  if (certifications && certifications.length > 0) score += 2;
  return Math.min(100, score);
}

function scoreFormat(data: ResumeData): number {
  let score = 0;
  const { personalInfo, experiences } = data;
  if (personalInfo.email?.includes('@')) score += 20;
  if (personalInfo.phone?.trim()) score += 20;
  if (personalInfo.linkedin?.trim()) score += 15;
  if (personalInfo.location?.trim()) score += 10;
  const expsWithDates = experiences.filter(e => e.duration?.trim()).length;
  if (experiences.length > 0) score += Math.round((expsWithDates / experiences.length) * 25);
  else score += 10;
  if (personalInfo.website?.trim()) score += 10;
  return Math.min(100, score);
}

function runATSEngine(resumeData: ResumeData, jobDescription: string): Omit<ATSResult, 'suggestions'> {
  const { fullText: resumeFullText, sections } = buildResumeTextFromData(resumeData);
  const keywordResult = scoreKeywordMatch(resumeFullText, jobDescription);
  const experienceQuality = scoreExperienceQuality(resumeData);
  const sectionCompleteness = scoreSectionCompleteness(resumeData);
  const formatScore = scoreFormat(resumeData);
  const atsScore = Math.round(
    keywordResult.score * 0.45 + experienceQuality * 0.25 + sectionCompleteness * 0.20 + formatScore * 0.10
  );
  const jdKeywords = extractSingleKeywords(jobDescription);
  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    breakdown: { keywordMatch: keywordResult.score, experienceQuality, sectionCompleteness, formatScore },
    matchedKeywords: keywordResult.matched,
    missingCriticalKeywords: keywordResult.missing,
    debugInfo: { totalJDKeywords: jdKeywords.length, totalResumeWords: resumeFullText.split(/\s+/).filter(Boolean).length, resumeSections: sections },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: AI SUGGESTIONS ONLY
// ═══════════════════════════════════════════════════════════════════════════
async function fetchAISuggestionsOnly(resumeData: ResumeData, jobDescription: string, realScores: Omit<ATSResult, 'suggestions'>, apiKey: string): Promise<string[]> {
  const { fullText: resumeText } = buildResumeTextFromData(resumeData);
  const prompt = `You are a resume writing coach. Give 4 specific writing improvement tips.

Context:
- ATS Score: ${realScores.atsScore}% (already calculated, do not change)
- Missing keywords: ${realScores.missingCriticalKeywords.slice(0, 8).join(', ')}
- Resume sections: ${realScores.debugInfo.resumeSections.join(', ')}
- Resume excerpt: """${resumeText.slice(0, 800)}"""
- Job description: """${jobDescription.slice(0, 400)}"""

Return ONLY this exact format (a JSON array of 4 plain strings, no markdown, no objects):
["tip1", "tip2", "tip3", "tip4"]`;

  try {
    const raw = await generateWithAI(prompt, apiKey);
    if (raw.includes('"atsScore"') || raw.includes('"breakdown"')) return generateLocalSuggestions(realScores, resumeData);
    const cleaned = raw.replace(/```[\s\S]*?```/g, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(cleaned.substring(start, end + 1));
      if (Array.isArray(parsed) && parsed.every(i => typeof i === 'string')) return parsed.slice(0, 5);
    }
  } catch (e) { console.warn('AI suggestions failed:', e); }
  return generateLocalSuggestions(realScores, resumeData);
}

function generateLocalSuggestions(result: Omit<ATSResult, 'suggestions'>, data: ResumeData): string[] {
  const tips: string[] = [];
  const { breakdown, missingCriticalKeywords } = result;
  if (breakdown.keywordMatch < 70) tips.push(`Keyword match is ${breakdown.keywordMatch}% — add these to skills or summary: ${missingCriticalKeywords.slice(0, 5).join(', ')}.`);
  if (breakdown.experienceQuality < 75) tips.push('Add measurable metrics to bullets: "Reduced load time by 40%", "Led team of 6 engineers", "Served 10K+ users".');
  if (!data.summary?.trim()) tips.push('Add a 40-60 word professional summary — it\'s heavily weighted in ATS scoring.');
  if (!data.personalInfo.linkedin?.trim()) tips.push('Add your LinkedIn URL to contact info — ATS systems check for this.');
  if (!data.projects?.length) tips.push('Add a Projects section with 2-3 projects listing technologies used.');
  const allSkills = data.skills.flatMap(s => s.items.filter(i => i?.trim()));
  if (allSkills.length < 8) tips.push(`Only ${allSkills.length} skills listed — add more from the job description.`);
  return tips.slice(0, 5);
}

function buildQuickAddItems(missingKeywords: string[], resumeData: ResumeData): QuickAddItem[] {
  const items: QuickAddItem[] = [];
  const existingSkillsLower = new Set(resumeData.skills.flatMap(s => s.items.map(i => i.toLowerCase().trim())));
  const { fullText: resumeText } = buildResumeTextFromData(resumeData);
  const techSkillPattern = /^(react|angular|vue|nuxt|next|node|python|java|typescript|javascript|sql|aws|azure|gcp|docker|kubernetes|git|figma|photoshop|illustrator|sketch|tableau|excel|css|html|sass|scss|redux|graphql|rest|api|mongodb|postgresql|mysql|sqlite|linux|agile|scrum|jira|jenkins|ci|cd|tensorflow|pytorch|flutter|swift|kotlin|rust|golang|php|ruby|rails|django|flask|fastapi|webpack|vite|jest|cypress|selenium|terraform|ansible|kafka|redis|elasticsearch|firebase|supabase|stripe|oauth|jwt|nextjs|nodejs|vuejs|reactjs|typescript|bootstrap|tailwind|materialui|mui|chakra|styled|prisma|drizzle|trpc|zustand|mobx|rxjs|webpack|babel|eslint|prettier|storybook|chromatic|vercel|netlify|heroku|digitalocean)/i;

  missingKeywords.forEach(kw => {
    const kwLower = kw.toLowerCase().trim();
    if (existingSkillsLower.has(kwLower) || resumeText.includes(kwLower)) return;
    if (techSkillPattern.test(kwLower) || kw.length <= 15) {
      const display = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!items.some(i => i.value.toLowerCase() === kwLower)) {
        items.push({ type: 'skill', label: display, description: `Add "${display}" to Technical Skills`, value: display, category: 'Technical Skills' });
      }
    } else {
      items.push({ type: 'summary_keyword', label: kw, description: `Mention "${kw}" in your summary`, value: kw });
    }
  });

  if (!resumeData.summary?.trim()) {
    items.unshift({ type: 'summary_keyword', label: '📝 Generate Professional Summary', description: 'Missing summary — hurts ATS score significantly', value: '__generate_summary__' });
  } else if (resumeData.summary.trim().split(/\s+/).length < 25) {
    items.unshift({ type: 'summary_keyword', label: '✍️ Expand Summary (too short)', description: `Only ${resumeData.summary.trim().split(/\s+/).length} words — aim for 40+`, value: '__expand_summary__' });
  }

  const hasEmptyBullets = resumeData.experiences.some(e => !e.highlights?.filter(h => h?.trim()).length);
  if (hasEmptyBullets) {
    items.push({ type: 'experience_bullet', label: '📌 Add Achievement Bullets', description: 'Some jobs have no bullets — add achievements', value: '__add_bullets__' });
  }

  return items.slice(0, 14);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(THEME_COLORS[0]);
  const [fontSettings, setFontSettings] = useState<FontSettings>({ family: FONT_FAMILIES[0].value, size: 'normal' });

  const [apiKey, setApiKey] = useState('AIzaSyAsy0wUHZqNIYRx0kYQgopotbMU88jMcHE');
  const [isAILoading, setIsAILoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalData, setAiModalData] = useState({ type: '' as 'summary' | 'bullet' | '', original: '', enhanced: '' });
  const [showParserModal, setShowParserModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [optimizeSuccess, setOptimizeSuccess] = useState(false);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddItems, setQuickAddItems] = useState<QuickAddItem[]>([]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [quickAddLoading, setQuickAddLoading] = useState<string | null>(null);
  const [isGeneratingItems, setIsGeneratingItems] = useState(false);

  const handleApplyProfile = (profileId: string) => {
    const profile = JOB_PROFILES[profileId];
    if (!profile) return;
    setResumeData({
      personalInfo: { fullName: 'Jane Doe', email: 'janedoe@example.com', phone: '+1 (555) 123-4567', location: 'New York, NY', linkedin: 'linkedin.com/in/janedoe', website: 'janedoe.dev', jobTitle: profile.title, photo: resumeData.personalInfo.photo },
      summary: profile.suggestedSummary,
      experiences: [
        { id: '1', company: 'Acme Technologies', position: profile.title, duration: 'Jan 2021 - Present', location: 'San Francisco, CA', highlights: profile.suggestedHighlights || [] },
        { id: '2', company: 'TechStart Inc.', position: `Junior ${profile.title}`, duration: 'Jun 2018 - Dec 2020', location: 'Remote', highlights: ['Contributed to major product launches.', 'Collaborated with cross-functional teams to deliver solutions on time.'] },
      ],
      education: [{ id: '1', school: 'State University', degree: 'B.S. in Computer Science', duration: '2014 - 2018', location: 'Austin, TX', gpa: '3.9/4.0' }],
      skills: [
        { id: '1', category: 'Technical Skills', items: profile.suggestedSkills?.slice(0, 6) || [] },
        { id: '2', category: 'Soft Skills', items: ['Leadership', 'Communication', 'Problem Solving'] },
      ],
      projects: [{ id: '1', title: 'Intelligent App Suite', description: 'Built an advanced dashboard suite.', technologies: profile.suggestedSkills?.slice(0, 3) || [] }],
      certifications: [{ id: '1', name: 'Expert Level Certification', issuer: 'Industry Board', date: 'Aug 2022' }],
    });
  };

  // ══════════════════════════════════════════════════════════════════════
  // 🎯 ONE-CLICK SCORE OPTIMIZER — boosts to 100% automatically
  // ══════════════════════════════════════════════════════════════════════
  const optimizeToHundred = async () => {
    if (!atsResult || !jobDescription.trim()) return;
    setIsOptimizing(true);
    setOptimizeSuccess(false);
  
    try {
      const missingKws = atsResult.missingCriticalKeywords;
      const matchedKws = atsResult.matchedKeywords;
      const allJDKeywords = extractSingleKeywords(jobDescription);
      const jobTitle = resumeData.personalInfo.jobTitle || 'Senior Frontend Developer';
      const existingSkills = resumeData.skills.flatMap(s => s.items);
  
      // ── STEP 1: Fix format (LinkedIn, website) ─────────────────────
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          linkedin: prev.personalInfo.linkedin?.trim() ||
            `linkedin.com/in/${(prev.personalInfo.fullName || 'professional').toLowerCase().replace(/\s+/g, '-')}`,
          website: prev.personalInfo.website?.trim() ||
            `${(prev.personalInfo.fullName || 'portfolio').toLowerCase().replace(/\s+/g, '')}.dev`,
          location: prev.personalInfo.location?.trim() || 'Chennai, India',
        },
      }));
  
      // ── STEP 2: Add EVERY missing JD keyword as a skill ───────────────
      // We add ALL of them — not just tech ones — to maximize keyword match
      const allMissingToAdd = allJDKeywords
        .filter(kw => {
          const resumeText = buildResumeTextFromData(resumeData).fullText;
          return !resumeText.includes(kw.toLowerCase()) && kw.length > 2 && kw.length <= 25;
        })
        .map(kw => kw.charAt(0).toUpperCase() + kw.slice(1));
  
      // Group skills smartly
      const techKeywords = allMissingToAdd.filter(kw =>
        /^(react|next|node|typescript|javascript|python|aws|azure|docker|git|css|html|sass|redux|graphql|api|sql|mongodb|figma|jest|webpack|vite|tailwind|bootstrap|mui|sitecore|gatsby|redux|php|mysql|github|ci|cd|agile|scrum)/i.test(kw)
      );
      const softKeywords = allMissingToAdd.filter(kw =>
        /^(collaborat|communicat|leadership|management|storyboard|brand|consistent|ensure|design|creative|analytic|problem|team|client|stakeholder|present|deliver|develop|implement|manage|coordinat)/i.test(kw)
      );
      const otherKeywords = allMissingToAdd.filter(kw =>
        !techKeywords.includes(kw) && !softKeywords.includes(kw)
      );
  
      setResumeData(prev => {
        let updatedSkills = [...prev.skills];
  
        // Add to Technical Skills
        const techGroup = updatedSkills.find(s =>
          s.category.toLowerCase().includes('technical') || s.category.toLowerCase().includes('skill')
        );
        if (techGroup && techKeywords.length > 0) {
          updatedSkills = updatedSkills.map(s =>
            s.id === techGroup.id
              ? { ...s, items: [...new Set([...s.items, ...techKeywords])] }
              : s
          );
        } else if (techKeywords.length > 0) {
          updatedSkills.push({ id: 'tech-' + Date.now(), category: 'Technical Skills', items: techKeywords });
        }
  
        // Add soft skills group
        if (softKeywords.length > 0) {
          const softGroup = updatedSkills.find(s =>
            s.category.toLowerCase().includes('soft') || s.category.toLowerCase().includes('professional')
          );
          if (softGroup) {
            updatedSkills = updatedSkills.map(s =>
              s.id === softGroup.id
                ? { ...s, items: [...new Set([...s.items, ...softKeywords])] }
                : s
            );
          } else {
            updatedSkills.push({ id: 'soft-' + Date.now(), category: 'Professional Skills', items: softKeywords });
          }
        }
  
        // Add remaining as "Domain Skills"
        if (otherKeywords.length > 0) {
          updatedSkills.push({ id: 'other-' + Date.now(), category: 'Domain Skills', items: otherKeywords.slice(0, 10) });
        }
  
        return { ...prev, skills: updatedSkills };
      });
  
      // ── STEP 3: Build keyword-stuffed summary (all JD keywords inside) ──
      const keywordsForSummary = [
        ...matchedKws.slice(0, 6),
        ...missingKws.slice(0, 8),
      ].join(', ');
  
      // Extract specific phrases from JD for summary
      const jdPhraseMatches = jobDescription.match(
        /\b(video editing|motion graphics|animation|storyboard\w*|brand consistency|collaborat\w*|Adobe \w+|After Effects|Premiere Pro|ensure\w*|manag\w* multiple|responsive design|cross-functional)\b/gi
      ) || [];
      const uniquePhrases = [...new Set(jdPhraseMatches)].slice(0, 4);
  
      const optimizedSummary = `${jobTitle} with 8+ years of experience in ${
        existingSkills.slice(0, 4).join(', ')
      } and ${missingKws.slice(0, 3).join(', ')}. ${
        uniquePhrases.length > 0
          ? `Proven expertise in ${uniquePhrases.join(', ')}, `
          : 'Proven ability to '
      }collaborate with cross-functional teams to ensure brand consistency and deliver measurable results. Skilled in managing multiple projects simultaneously while maintaining high standards of ${
        missingKws.slice(3, 5).join(' and ') || 'quality and performance'
      } across enterprise applications.`;
  
      setResumeData(prev => ({ ...prev, summary: optimizedSummary }));
  
      // ── STEP 4: Supercharge ALL experience bullets with metrics + keywords ──
      // Extract action context from JD
      const jdActionPhrases = [
        ...(jobDescription.match(/\b(create|develop|design|manage|ensure|collaborate|deliver|build|implement|optimize|produce|edit|animate|track|analyze|present|coordinate)\b/gi) || []),
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
  
      setResumeData(prev => ({
        ...prev,
        experiences: prev.experiences.map((exp, expIdx) => {
          const existingBullets = (exp.highlights || []).filter(h => h?.trim());
  
          // Metric patterns we want to inject
          const metricBullets: string[] = [
            `Collaborated with cross-functional teams of 8+ members to ${jdActionPhrases[0] || 'deliver'} ${exp.position || 'frontend'} solutions, ensuring brand consistency across all digital touchpoints and reducing time-to-market by 30%.`,
            `Developed and optimized ${exp.position || 'web'} features using ${existingSkills.slice(0, 3).join(', ')}, improving application performance by 45% and increasing user engagement by 28%.`,
            `Managed multiple concurrent projects simultaneously, delivering 15+ features on schedule with 99.9% uptime across ${exp.company || 'enterprise'} production environments.`,
            `Implemented storyboarding and ${jdActionPhrases[1] || 'design'} workflows that reduced design-to-development handoff time by 35%, collaborating with UX designers to ensure pixel-perfect implementation.`,
            `Built and maintained 20+ reusable components ensuring brand consistency, accelerating feature delivery by 50% across ${Math.max(2, expIdx + 3)}+ enterprise client projects.`,
            `Led code reviews and mentored ${expIdx + 2} junior developers, improving team code quality by 40% while delivering ${missingKws[0] || 'scalable'} solutions on tight deadlines.`,
          ];
  
          // Keep good existing bullets, replace weak ones, add metric ones
          const hasMetrics = existingBullets.filter(b => /\d+/.test(b));
          const noMetrics = existingBullets.filter(b => !/\d+/.test(b));
  
          // Replace bullets without metrics, keep ones with metrics
          const bulletsToAdd = metricBullets.slice(expIdx * 2, expIdx * 2 + Math.max(2, 3 - hasMetrics.length));
  
          const finalBullets = [
            ...hasMetrics,
            ...bulletsToAdd,
          ].slice(0, 5); // max 5 bullets per job
  
          return { ...exp, highlights: finalBullets };
        }),
      }));
  
      // ── STEP 5: Optimize ALL project descriptions to include missing keywords ──
      setResumeData(prev => ({
        ...prev,
        projects: (prev.projects || []).map((project, idx) => {
          const kwsForProject = missingKws.slice(idx * 2, idx * 2 + 3);
          const updatedDesc = project.description?.trim()
            ? `${project.description} Collaborated with team to ensure ${kwsForProject[0] || 'quality'} standards and ${kwsForProject[1] || 'brand consistency'} across all deliverables.`
            : `Developed ${project.title} ensuring ${kwsForProject.join(', ')} across all project deliverables while managing multiple stakeholder requirements simultaneously.`;
  
          // Add missing keywords as technologies
          const updatedTech = [...new Set([
            ...(project.technologies || []),
            ...missingKws.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
          ])].slice(0, 8);
  
          return { ...project, description: updatedDesc, technologies: updatedTech };
        }),
      }));
  
      // ── STEP 6: If no projects, add keyword-rich ones ───────────────────
      setResumeData(prev => {
        if (prev.projects && prev.projects.length >= 2) return prev;
        return {
          ...prev,
          projects: [
            ...(prev.projects || []),
            {
              id: 'opt-1-' + Date.now(),
              title: 'Enterprise UI Component Library',
              description: `Collaborated with cross-functional teams to create and manage a comprehensive component library ensuring brand consistency across 10+ products. Implemented storyboarding workflows and design systems. Technologies: ${existingSkills.slice(0, 4).join(', ')}.`,
              technologies: [...existingSkills.slice(0, 4), ...missingKws.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1))],
            },
            {
              id: 'opt-2-' + Date.now(),
              title: 'Performance Optimization & Analytics',
              description: `Developed and implemented performance monitoring and ${missingKws[0] || 'analytics'} tracking solutions, reducing load time by 45% and improving ${missingKws[1] || 'user experience'} metrics. Managed multiple client projects simultaneously with measurable ROI improvements.`,
              technologies: [...existingSkills.slice(4, 8), ...missingKws.slice(2, 4).map(k => k.charAt(0).toUpperCase() + k.slice(1))],
            },
          ],
        };
      });
  
      // ── STEP 7: Add certifications if missing ──────────────────────────
      setResumeData(prev => {
        if (prev.certifications && prev.certifications.length > 0) return prev;
        return {
          ...prev,
          certifications: [
            { id: 'cert-1', name: `${jobTitle} Professional Certification`, issuer: 'Industry Board', date: '2023' },
            { id: 'cert-2', name: 'Agile & Scrum Master Certification', issuer: 'Scrum Alliance', date: '2022' },
          ],
        };
      });
  
      setOptimizeSuccess(true);
  
      // ── STEP 8: Re-analyze after state updates settle ──────────────────
      setTimeout(async () => {
        // Force fresh analysis with updated data
        const updatedData = await new Promise<ResumeData>(resolve => {
          setResumeData(prev => { resolve(prev); return prev; });
        });
  
        if (jobDescription.trim()) {
          setIsAnalyzing(true);
          try {
            const realScores = runATSEngine(updatedData, jobDescription);
            console.log('🚀 Post-optimize scores:', realScores);
            const suggestions = generateLocalSuggestions(realScores, updatedData);
            setAtsResult({ ...realScores, suggestions });
          } finally {
            setIsAnalyzing(false);
          }
        }
        setOptimizeSuccess(false);
      }, 800);
  
    } catch (e) {
      console.error('Optimization error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) { setErrorMessage('Please paste a job description first.'); return; }
    const { fullText: resumeText } = buildResumeTextFromData(resumeData);
    if (resumeText.trim().split(/\s+/).length < 10) { setErrorMessage('Please fill in more resume details before analyzing.'); return; }

    setIsAnalyzing(true);
    setAtsResult(null);
    setErrorMessage('');

    try {
      const realScores = runATSEngine(resumeData, jobDescription);
      console.log('✅ Real ATS Scores:', realScores);
      const suggestions = apiKey
        ? await fetchAISuggestionsOnly(resumeData, jobDescription, realScores, apiKey)
        : generateLocalSuggestions(realScores, resumeData);
      setAtsResult({ ...realScores, suggestions });
    } catch (error: any) {
      setErrorMessage(error.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openQuickAdd = async () => {
    if (!atsResult) return;
    setShowQuickAdd(true);
    setIsGeneratingItems(true);
    setAddedItems(new Set());

    try {
      if (apiKey && jobDescription) {
        const allSkills = resumeData.skills.flatMap(s => s.items).join(', ');
        const prompt = `Generate quick-add resume items. Return ONLY a JSON array, no markdown, no scores.
Current skills: ${allSkills}
Missing keywords: ${atsResult.missingCriticalKeywords.join(', ')}
[{"type":"skill","label":"React.js","description":"Add to Technical Skills","value":"React.js"}]
Types: skill | summary_keyword | experience_bullet`;

        const raw = await generateWithAI(prompt, apiKey);
        if (!raw.includes('"atsScore"') && !raw.includes('"breakdown"')) {
          const cleaned = raw.replace(/```[\s\S]*?```/g, '').trim();
          const s = cleaned.indexOf('['), e = cleaned.lastIndexOf(']');
          if (s !== -1 && e !== -1) {
            const arr = JSON.parse(cleaned.substring(s, e + 1));
            if (Array.isArray(arr) && arr.length > 0) {
              const local = buildQuickAddItems(atsResult.missingCriticalKeywords, resumeData);
              setQuickAddItems([...arr.slice(0, 8), ...local].slice(0, 14));
              setIsGeneratingItems(false);
              return;
            }
          }
        }
      }
    } catch (e) { console.warn('Quick-add AI failed:', e); }

    setQuickAddItems(buildQuickAddItems(atsResult.missingCriticalKeywords, resumeData));
    setIsGeneratingItems(false);
  };

  const handleQuickAddItem = async (item: QuickAddItem) => {
    const key = `${item.type}-${item.value}`;
    setQuickAddLoading(key);
    try {
      if (item.type === 'skill') {
        setResumeData(prev => {
          const techGroup = prev.skills.find(s => s.category.toLowerCase().includes('technical') || s.category.toLowerCase().includes('skill'));
          if (techGroup) return { ...prev, skills: prev.skills.map(s => s.id === techGroup.id ? { ...s, items: [...new Set([...s.items, item.value])] } : s) };
          return { ...prev, skills: [...prev.skills, { id: Date.now().toString(), category: 'Technical Skills', items: [item.value] }] };
        });
      } else if (item.type === 'summary_keyword') {
        if (item.value === '__generate_summary__' || item.value === '__expand_summary__') {
          const jobTitle = resumeData.personalInfo.jobTitle || 'Professional';
          const skillsList = resumeData.skills.flatMap(s => s.items).slice(0, 8).join(', ');
          if (apiKey) {
            const prompt = `Write a professional resume summary for a ${jobTitle} skilled in ${skillsList}. Return ONLY plain text, 40-60 words, no JSON, no quotes, no labels.`;
            const raw = await generateWithAI(prompt, apiKey);
            const clean = extractPlainText(raw);
            if (clean && !clean.includes('{')) setResumeData(prev => ({ ...prev, summary: clean }));
          } else {
            setResumeData(prev => ({ ...prev, summary: `Results-driven ${jobTitle} with proven experience in ${skillsList || 'web development'}. Collaborates with cross-functional teams to ensure brand consistency and deliver scalable solutions with measurable business impact.` }));
          }
        } else {
          if (apiKey && resumeData.summary?.trim()) {
            const prompt = `Add "${item.value}" naturally into this summary. Return ONLY the updated plain text, no JSON:\n\n${resumeData.summary}`;
            const raw = await generateWithAI(prompt, apiKey);
            const clean = extractPlainText(raw);
            if (clean && !clean.includes('{')) setResumeData(prev => ({ ...prev, summary: clean }));
          } else {
            setResumeData(prev => ({ ...prev, summary: (prev.summary || '') + ` Experienced with ${item.value}.` }));
          }
        }
      } else if (item.type === 'experience_bullet') {
        setResumeData(prev => ({
          ...prev,
          experiences: prev.experiences.map(exp => {
            if (!exp.highlights?.filter(h => h?.trim()).length) {
              return { ...exp, highlights: ['Delivered key features on schedule, improving team productivity by 25%.', 'Collaborated with cross-functional teams to implement scalable solutions.', 'Ensured brand consistency across all UI components, reducing design inconsistencies by 40%.'] };
            }
            return exp;
          }),
        }));
      }
      setAddedItems(prev => new Set([...prev, key]));
    } catch (e) { console.error('Quick add error:', e); }
    finally { setQuickAddLoading(null); }
  };

  const handleAddAllSkills = () => {
    const unadded = quickAddItems.filter(i => i.type === 'skill' && !addedItems.has(`skill-${i.value}`));
    setResumeData(prev => {
      const techGroup = prev.skills.find(s => s.category.toLowerCase().includes('technical') || s.category.toLowerCase().includes('skill'));
      const newSkills = unadded.map(i => i.value);
      if (techGroup) return { ...prev, skills: prev.skills.map(s => s.id === techGroup.id ? { ...s, items: [...new Set([...s.items, ...newSkills])] } : s) };
      return { ...prev, skills: [...prev.skills, { id: Date.now().toString(), category: 'Technical Skills', items: newSkills }] };
    });
    setAddedItems(prev => { const next = new Set(prev); unadded.forEach(i => next.add(`skill-${i.value}`)); return next; });
  };

  const reAnalyze = () => { setShowQuickAdd(false); setTimeout(() => analyzeJobMatch(), 400); };

  // ══════════════════════════════════════════════════════════════════════
  // ✅ FIXED: handleEnhanceWithAI — strips JSON, always returns plain text
  // ══════════════════════════════════════════════════════════════════════
  const handleEnhanceWithAI = async (type: 'summary' | 'bullet', text: string, context?: string) => {
    setIsAILoading(true);
    try {
      let enhanced = '';

      if (apiKey) {
        const prompt = type === 'summary'
          ? `You are a resume writer. Rewrite this professional summary to be more compelling and ATS-optimized.

Job context: ${context || 'Software Professional'}
Current summary: ${text}

STRICT RULES - violation means failure:
1. Return ONLY the improved paragraph as plain prose text
2. Do NOT output JSON, objects, arrays, or any { } [ ] characters
3. Do NOT include labels like "Enhanced:" or "Summary:"
4. Do NOT wrap in quotes
5. Write 3-5 sentences, 40-70 words
6. Start directly with the content (e.g. "Results-driven..." or "Accomplished...")

Output the improved summary now:`
          : `You are a resume writer. Rewrite this bullet point to be stronger.

Job context: ${context || 'Software Professional'}
Current bullet: ${text}

STRICT RULES - violation means failure:
1. Return ONLY one improved bullet as plain text
2. Do NOT output JSON, objects, arrays, or any { } [ ] characters
3. Do NOT include bullet symbols (•, -, *) or labels
4. Start with a strong past-tense action verb (Built, Led, Developed, etc.)
5. Include ONE specific metric (%, number, $, users, etc.)

Output the improved bullet now:`;

        const raw = await generateWithAI(prompt, apiKey);
        console.log('Raw AI response:', raw);

        // Try to extract plain text
        const cleaned = extractPlainText(raw);

        if (cleaned && cleaned.length > 20 && !cleaned.includes('"atsScore"')) {
          enhanced = cleaned;
        } else {
          throw new Error('AI returned invalid format');
        }
      } else {
        throw new Error('No API key');
      }

      setAiModalData({ type, original: text, enhanced });
      setShowAIModal(true);

    } catch (e: any) {
      console.warn('AI enhancement failed, using local fallback:', e.message);

      // Always show something useful — never raw JSON
      const fallback = type === 'summary'
        ? `Results-driven ${context || 'Software Professional'} with proven expertise delivering scalable web applications. ${text.slice(0, 100).replace(/[{}"[\]]/g, '')}. Passionate about collaborating with teams to ensure brand consistency and drive measurable performance improvements.`
        : `Developed and optimized ${text.replace(/^[•\-*]\s*/, '').replace(/[{}"[\]]/g, '').slice(0, 80)}, improving system performance by 35% and enhancing user experience for 5,000+ active users.`;

      setAiModalData({ type, original: text, enhanced: fallback });
      setShowAIModal(true);
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
          highlights: exp.highlights.map(h => h === aiModalData.original ? aiModalData.enhanced : h),
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
      const wrapper = element.parentElement;
      if (wrapper) wrapper.style.transform = 'scale(1)';
      const cleanName = (resumeData.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
      await html2pdf().from(element).set({
        margin: 0, filename: `${cleanName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all'] },
      }).save();
      if (wrapper) wrapper.style.transform = '';
    } catch (e) { alert('PDF download failed.'); }
    finally { setIsDownloading(false); }
  };

  const resetForm = () => {
    if (confirm('Clear all data?')) {
      setResumeData(INITIAL_RESUME_DATA);
      setJobDescription('');
      setAtsResult(null);
      setErrorMessage('');
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 85) return { ring: '#22c55e', text: 'text-green-600', label: 'Strong Match 🎉', badge: 'bg-green-100 text-green-700' };
    if (score >= 70) return { ring: '#3b82f6', text: 'text-blue-600', label: 'Good Match', badge: 'bg-blue-100 text-blue-700' };
    if (score >= 50) return { ring: '#f59e0b', text: 'text-amber-600', label: 'Moderate Match', badge: 'bg-amber-100 text-amber-700' };
    return { ring: '#ef4444', text: 'text-red-600', label: 'Low Match', badge: 'bg-red-100 text-red-700' };
  };

  const skillItems = quickAddItems.filter(i => i.type === 'skill');
  const otherItems = quickAddItems.filter(i => i.type !== 'skill');
  const unadddedSkills = skillItems.filter(i => !addedItems.has(`skill-${i.value}`));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200"><Sparkles size={22} /></div>
            <div>
              <div className="font-bold text-xl tracking-tight">ResumeAI</div>
              <div className="text-[10px] text-slate-500 -mt-1">ATS Optimized</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
              <Key size={16} className="text-slate-400" />
              <input type="password" placeholder="Gemini API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-transparent text-sm outline-none w-56" />
            </div>
            <button onClick={() => setShowParserModal(true)} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-semibold text-sm">Upload Old Resume</button>
            <button onClick={resetForm} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200"><RefreshCw size={16} /> Reset</button>
            <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-md disabled:opacity-50">
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 xl:grid-cols-12 gap-6 print:p-0 print:block">
        <div className="xl:col-span-5 flex flex-col gap-4 print:hidden">

          {/* ATS Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-violet-100 p-2 rounded-xl"><Target className="text-violet-600" size={26} /></div>
              <div>
                <h3 className="font-bold text-xl">ATS Score & Job Match</h3>
                <p className="text-slate-500 text-sm">Real scoring from your actual resume data</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-xs flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span><strong>100% Real Scoring:</strong> Your form data is scanned directly. AI only writes improvement tips — never sets scores.</span>
            </div>

            {!resumeData.personalInfo.fullName?.trim() && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> Fill your resume details below before analyzing.
              </div>
            )}

            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full Job Description here..." className="w-full h-40 p-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-violet-400 resize-y" />

            <button onClick={analyzeJobMatch} disabled={isAnalyzing || !jobDescription.trim()}
              className="mt-4 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all">
              {isAnalyzing && <Loader2 className="animate-spin" size={20} />}
              {isAnalyzing ? 'Scanning your resume...' : 'Analyze Job Match →'}
            </button>

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {errorMessage}
              </div>
            )}

            {atsResult && (() => {
              const style = getScoreStyle(atsResult.atsScore);
              return (
                <div className="mt-6 space-y-5">
                  {/* Score circle */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-36 h-36">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 42 42">
                        <circle cx="21" cy="21" r="15" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                        <circle cx="21" cy="21" r="15" fill="none" stroke={style.ring} strokeWidth="4"
                          strokeDasharray={`${(atsResult.atsScore / 100) * 94} 94`} strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 1s ease' }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`text-4xl font-bold ${style.text}`}>{atsResult.atsScore}%</div>
                        <div className="text-[10px] text-slate-500 font-semibold">ATS SCORE</div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${style.badge}`}>{style.label}</span>
                    <button onClick={() => setShowDebug(p => !p)} className="text-xs text-slate-400 hover:text-slate-600 underline">
                      {showDebug ? 'Hide' : 'Show'} what was scanned
                    </button>
                    {showDebug && (
                      <div className="w-full bg-slate-50 rounded-xl p-4 text-xs text-slate-600 border border-slate-200">
                        <div className="font-bold mb-2 text-slate-700">📊 Scanned from your resume form:</div>
                        <div>• Sections found: <span className="text-indigo-600 font-medium">{atsResult.debugInfo.resumeSections.join(' → ')}</span></div>
                        <div>• Words scanned: <span className="text-indigo-600 font-medium">{atsResult.debugInfo.totalResumeWords}</span></div>
                        <div>• JD keywords checked: <span className="text-indigo-600 font-medium">{atsResult.debugInfo.totalJDKeywords}</span></div>
                        <div>• Keywords matched: <span className="text-green-600 font-medium">{atsResult.matchedKeywords.length}</span></div>
                        <div>• Keywords missing: <span className="text-red-500 font-medium">{atsResult.missingCriticalKeywords.length}</span></div>
                      </div>
                    )}
                  </div>

                  {/* ✨ ONE-CLICK OPTIMIZE TO 100% */}
                  {atsResult.atsScore < 95 && (
                    <div className="space-y-2">
                      {/* Optimize button */}
                      <button onClick={optimizeToHundred} disabled={isOptimizing}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-100">
                        {isOptimizing
                          ? <><Loader2 size={20} className="animate-spin" /> Optimizing your resume...</>
                          : optimizeSuccess
                          ? <><CheckCircle2 size={20} /> Optimized! Re-analyzing...</>
                          : <><TrendingUp size={20} /> 🚀 Auto-Optimize to 100% Score</>}
                      </button>

                      {/* Boost button */}
                      <button onClick={openQuickAdd}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-100">
                        <Wand2 size={18} />
                        ✨ Manually Add Missing Items
                        <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{atsResult.missingCriticalKeywords.length} fixes</span>
                      </button>
                    </div>
                  )}

                  {atsResult.atsScore >= 95 && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center">
                      <div className="text-3xl mb-2">🎉</div>
                      <div className="font-bold text-green-800 text-lg">Excellent Score!</div>
                      <div className="text-green-600 text-sm mt-1">Your resume is highly optimized for this job.</div>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Keyword Match', value: atsResult.breakdown.keywordMatch, hint: `${atsResult.matchedKeywords.length}/${atsResult.debugInfo.totalJDKeywords} keywords` },
                      { label: 'Experience Quality', value: atsResult.breakdown.experienceQuality, hint: 'Metrics & action verbs' },
                      { label: 'Section Complete', value: atsResult.breakdown.sectionCompleteness, hint: `${atsResult.debugInfo.resumeSections.length} sections found` },
                      { label: 'Format', value: atsResult.breakdown.formatScore, hint: 'Contact & dates' },
                    ].map(({ label, value, hint }) => (
                      <div key={label} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">{label}</span>
                          <span className="font-bold">{value}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                          <div className="h-2 rounded-full transition-all duration-700"
                            style={{ width: `${value}%`, backgroundColor: value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <div className="text-[10px] text-slate-400">{hint}</div>
                      </div>
                    ))}
                  </div>

                  {/* Matched keywords */}
                  {atsResult.matchedKeywords.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-green-500" /> Found in Your Resume ({atsResult.matchedKeywords.length})
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {atsResult.matchedKeywords.map((kw, i) => <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">✓ {kw}</span>)}
                      </div>
                    </div>
                  )}

                  {/* Missing keywords */}
                  {atsResult.missingCriticalKeywords.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                        <XCircle size={14} className="text-red-500" /> Not Found in Resume ({atsResult.missingCriticalKeywords.length})
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {atsResult.missingCriticalKeywords.map((kw, i) => <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">✗ {kw}</span>)}
                      </div>
                    </div>
                  )}

                  {/* AI writing tips */}
                  {atsResult.suggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">
                        <Sparkles size={14} className="text-violet-500" /> AI Writing Tips
                      </div>
                      <div className="space-y-3">
                        {atsResult.suggestions.map((s, i) => (
                          <div key={i} className="flex gap-3 text-sm bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                            <span className="text-amber-500 shrink-0">★</span>
                            <p className="text-slate-700">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <JobPicker onApplyProfile={handleApplyProfile} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhotoUpload photo={resumeData.personalInfo.photo} onChange={(photo) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, photo } }))} />
            <ThemePicker selected={selectedTheme} onSelect={setSelectedTheme} />
          </div>
          <FontPicker settings={fontSettings} onChange={setFontSettings} />
          <TemplatePicker selectedId={selectedTemplate} onSelect={setSelectedTemplate} />
          <ResumeForm data={resumeData} setData={setResumeData} onEnhanceBullet={handleEnhanceWithAI} />
        </div>

        <div className="xl:col-span-7 bg-slate-200/50 rounded-2xl p-3 border border-slate-200 overflow-auto max-h-[calc(100vh-100px)] xl:sticky xl:top-20 print:bg-transparent print:p-0 print:max-h-none print:static">
          <div className="preview-wrapper origin-top mx-auto w-fit print:scale-100">
            <AllTemplates data={resumeData} theme={selectedTheme} templateId={selectedTemplate} fontSettings={fontSettings} isDownloading={isDownloading} />
          </div>
        </div>
      </main>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white rounded-t-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl"><Wand2 size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold">Boost Your ATS Score</h2>
                    <p className="text-violet-200 text-sm">Add missing items with one click</p>
                  </div>
                </div>
                <button onClick={() => setShowQuickAdd(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl"><X size={20} /></button>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div><div className="text-white/70 text-xs font-semibold">CURRENT</div><div className="text-3xl font-black">{atsResult?.atsScore}%</div></div>
                <div className="text-2xl font-bold opacity-60">→</div>
                <div className="text-right"><div className="text-white/70 text-xs font-semibold">POTENTIAL</div><div className="text-3xl font-black text-green-300">{Math.min(100, (atsResult?.atsScore || 0) + Math.round(quickAddItems.length * 3.2))}%</div></div>
                <div className="bg-green-400/20 border border-green-400/30 rounded-xl px-3 py-1.5"><div className="text-green-300 text-xs font-bold">+{Math.round(quickAddItems.length * 3.2)} pts est.</div></div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {isGeneratingItems ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="animate-spin text-violet-600" size={36} />
                  <p className="text-slate-600 font-medium">Finding missing items...</p>
                </div>
              ) : quickAddItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-lg">No critical items missing!</p>
                  <p className="text-slate-500 text-sm mt-1">Your resume is well-optimized.</p>
                </div>
              ) : (
                <>
                  {skillItems.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">SKILLS</span>
                          Missing Technical Skills
                        </h3>
                        {unadddedSkills.length > 1 && (
                          <button onClick={handleAddAllSkills} className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700">
                            <PlusCircle size={14} /> Add All ({unadddedSkills.length})
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillItems.map(item => {
                          const k = `skill-${item.value}`;
                          const added = addedItems.has(k);
                          const loading = quickAddLoading === k;
                          return (
                            <button key={k} onClick={() => !added && handleQuickAddItem(item)} disabled={added || loading}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${added ? 'bg-green-100 border-green-300 text-green-700 cursor-default' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}>
                              {loading ? <Loader2 size={12} className="animate-spin" /> : added ? <Check size={12} /> : <PlusCircle size={12} />}
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {otherItems.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">CONTENT</span>
                        Content Improvements
                      </h3>
                      <div className="space-y-3">
                        {otherItems.map(item => {
                          const k = `${item.type}-${item.value}`;
                          const added = addedItems.has(k);
                          const loading = quickAddLoading === k;
                          return (
                            <div key={k} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${added ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-violet-200'}`}>
                              <div className="flex-1 mr-4">
                                <div className="font-semibold text-sm">{item.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                              </div>
                              <button onClick={() => !added && handleQuickAddItem(item)} disabled={added || !!loading}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 ${added ? 'bg-green-100 text-green-700 cursor-default' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                                {loading ? <Loader2 size={14} className="animate-spin" /> : added ? <><Check size={14} /> Added</> : <><PlusCircle size={14} /> Add</>}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {addedItems.size > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                      <div>
                        <div className="font-bold text-green-800 text-sm">{addedItems.size} item{addedItems.size > 1 ? 's' : ''} added!</div>
                        <div className="text-green-600 text-xs">Re-analyze to see your updated real score.</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-slate-100 p-6 flex gap-3 rounded-b-3xl">
              <button onClick={() => setShowQuickAdd(false)} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">Close</button>
              {addedItems.size > 0 && (
                <button onClick={reAnalyze} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90">
                  <Target size={16} /> Re-Analyze Score →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Enhancement Modal — FIXED: always shows plain text */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600" size={22} />
              <h3 className="text-lg font-bold">AI Enhancement Result</h3>
            </div>

            {/* Validate: warn if enhanced still looks like JSON */}
            {(aiModalData.enhanced.includes('{') || aiModalData.enhanced.includes('"atsScore"')) && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> AI returned unexpected format — showing cleaned version.
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Original</span>
                <p className="p-3 bg-slate-50 border rounded-lg italic text-slate-600 mt-1 leading-relaxed">{aiModalData.original}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-1"><Check size={12} /> Enhanced</span>
                <p className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-medium mt-1 leading-relaxed">
                  {/* Final safety render: strip any JSON chars */}
                  {aiModalData.enhanced.replace(/[{}"[\]]/g, '').replace(/\b(atsScore|keywordMatch|breakdown|experienceQuality)\b\s*:/g, '').trim()}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setShowAIModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Discard</button>
              <button onClick={acceptAIEnhancement} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Apply Changes</button>
            </div>
          </div>
        </div>
      )}

      {showParserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-2">Parse Old Resume</h2>
              <p className="text-slate-600 mb-6">Upload your old PDF/DOCX or paste text below</p>
              <ResumeParser onDataExtracted={handleDataExtracted} onClose={() => setShowParserModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
