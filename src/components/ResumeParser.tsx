import React, { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

export interface ParsedResumeData {
  name?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  experiences: Array<{
    position?: string;
    company?: string;
    duration?: string;
    location?: string;
    highlights: string[];
  }>;
  skills: string[];
  education: Array<{
    school?: string;
    degree?: string;
    duration?: string;
    location?: string;
    gpa?: string;
  }>;
  projects: Array<{
    title?: string;
    description?: string;
    highlights?: string[];
    technologies?: string[];
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
}

interface Props {
  onDataExtracted: (data: ParsedResumeData) => void;
  onClose: () => void;
}

const SECTION_HEADER_REGEX =
  /^(roles|responsibilities|roles and responsibilities|experience|work experience|employment|education|objective|summary|profile|skills|technical skills|projects|certifications|references)$/i;

const DATE_RANGE_REGEX =
  /(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\b\d{4})\s(?:-|–|—|to)\s*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\b\d{4}|present|current)/i;

const JOB_TITLE_REGEX =
  /(senior|junior|lead|principal|react|frontend|front end|front-end|backend|back end|back-end|fullstack|full stack|software|web|ui\/ux|sitecore|javascript|typescript).{0,40}(developer|engineer)|\b(developer|engineer|architect|consultant|analyst|manager|designer|lead)\b/i;

const COMPANY_REGEX =
  /\b(pvt|private|ltd|limited|solutions?|software|technologies|tech|partners|systems|company|corp|corporation|inc|llp)\b/i;

const cleanLine = (line: string): string => {
  return line
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/^[•●▪]\s/, '')
    .trim();
};

