import { ResumeData } from '../types';

export interface ATSResult {
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

export interface QuickAddItem {
  type: 'skill' | 'summary_keyword' | 'experience_bullet';
  label: string;
  description: string;
  value: string;
  category?: string;
}

export const STOP_WORDS = new Set([
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
  'years','day','days','time','ability','skills','skill',
  'required','requirement','requirements','preferred','plus','bonus',
  'minimum','maximum','least','most','highly','very','key',
  'responsible','responsibilities','qualifications','qualified',
  'including','what','why','did','does','doing','done',
  'take','taken','come','came','give','given','know','known',
  'think','thought','want','find','found','tell','told',
  'become','became','show','showed','shown',
]);

export function extractPlainText(raw: string): string | null {
  if (!raw?.trim()) return null;

  let text = raw.trim();
  text = text.replace(/```[\s\S]*?```/g, '').trim();

  if (
    (text.startsWith('{') && text.endsWith('}')) ||
    (text.startsWith('[') && text.endsWith(']'))
  ) {
    try {
      const parsed = JSON.parse(text);

      if (typeof parsed === 'string') return parsed;

      if (Array.isArray(parsed)) {
        const firstString = parsed.find((x) => typeof x === 'string' && x.length > 10);
        return firstString || null;
      }

      if (parsed && typeof parsed === 'object') {
        const values = Object.values(parsed).filter(
          (v): v is string => typeof v === 'string' && v.length > 10
        );
        return values[0] || null;
      }
    } catch {
      return null;
    }
  }

  text = text.replace(/[{}[\]"]/g, '').replace(/\s+/g, ' ').trim();
  return text.length > 10 ? text : null;
}

export function extractSingleKeywords(text: string): string[] {
  return [
    ...new Set(
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
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    ),
  ];
}

export function extractPhrases(text: string): string[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ').filter((w) => w.length > 1);
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

export function buildResumeTextFromData(data: ResumeData): { fullText: string; sections: string[] } {
  const sections: string[] = [];
  const parts: string[] = [];

  const { personalInfo, summary, experiences, skills, projects, certifications, education } = data;

  if (personalInfo.fullName?.trim()) {
    parts.push(personalInfo.fullName);
    sections.push('Name');
  }
  if (personalInfo.jobTitle?.trim()) {
    parts.push(personalInfo.jobTitle);
    sections.push('Job Title');
  }
  if (personalInfo.location?.trim()) parts.push(personalInfo.location);
  if (personalInfo.linkedin?.trim()) parts.push(personalInfo.linkedin);

  if (summary?.trim()) {
    parts.push(summary);
    sections.push('Summary');
  }

  if (experiences?.length > 0) {
    sections.push('Experience');
    experiences.forEach((exp) => {
      if (exp.position?.trim()) parts.push(exp.position);
      if (exp.company?.trim()) parts.push(exp.company);
      if (exp.location?.trim()) parts.push(exp.location);
      if (exp.duration?.trim()) parts.push(exp.duration);
      (exp.highlights || []).forEach((h) => {
        if (h?.trim()) parts.push(h);
      });
    });
  }

  if (skills?.length > 0) {
    sections.push('Skills');
    skills.forEach((group) => {
      if (group.category?.trim()) parts.push(group.category);
      (group.items || []).forEach((item) => {
        if (item?.trim()) parts.push(item);
      });
    });
  }

  if (projects?.length > 0) {
    sections.push('Projects');
    projects.forEach((project) => {
      if (project.title?.trim()) parts.push(project.title);
      if (project.description?.trim()) parts.push(project.description);
      (project.technologies || []).forEach((tech) => {
        if (tech?.trim()) parts.push(tech);
      });
    });
  }

  if (education?.length > 0) {
    sections.push('Education');
    education.forEach((e) => {
      if (e.school?.trim()) parts.push(e.school);
      if (e.degree?.trim()) parts.push(e.degree);
      if (e.duration?.trim()) parts.push(e.duration);
    });
  }

  if (certifications?.length > 0) {
    sections.push('Certifications');
    certifications.forEach((c) => {
      if (c.name?.trim()) parts.push(c.name);
      if (c.issuer?.trim()) parts.push(c.issuer);
    });
  }

  return {
    fullText: parts.join(' ').toLowerCase(),
    sections,
  };
}

export function scoreKeywordMatch(resumeFullText: string, jobDescription: string) {
  const jdKeywords = extractSingleKeywords(jobDescription);
  const jdPhrases = extractPhrases(jobDescription);
  const resumeKeywords = extractSingleKeywords(resumeFullText);
  const resumeSet = new Set(resumeKeywords);

  const matched: string[] = [];
  const missing: string[] = [];
  let singleMatched = 0;

  jdKeywords.forEach((kw) => {
    if (resumeSet.has(kw) || resumeFullText.includes(kw)) {
      singleMatched++;
      if (kw.length > 3) matched.push(kw);
    } else {
      if (kw.length > 3) missing.push(kw);
    }
  });

  let phraseMatched = 0;
  const importantPhrases = jdPhrases
    .filter((p) => p.split(' ').some((w) => !STOP_WORDS.has(w) && w.length > 3))
    .slice(0, 50);

  importantPhrases.forEach((phrase) => {
    if (resumeFullText.includes(phrase)) phraseMatched++;
  });

  const singleScore = jdKeywords.length > 0 ? (singleMatched / jdKeywords.length) * 100 : 0;
  const phraseScore = importantPhrases.length > 0 ? (phraseMatched / importantPhrases.length) * 100 : singleScore;
  const finalScore = Math.round(singleScore * 0.6 + phraseScore * 0.4);

  return {
    score: Math.min(100, finalScore),
    matched: [...new Set(matched)].slice(0, 25),
    missing: [...new Set(missing)].slice(0, 20),
  };
}

export function scoreExperienceQuality(data: ResumeData): number {
  const { experiences } = data;
  if (!experiences?.length) return 0;

  let score = Math.min(25, experiences.length * 12);

  const metricPattern =
    /\b\d+\s*(%|percent|x|times|users|clients|k\b|million|billion|\$|hours|days|weeks|months|years|ms|seconds|projects|features|engineers|developers|members|teams|systems|services|apis|endpoints)\b/i;

  const actionVerbPattern =
    /^(led|built|developed|designed|implemented|created|managed|increased|reduced|improved|optimized|launched|delivered|achieved|scaled|automated|architected|engineered|collaborated|mentored|migrated|integrated|deployed|established|streamlined|spearheaded|orchestrated|pioneered|transformed|drove|generated|saved|boosted|accelerated|enhanced)/i;

  let totalBullets = 0;
  let bulletsWithMetrics = 0;
  let bulletsWithActionVerbs = 0;
  let longBullets = 0;

  experiences.forEach((exp) => {
    const bullets = (exp.highlights || []).filter((h) => h?.trim());
    totalBullets += bullets.length;

    bullets.forEach((bullet) => {
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

export function scoreSectionCompleteness(data: ResumeData): number {
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

  if (experiences?.length > 0) score += 8;
  if (experiences?.length >= 2) score += 5;
  if (experiences?.length >= 3) score += 2;

  const totalBullets = experiences.reduce(
    (sum, e) => sum + (e.highlights?.filter((h) => h?.trim()).length || 0),
    0
  );
  if (totalBullets >= 3) score += 5;
  if (totalBullets >= 6) score += 5;

  const allSkills = skills.flatMap((s) => s.items.filter((i) => i?.trim()));
  if (allSkills.length > 0) score += 5;
  if (allSkills.length >= 5) score += 5;
  if (allSkills.length >= 10) score += 5;

  if (education?.length > 0) score += 10;
  if (projects?.length > 0) score += 3;
  if (certifications?.length > 0) score += 2;

  return Math.min(100, score);
}

export function scoreFormat(data: ResumeData): number {
  let score = 0;
  const { personalInfo, experiences } = data;

  if (personalInfo.email?.includes('@')) score += 20;
  if (personalInfo.phone?.trim()) score += 20;
  if (personalInfo.linkedin?.trim()) score += 15;
  if (personalInfo.location?.trim()) score += 10;

  const expsWithDates = experiences.filter((e) => e.duration?.trim()).length;
  if (experiences.length > 0) {
    score += Math.round((expsWithDates / experiences.length) * 25);
  } else {
    score += 10;
  }

  if (personalInfo.website?.trim()) score += 10;

  return Math.min(100, score);
}

export function runATSEngine(resumeData: ResumeData, jobDescription: string): Omit<ATSResult, 'suggestions'> {
  const { fullText: resumeFullText, sections } = buildResumeTextFromData(resumeData);
  const keywordResult = scoreKeywordMatch(resumeFullText, jobDescription);
  const experienceQuality = scoreExperienceQuality(resumeData);
  const sectionCompleteness = scoreSectionCompleteness(resumeData);
  const formatScore = scoreFormat(resumeData);
  const jdKeywords = extractSingleKeywords(jobDescription);

  const atsScore = Math.round(
    keywordResult.score * 0.45 +
      experienceQuality * 0.25 +
      sectionCompleteness * 0.2 +
      formatScore * 0.1
  );

  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    breakdown: {
      keywordMatch: keywordResult.score,
      experienceQuality,
      sectionCompleteness,
      formatScore,
    },
    matchedKeywords: keywordResult.matched,
    missingCriticalKeywords: keywordResult.missing,
    debugInfo: {
      totalJDKeywords: jdKeywords.length,
      totalResumeWords: resumeFullText.split(/\s+/).filter(Boolean).length,
      resumeSections: sections,
    },
  };
}

export function generateLocalSuggestions(
  result: Omit<ATSResult, 'suggestions'>,
  data: ResumeData
): string[] {
  const tips: string[] = [];
  const { breakdown, missingCriticalKeywords } = result;

  if (breakdown.keywordMatch < 70) {
    tips.push(
      `Keyword match is ${breakdown.keywordMatch}% — add these to your skills or summary: ${missingCriticalKeywords
        .slice(0, 5)
        .join(', ')}.`
    );
  }

  if (breakdown.experienceQuality < 75) {
    tips.push(
      'Add measurable metrics to your experience bullets, such as performance improvements, user counts, or delivery impact.'
    );
  }

  if (!data.summary?.trim()) {
    tips.push('Add a 40–60 word professional summary to improve ATS completeness and keyword coverage.');
  }

  if (!data.personalInfo.linkedin?.trim()) {
    tips.push('Add your LinkedIn URL to strengthen your contact and format score.');
  }

  if (!data.projects?.length) {
    tips.push('Add 2–3 relevant projects with descriptions and technologies used.');
  }

  const allSkills = data.skills.flatMap((s) => s.items.filter((i) => i?.trim()));
  if (allSkills.length < 8) {
    tips.push(`Only ${allSkills.length} skills listed — add more relevant tools and keywords from the job description.`);
  }

  return tips.slice(0, 5);
}

export function buildQuickAddItems(
  missingKeywords: string[],
  resumeData: ResumeData
): QuickAddItem[] {
  const items: QuickAddItem[] = [];

  const existingSkillsLower = new Set(
    resumeData.skills.flatMap((s) => s.items.map((i) => i.toLowerCase().trim()))
  );

  const { fullText: resumeText } = buildResumeTextFromData(resumeData);

  const techSkillPattern =
    /^(react|angular|vue|nuxt|next|node|python|java|typescript|javascript|sql|aws|azure|gcp|docker|kubernetes|git|figma|photoshop|illustrator|sketch|tableau|excel|css|html|sass|scss|redux|graphql|rest|api|mongodb|postgresql|mysql|sqlite|linux|agile|scrum|jira|jenkins|ci|cd|tensorflow|pytorch|flutter|swift|kotlin|rust|golang|php|ruby|rails|django|flask|fastapi|webpack|vite|jest|cypress|selenium|terraform|ansible|kafka|redis|elasticsearch|firebase|supabase|stripe|oauth|jwt|nextjs|nodejs|vuejs|reactjs|bootstrap|tailwind|materialui|mui|chakra|styled|prisma|drizzle|trpc|zustand|mobx|rxjs|babel|eslint|prettier|storybook|chromatic|vercel|netlify|heroku|digitalocean)/i;

  missingKeywords.forEach((kw) => {
    const kwLower = kw.toLowerCase().trim();

    if (existingSkillsLower.has(kwLower) || resumeText.includes(kwLower)) return;

    if (techSkillPattern.test(kwLower) || kw.length <= 15) {
      const display = kw.charAt(0).toUpperCase() + kw.slice(1);
      if (!items.some((i) => i.value.toLowerCase() === kwLower)) {
        items.push({
          type: 'skill',
          label: display,
          description: `Add "${display}" to Technical Skills`,
          value: display,
          category: 'Technical Skills',
        });
      }
    } else {
      items.push({
        type: 'summary_keyword',
        label: kw,
        description: `Mention "${kw}" in your summary`,
        value: kw,
      });
    }
  });

  if (!resumeData.summary?.trim()) {
    items.unshift({
      type: 'summary_keyword',
      label: '📝 Generate Professional Summary',
      description: 'Missing summary — this lowers ATS completeness',
      value: '__generate_summary__',
    });
  } else if (resumeData.summary.trim().split(/\s+/).length < 25) {
    items.unshift({
      type: 'summary_keyword',
      label: '✍️ Expand Summary',
      description: `Current summary is only ${resumeData.summary.trim().split(/\s+/).length} words — aim for 40+`,
      value: '__expand_summary__',
    });
  }

  const hasEmptyBullets = resumeData.experiences.some(
    (e) => !e.highlights?.filter((h) => h?.trim()).length
  );

  if (hasEmptyBullets) {
    items.push({
      type: 'experience_bullet',
      label: '📌 Add Achievement Bullets',
      description: 'Some jobs have no achievement bullets',
      value: '__add_bullets__',
    });
  }

  return items.slice(0, 14);
}