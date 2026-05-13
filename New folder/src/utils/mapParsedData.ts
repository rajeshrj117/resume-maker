import { ResumeData } from '../types';
import { ParsedResumeData } from '../components/ResumeParser';

const clean = (str?: string | null, maxLen: number = 200): string => {
  if (!str) return '';
  return String(str)
    .replace(/\u00a0/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, maxLen);
};

const toBullets = (raw: string[] | string | undefined): string[] => {
  if (!raw) return [''];

  if (Array.isArray(raw)) {
    const cleaned = raw.map(h => clean(h, 300)).filter(h => h.length > 1);
    return cleaned.length > 0 ? cleaned : [''];
  }

  // FIXED: hyphen at end of character class to avoid range error
  const bullets = String(raw)
    .split(/(?=[•*-])|\n\s*[•*-]\s*|\n\d+[.)]\s*|;\s*/gm)
    .map(s => s.replace(/^[•*-]\s*/, '').trim())
    .filter(s => s.length > 5 && !/^\d{4}$/.test(s))
    .slice(0, 10);

  return bullets.length > 0 ? bullets : [clean(String(raw), 300)];
};

const normalizeDuration = (dateStr?: string): string => {
  if (!dateStr) return '';
  return dateStr
    .replace(/\s+/g, ' ')
    .replace(/[—–]/g, '-')
    .trim()
    .substring(0, 40);
};

const splitSkillItems = (itemsStr: string): string[] => {
  return itemsStr
    .split(/[,;|]/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length < 50);
};

export const mapParsedToResumeData = (
  parsed: ParsedResumeData,
  currentData: ResumeData
): ResumeData => {
  const newData: ResumeData = { ...currentData };

  // PERSONAL INFO
  newData.personalInfo = {
    ...currentData.personalInfo,
    fullName: clean(parsed.name, 60) || currentData.personalInfo.fullName,
    jobTitle: clean(parsed.jobTitle, 80) || currentData.personalInfo.jobTitle,
    email: clean(parsed.email, 100).toLowerCase() || currentData.personalInfo.email,
    phone:
      clean(parsed.phone, 25).replace(/[^\d+\-\s]/g, '') ||
      currentData.personalInfo.phone,
    location: clean(parsed.location, 100) || currentData.personalInfo.location,
    linkedin: clean(parsed.linkedin, 200) || currentData.personalInfo.linkedin,
    website: clean(parsed.website, 200) || currentData.personalInfo.website,
    photo: currentData.personalInfo.photo,
  };

  if (parsed.summary) {
    newData.summary = clean(parsed.summary, 1000) || currentData.summary;
  }

  // EXPERIENCE
  if (Array.isArray(parsed.experiences) && parsed.experiences.length > 0) {
    newData.experiences = parsed.experiences
      .filter(exp => exp.position || exp.company || exp.duration)
      .map((exp, index) => ({
        id:
          currentData.experiences?.[index]?.id ||
          `imp-exp-${Date.now()}-${index}`,
        company: clean(exp.company, 100),
        position: clean(exp.position, 100),
        duration: normalizeDuration(exp.duration),
        location: clean(exp.location, 80),
        highlights: toBullets(exp.highlights),
      }));
  }

  // EDUCATION
  if (Array.isArray(parsed.education) && parsed.education.length > 0) {
    newData.education = parsed.education
      .filter(edu => edu.school || edu.degree)
      .map((edu, index) => ({
        id:
          currentData.education?.[index]?.id ||
          `imp-edu-${Date.now()}-${index}`,
        school: clean(edu.school, 120),
        degree: clean(edu.degree, 120),
        duration: clean(edu.duration, 40),
        location: clean(edu.location, 80),
        gpa: clean(edu.gpa, 20),
      }));
  }

  // SKILLS
  if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
    const skillGroups: Array<{ category: string; items: string[] }> = [];

    parsed.skills.forEach(line => {
      const lineClean = clean(line, 500);
      if (!lineClean) return;

      if (lineClean.includes(':')) {
        const match = lineClean.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          const category = clean(match[1], 80) || 'Technical Skills';
          const items = splitSkillItems(match[2]);
          if (items.length > 0) {
            skillGroups.push({ category, items });
          }
        }
      } else {
        const items = splitSkillItems(lineClean);
        if (items.length > 0) {
          skillGroups.push({ category: 'Technical Skills', items });
        }
      }
    });

    if (skillGroups.length > 0) {
      newData.skills = skillGroups.map((group, index) => ({
        id:
          currentData.skills?.[index]?.id ||
          `imp-skill-${Date.now()}-${index}`,
        category: group.category,
        items: Array.from(new Set(group.items)),
      }));
    }
  }

  // PROJECTS
  if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
    newData.projects = parsed.projects
      .filter(project => project.title || project.description || project.highlights?.length)
      .map((project, index) => ({
        id:
          currentData.projects?.[index]?.id ||
          `imp-proj-${Date.now()}-${index}`,
        title: clean(project.title, 120) || `Project ${index + 1}`,
        description: clean(
          project.description || project.highlights?.join(' ') || '',
          800
        ),
        technologies: Array.isArray(project.technologies)
          ? Array.from(
              new Set(
                project.technologies.map(t => clean(t, 50)).filter(Boolean)
              )
            )
          : [],
      }));
  }

  // CERTIFICATIONS
  if (Array.isArray(parsed.certifications) && parsed.certifications.length > 0) {
    newData.certifications = parsed.certifications.map((cert, index) => ({
      id:
        currentData.certifications?.[index]?.id ||
        `imp-cert-${Date.now()}-${index}`,
      name: clean(cert.name, 120),
      issuer: clean(cert.issuer, 120),
      date: clean(cert.date, 40),
    }));
  }

  return newData;
};

export default mapParsedToResumeData;