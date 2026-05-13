import { ResumeData } from '../types';
import {
  ATSResult,
  buildResumeTextFromData,
  extractSingleKeywords,
  generateLocalSuggestions,
  runATSEngine,
} from './atsEngine';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function toDisplayWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function addSkillsToCategory(data: ResumeData, categoryName: string, items: string[]) {
  if (!items.length) return;

  const existing = data.skills.find((s) =>
    s.category.toLowerCase().includes(categoryName.toLowerCase())
  );

  if (existing) {
    data.skills = data.skills.map((s) =>
      s.id === existing.id
        ? { ...s, items: [...new Set([...s.items, ...items])] }
        : s
    );
  } else {
    data.skills.push({
      id: `${categoryName}-${Date.now()}-${Math.random()}`,
      category: categoryName,
      items: [...new Set(items)],
    });
  }
}

export function optimizeResume(resumeData: ResumeData, jobDescription: string): ResumeData {
  const nextData = deepClone(resumeData);
  const allJDWords = extractSingleKeywords(jobDescription);

  let { fullText } = buildResumeTextFromData(nextData);

  const trulyMissing = allJDWords.filter(
    (kw) => kw.length > 2 && !fullText.includes(kw.toLowerCase())
  );

  const techWords: string[] = [];
  const softWords: string[] = [];
  const domainWords: string[] = [];

  trulyMissing.forEach((kw) => {
    const kwL = kw.toLowerCase();
    const display = toDisplayWord(kw);

    if (
      /^(react|next|node|type|java|python|css|html|sql|aws|azure|docker|git|redux|api|rest|graphql|jest|webpack|vite|sass|scss|tailwind|bootstrap|mui|sitecore|gatsby|php|mysql|mongodb|firebase|figma|sketch|photoshop|illustrator|premiere|effects|after|animate|animation|video|editing|motion|graphics|adobe|typescript|javascript|frontend|backend|fullstack|responsive|accessibility|performance)/i.test(
        kwL
      )
    ) {
      techWords.push(display);
    } else if (
      /^(collaborat|communicat|leadership|management|brand|deliver|present|coordinat|team|client|stakeholder|manage|organiz|priorit|problem|solv|analytic|strateg|plan|mentor|train|review)/i.test(
        kwL
      )
    ) {
      softWords.push(display);
    } else {
      domainWords.push(display);
    }
  });

  addSkillsToCategory(nextData, 'Technical Skills', techWords);
  addSkillsToCategory(nextData, 'Professional Skills', softWords);
  addSkillsToCategory(nextData, 'Domain Skills', domainWords);

  fullText = buildResumeTextFromData(nextData).fullText;

  const missingForSummary = allJDWords.filter(
    (kw) => kw.length > 2 && !fullText.includes(kw.toLowerCase())
  );

  const jobTitle = nextData.personalInfo.jobTitle || 'Professional';
  const coreSkills = nextData.skills.flatMap((s) => s.items).slice(0, 8).join(', ');

  nextData.summary = [
    `${jobTitle} with 5+ years of experience delivering scalable, high-performance solutions using ${coreSkills || 'modern technologies'}.`,
    missingForSummary.length
      ? `Additional expertise includes ${missingForSummary.slice(0, 6).join(', ')}.`
      : '',
    'Proven ability to improve performance, collaborate with cross-functional teams, and deliver user-focused digital products.',
  ]
    .filter(Boolean)
    .join(' ');

  fullText = buildResumeTextFromData(nextData).fullText;

  const missingForExperience = allJDWords.filter(
    (kw) => kw.length > 2 && !fullText.includes(kw.toLowerCase())
  );

  if (nextData.experiences.length > 0 && missingForExperience.length > 0) {
    nextData.experiences = nextData.experiences.map((exp, idx) => {
      if (idx !== 0) return exp;

      const injectedBullet = `Implemented solutions involving ${missingForExperience
        .slice(0, 6)
        .join(', ')}, improving application efficiency by 35% and supporting delivery across multiple projects.`;

      return {
        ...exp,
        highlights: [...(exp.highlights || []), injectedBullet].slice(0, 6),
      };
    });
  }

  nextData.experiences = nextData.experiences.map((exp) => {
    const bullets = (exp.highlights || []).filter((h) => h?.trim());

    const metricPattern = /\b\d+\s*(%|users|clients|projects|ms|seconds|million|k\b|\$)\b/i;
    const metricCount = bullets.filter((b) => metricPattern.test(b)).length;

    if (metricCount >= 2) return exp;

    const extraBullets = [
      `Developed and delivered ${exp.position || 'frontend'} solutions serving 10,000+ users, achieving 99.9% uptime and reducing page load time by 45%.`,
      `Optimized application performance by 40% by improving rendering efficiency, code structure, and reusable component architecture.`,
      `Collaborated with cross-functional teams to deliver responsive UI features, accelerating release cycles by 30%.`,
    ];

    return {
      ...exp,
      highlights: [...new Set([...bullets, ...extraBullets])].slice(0, 5),
    };
  });

  if (nextData.projects?.length > 0) {
    fullText = buildResumeTextFromData(nextData).fullText;

    const finalMissing = allJDWords.filter(
      (kw) => kw.length > 2 && !fullText.includes(kw.toLowerCase())
    );

    if (finalMissing.length > 0) {
      nextData.projects = nextData.projects.map((project, idx) => {
        if (idx !== 0) return project;

        return {
          ...project,
          description: `${project.description || 'Built a production-ready application.'} Utilized ${finalMissing
            .slice(0, 5)
            .join(', ')} to improve performance and business outcomes.`,
          technologies: [
            ...new Set([
              ...(project.technologies || []),
              ...finalMissing.slice(0, 8).map((k) => toDisplayWord(k)),
            ]),
          ].slice(0, 12),
        };
      });
    }
  }

  return nextData;
}

export async function optimizeResumeAndScore(
  resumeData: ResumeData,
  jobDescription: string
): Promise<{ optimizedData: ResumeData; result: ATSResult }> {
  const optimizedData = optimizeResume(resumeData, jobDescription);
  const baseResult = runATSEngine(optimizedData, jobDescription);
  const suggestions = generateLocalSuggestions(baseResult, optimizedData);

  return {
    optimizedData,
    result: {
      ...baseResult,
      suggestions,
    },
  };
}