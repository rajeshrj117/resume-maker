export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  jobTitle: string;
  photo: string; // Base64 photo
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  highlights: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  duration: string;
  location: string;
  gpa?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
}

export type TemplateId = number; // 0-19

export interface ThemeColor {
  name: string;
  primary: string;
  light: string;
  dark: string;
}

export interface JobProfile {
  id: string;
  title: string;
  suggestedSkills: string[];
  suggestedSummary: string;
  suggestedHighlights: string[];
}

export interface FontSettings {
  family: string;
  size: 'compact' | 'normal' | 'large';
}

export const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, system-ui, -apple-system, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times', value: '"Times New Roman", Times, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Helvetica', value: '"Helvetica Neue", Helvetica, sans-serif' },
];

export const FONT_SIZES = {
  compact: { base: 9.5, h1: 24, h2: 11, h3: 11, body: 9.5, small: 8.5 },
  normal: { base: 11, h1: 28, h2: 13, h3: 12, body: 11, small: 10 },
  large: { base: 12, h1: 32, h2: 14, h3: 13, body: 12, small: 11 },
};