const normalizeText = (text: string): string => {
  return text
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/<PARSED TEXT FOR PAGE:[\s\S]*?>/gi, '')
    .replace(/<IMAGE FOR PAGE:[\s\S]*?>/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const titleCaseName = (name: string): string => {
  let n = name.trim();

  // L.RAJESH -> L. RAJESH
  n = n.replace(/^([A-Z]).?\s*([A-Z]{2,})$/, '$1. $2');

  // If all uppercase, convert nicely
  if (/^[A-Z .'-]+$/.test(n)) {
    n = n
      .toLowerCase()
      .replace(/\b[a-z]/g, c => c.toUpperCase())
      .replace(/^([A-Z]).\s*/, '$1. ');
  }

  return n.trim();
};

const isBadNameLine = (line: string): boolean => {
  const l = line.toLowerCase();

  if (!line || line.length < 2 || line.length > 60) return true;
  if (line.includes('@')) return true;
  if (/https?:\/\//i.test(line)) return true;
  if (/linkedin\.com/i.test(line)) return true;
  if (/\d{4,}/.test(line)) return true;
  if (/dob|date of birth/i.test(line)) return true;
  if (
    /no\s+\d+|street|road|nagar|chennai|bangalore|mumbai|delhi|pune|hyderabad/i.test(
      line
    )
  )
    return true;
  if (SECTION_HEADER_REGEX.test(line)) return true;
  if (JOB_TITLE_REGEX.test(line)) return true;
  if (
    /roles|responsibilities|objective|summary|profile|skills|projects|education|experience/i.test(
      l
    )
  )
    return true;

  return false;
};

const looksLikeName = (line: string): boolean => {
  const trimmed = line.trim();

  // L.RAJESH, L RAJESH, RAJESH, RAJESH KUMAR
  if (/^([A-Z].?\s*)?[A-Z][A-Z .'-]{2,}$/.test(trimmed)) return true;

  // Rajesh, Rajesh Kumar, L. Rajesh
  if (/^([A-Z].?\s*)?[A-Z][a-z]+(?:[ .'-][A-Z][a-z]+){0,3}$/.test(trimmed))
    return true;

  return false;
};

const extractKnownSkills = (text: string): string[] => {
  const skillPatterns: Array<[string, RegExp]> = [
    ['React', /\breact(?:\.js|js)?\b/i],
    ['Next.js', /\bnext(?:\.js|js)?\b/i],
    ['JavaScript', /\bjava\sscript\b|\bjavascript\b/i],
    ['TypeScript', /\btype\sscript\b|\btypescript\b/i],
    ['HTML', /\bhtml5?\b/i],
    ['CSS', /\bcss3?\b/i],
    ['SCSS', /\bscss\b/i],
    ['Tailwind CSS', /\btailwind(?:\s+css)?\b/i],
    ['Bootstrap', /\bbootstrap\b/i],
    ['Material UI', /\bmaterial\sui\b|\bmui\b/i],
    ['Redux', /\bredux\b/i],
    ['Gatsby', /\bgatsby\b/i],
    ['Sitecore', /\bsitecore\b/i],
    ['Azure', /\bazure\b/i],
    ['Docker', /\bdocker\b/i],
    ['GitHub', /\bgithub\b/i],
    ['Git', /\bgit\b/i],
    ['SQL', /\bsql\b/i],
    ['MySQL', /\bmy\ssql\b|\bmysql\b/i],
    ['Microsoft SQL Server', /\bmicrosoft\s+sql\s+server\b|\bsql\s+server\b/i],
    ['PHP', /\bphp\b/i],
    ['Jest', /\bjest\b/i],
    ['REST API', /\brestful?\s+api\b|\brest\s+api\b/i],
    ['Microservices', /\bmicroservices?\b/i],
    // FIXED (your regex literal was broken)
    ['AI/ML', /\bai\s*\/\s*ml\b|\bmachine learning\b|\bartificial intelligence\b/i],
    ['EC2', /\bec2\b/i],
    ['SEO', /\bseo\b/i],
    ['SSR', /\bssr\b/i],
    ['SSG', /\bssg\b/i],
  ];

  const found: string[] = [];
  for (const [name, regex] of skillPatterns) {
    if (regex.test(text)) found.push(name);
  }
  return Array.from(new Set(found));
};

const ResumeParser: React.FC<Props> = ({ onDataExtracted, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }, []);

  const parseResumeText = useCallback((inputText: string): ParsedResumeData => {
    const text = normalizeText(inputText);

    if (!text || text.length < 20) throw new Error('Text too short');

    const lines = text
      .split('\n')
      .map(cleanLine)
      .filter(Boolean);

    const result: ParsedResumeData = {
      experiences: [],
      skills: [],
      education: [],
      projects: [],
      certifications: [],
    };

    // BASIC INFO
    result.email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];

    result.phone =
      text.match(/(?:\+91[-.\s]?)?[6-9]\d{9}\b/)?.[0] ||
      text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/)?.[0];

    result.linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0];

    result.website = text.match(
      /https?:\/\/[\w.-]+\.(?:com|in|io|co|dev|net|org)[\w/.-]*/i
    )?.[0];

    // Name (top lines)
    const topLines = lines.slice(0, 15);
    const nameLine = topLines.find(line => !isBadNameLine(line) && looksLikeName(line));
    if (nameLine) result.name = titleCaseName(nameLine);

    // Location
    const locationLine = lines.find(line =>
      /\b(chennai|mumbai|delhi|bangalore|bengaluru|hyderabad|kolkata|pune|remote)\b/i.test(
        line
      )
    );
    if (locationLine) result.location = locationLine;

    // SUMMARY / OBJECTIVE
    const objectiveIndex = lines.findIndex(line => /^(objective|summary|profile)\b/i.test(line));
    if (objectiveIndex !== -1) {
      const summaryLines: string[] = [];

      const firstLine = lines[objectiveIndex]
        .replace(/^(objective|summary|profile)\s*[:\-]?\s*/i, '')
        .trim();
      if (firstLine) summaryLines.push(firstLine);

      for (let i = objectiveIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        if (DATE_RANGE_REGEX.test(line)) break;
        if (COMPANY_REGEX.test(line)) break;
        if (/^skills\b/i.test(line)) break;
        if (/^projects?$/i.test(line)) break;
        if (/^education$/i.test(line)) break;
        if (/^experience$/i.test(line)) break;

        if (line.length > 3) summaryLines.push(line);
        if (summaryLines.join(' ').length > 900) break;
      }

      if (summaryLines.length > 0) {
        result.summary = summaryLines.join(' ').replace(/\s+/g, ' ').trim();
      }
    }

    // EXPERIENCE
    const projectStartIndex = lines.findIndex(
      line => /^projects?$/i.test(line) || /^project\s*\d+/i.test(line)
    );
    const expSearchEnd = projectStartIndex === -1 ? lines.length : projectStartIndex;

    const dateIndexes: number[] = [];
    for (let i = 0; i < expSearchEnd; i++) {
      if (DATE_RANGE_REGEX.test(lines[i])) dateIndexes.push(i);
    }

    dateIndexes.forEach(dateIndex => {
      const duration = lines[dateIndex].match(DATE_RANGE_REGEX)?.[0] || lines[dateIndex];

      let positionIndex = -1;
      for (let i = dateIndex - 1; i >= Math.max(0, dateIndex - 15); i--) {
        const line = lines[i];
        if (
          JOB_TITLE_REGEX.test(line) &&
          !DATE_RANGE_REGEX.test(line) &&
          line.length < 120
        ) {
          positionIndex = i;
          break;
        }
      }
      if (positionIndex === -1) return;

      let companyIndex = -1;
      for (let i = positionIndex - 1; i >= Math.max(0, positionIndex - 5); i--) {
        const line = lines[i];
        if (
          line &&
          !SECTION_HEADER_REGEX.test(line) &&
          !DATE_RANGE_REGEX.test(line) &&
          !JOB_TITLE_REGEX.test(line) &&
          !/^objective\b/i.test(line) &&
          !/^summary\b/i.test(line) &&
          !line.startsWith('-') &&
          line.length < 120
        ) {
          companyIndex = i;
          break;
        }
      }

      const company = companyIndex !== -1 ? lines[companyIndex] : '';
      const position = lines[positionIndex];

      const highlights: string[] = [];
      for (let i = positionIndex + 1; i < dateIndex; i++) {
        const h = lines[i];
        if (!h) continue;
        if (SECTION_HEADER_REGEX.test(h)) continue;
        if (DATE_RANGE_REGEX.test(h)) continue;
        if (/^skills used/i.test(h)) continue;
        if (/^technology used/i.test(h)) continue;

        highlights.push(h.replace(/^[-•*]\s*/, '').trim());
      }

      const duplicate = result.experiences.some(
        exp =>
          (exp.company || '').toLowerCase() === company.toLowerCase() &&
          (exp.position || '').toLowerCase() === position.toLowerCase() &&
          exp.duration === duration
      );

      if (!duplicate) {
        result.experiences.push({
          company,
          position,
          duration,
          location: '',
          highlights: highlights.slice(0, 8),
        });
      }
    });

    // job title
    if (result.experiences.length > 0) {
      result.jobTitle = result.experiences[0].position;
    } else {
      const titleLine = topLines.find(line => JOB_TITLE_REGEX.test(line) && line.length < 80);
      if (titleLine) result.jobTitle = titleLine;
    }

    // EDUCATION
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/(college|university|school|institute|engineering college)/i.test(line)) {
        const degreeLine = lines[i + 1] || '';
        const durationLine = lines[i + 2] || '';

        const durationMatch =
          durationLine.match(/\b(19|20)\d{2}\b(?:\s*[—-]\s*\d{2,4})?/)?.[0] ||
          degreeLine.match(/\b(19|20)\d{2}\b/)?.[0] ||
          '';

        const exists = result.education.some(edu => (edu.school || '').toLowerCase() === line.toLowerCase());
        if (!exists) {
          result.education.push({
            school: line,
            degree: degreeLine && !DATE_RANGE_REGEX.test(degreeLine) ? degreeLine : '',
            duration: durationMatch,
          });
        }
      }
    }

    // SKILLS
    const skillsIndex = lines.findIndex(line => /^skills\b(?!\s+used)/i.test(line));
    if (skillsIndex !== -1) {
      const skillLines: string[] = [];
      const firstSkillLine = lines[skillsIndex].replace(/^skills\s*[:\-]?\s*/i, '').trim();
      if (firstSkillLine) skillLines.push(firstSkillLine);

      for (let i = skillsIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^projects?$/i.test(line) || /^project\s*\d+/i.test(line)) break;
        if (/^experience$/i.test(line) || /^education$/i.test(line)) break;
        if (line.length > 0 && line.length < 300) skillLines.push(line);
      }

      const skillText = skillLines.join(' ');
      const knownSkills = extractKnownSkills(skillText);

      if (knownSkills.length > 0) result.skills.push(`Technical Skills: ${knownSkills.join(', ')}`);
      else if (skillText.trim()) result.skills.push(`Technical Skills: ${skillText.trim()}`);
    } else {
      const knownSkills = extractKnownSkills(text);
      if (knownSkills.length > 0) result.skills.push(`Technical Skills: ${knownSkills.join(', ')}`);
    }

    // PROJECTS
    const firstProjectIndex = lines.findIndex(
      line => /^projects?$/i.test(line) || /^project\s*\d+/i.test(line)
    );

    if (firstProjectIndex !== -1) {
      let currentProject: {
        title?: string;
        description?: string;
        highlights: string[];
        technologies: string[];
      } | null = null;

      const pushProject = () => {
        if (!currentProject) return;

        currentProject.description = currentProject.highlights
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        currentProject.technologies = Array.from(new Set(currentProject.technologies));
        if (currentProject.title || currentProject.description) result.projects.push(currentProject);
      };

      for (let i = firstProjectIndex; i < lines.length; i++) {
        const line = lines[i];

        if (/^projects?$/i.test(line)) continue;

        const projectMatch = line.match(/^project\s*\d+\s*[:\-]?\s*(.+)?$/i);
        if (projectMatch) {
          pushProject();
          currentProject = {
            title: projectMatch[1]?.trim() || `Project ${result.projects.length + 1}`,
            description: '',
            highlights: [],
            technologies: [],
          };
          continue;
        }

        if (!currentProject) continue;

        if (/^skills used/i.test(line) || /^technology used/i.test(line)) {
          const techText = line.replace(/^(skills used|technology used)\s*[:\-]?\s*/i, '');
          currentProject.technologies.push(...extractKnownSkills(techText));
          continue;
        }

        const techs = extractKnownSkills(line);
        if (techs.length > 0) currentProject.technologies.push(...techs);

        if (/^(duration|worked from)\b/i.test(line)) continue;

        if (line.length > 2) currentProject.highlights.push(line);
      }

      pushProject();
    }

    return result;
  }, []);

  const extractFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib
      .getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      })
      .promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const items = (content.items as any[])
        .filter(item => item.str && item.str.trim())
        .map(item => ({
          str: item.str,
          x: item.transform[4] || 0,
          y: item.transform[5] || 0,
        }))
        .sort((a, b) => {
          const yDiff = b.y - a.y;
          if (Math.abs(yDiff) > 4) return yDiff;
          return a.x - b.x;
        });

      const rows: Array<{ y: number; items: Array<{ str: string; x: number; y: number }> }> =
        [];

      items.forEach(item => {
        const row = rows.find(r => Math.abs(r.y - item.y) <= 4);
        if (row) row.items.push(item);
        else rows.push({ y: item.y, items: [item] });
      });

      rows
        .sort((a, b) => b.y - a.y)
        .forEach(row => {
          const line = row.items
            .sort((a, b) => a.x - b.x)
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (line) fullText += line + '\n';
        });

      fullText += '\n';
    }

    return normalizeText(fullText);
  };

  const extractFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const xmlString = await zip.file('word/document.xml')?.async('string');
    if (!xmlString) throw new Error('Invalid DOCX file');

    return xmlString
      .replace(/<w:tab\/>/g, ' ')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<\/w:tr>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError('');
    setRawText('');
    e.target.value = '';

    try {
      const ext = file.name.toLowerCase().split('.').pop();
      let extractedText = '';

      if (ext === 'pdf') extractedText = await extractFromPDF(file);
      else if (ext === 'docx') extractedText = await extractFromDOCX(file);
      else throw new Error('Only PDF and DOCX files are supported');

      if (extractedText.length < 50) {
        setError('Could not extract enough text. Please paste resume text manually.');
        return;
      }

      setRawText(extractedText);

      const parsed = parseResumeText(extractedText);
      onDataExtracted(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleManualParse = () => {
    if (!rawText.trim()) {
      setError('Please paste resume text first');
      return;
    }

    try {
      const parsed = parseResumeText(rawText);
      onDataExtracted(parsed);
    } catch (err: any) {
      setError(err?.message || 'Parsing failed');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block cursor-pointer group">
          <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-8 text-center transition-colors bg-indigo-50/50 group-hover:bg-indigo-50">
            <div className="text-4xl mb-3">📄</div>

            <div className="font-semibold text-indigo-600 text-lg">
              {loading ? 'Processing...' : 'Click to Upload Resume'}
            </div>

            <div className="text-xs text-slate-500 mt-2">PDF and Word DOCX supported</div>

            {fileName && !loading && (
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                ✓ {fileName}
              </div>
            )}

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              disabled={loading}
              className="hidden"
            />
          </div>
        </label>
      </div>

      <div className="space-y-2">
    
        <div className="flex gap-3">
    

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          <strong>⚠️ {error}</strong>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;
