# AI Resume Builder - Specification Document

## 1. Concept & Vision

**ResumAI** is a smart, modern resume builder that leverages AI to help job seekers create polished, professional resumes in minutes. It combines the convenience of AI-assisted content generation with beautiful, employer-tested templates. The experience feels empowering rather than intimidating—like having a professional career coach guiding you through every section.

The app exudes confidence and professionalism while remaining approachable, using subtle animations and clean interfaces to make the resume-building process feel effortless and even enjoyable.

## 2. Design Language

### Aesthetic Direction
Inspired by modern SaaS productivity tools like Linear and Notion—clean, spacious, with purposeful use of color and typography. Professional but not corporate; modern but not trendy.

### Color Palette
- **Primary**: `#6366F1` (Indigo - represents creativity and intelligence)
- **Secondary**: `#0EA5E9` (Sky Blue - trust and clarity)
- **Accent**: `#10B981` (Emerald - success and growth)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Background**: `#F8FAFC` (Slate 50)
- **Surface**: `#FFFFFF` (White)
- **Text Primary**: `#1E293B` (Slate 800)
- **Text Secondary**: `#64748B` (Slate 500)
- **Border**: `#E2E8F0` (Slate 200)

### Typography
- **Headings**: Inter (Google Fonts) - weight 600, 700
- **Body**: Inter - weight 400, 500
- **Resume Content**: Inter for templates, with template-specific fonts
- **Fallback**: system-ui, -apple-system, sans-serif

### Spatial System
- Base unit: 4px
- Component padding: 12px, 16px, 24px
- Section spacing: 32px, 48px
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Max content width: 1200px

### Motion Philosophy
- Subtle, purposeful animations (150-300ms)
- Ease-out for entrances, ease-in-out for state changes
- Micro-interactions on buttons and form elements
- Smooth template transitions
- Progress indicators for AI processing

### Visual Assets
- Lucide React icons
- Gradient accents on key CTAs
- Subtle shadows for depth (shadow-sm, shadow-md)
- Template previews with realistic styling

## 3. Layout & Structure

### Page Structure
1. **Header**: Logo, navigation tabs (Templates, Editor, Preview), and action buttons
2. **Hero Section**: Value proposition with AI features highlight
3. **Template Gallery**: Scrollable grid of template cards with categories
4. **Resume Editor**: Multi-section form with live preview
5. **AI Assistant Panel**: Chat-like interface for content suggestions
6. **Export Section**: PDF options and download

### Responsive Strategy
- Desktop: Side-by-side editor and preview
- Tablet: Stacked with collapsible preview
- Mobile: Tab-based navigation between edit and preview

### Flow
1. Landing → Template Selection
2. Template Selection → Resume Editor (with selected template)
3. Editor → AI suggestions → Content refinement
4. Editor → Live Preview → PDF Export

## 4. Features & Interactions

### Core Features

#### 4.1 Template Gallery
- 6 distinct templates: Modern, Professional, Creative, Minimal, Executive, Tech
- Category filters: All, Professional, Creative, Simple
- Hover: Slight scale-up, shadow increase, "Use Template" overlay
- Click: Selects template and navigates to editor

#### 4.2 Resume Editor
- **Personal Info Section**: Name, email, phone, location, LinkedIn, portfolio
- **Professional Summary**: AI-assisted text generation
- **Work Experience**: Multiple entries with company, title, dates, description
- **Education**: Degrees, institutions, dates, GPA (optional)
- **Skills**: Tag-based input with categorization
- **Projects**: Optional section with tech stack and links
- **Certifications**: Optional additional section

#### 4.3 AI Assistant
- **Smart Suggestions**: Analyzes job type and suggests relevant keywords
- **Content Enhancement**: Helps rewrite bullet points for impact
- **Summary Generator**: Creates professional summary from basic info
- **Skills Parser**: Identifies skills from uploaded resume

#### 4.4 Job Types
- Dropdown selection: Software Engineer, Data Scientist, Product Manager, Designer, Marketing, Sales, Operations, Finance, Healthcare, Education
- Each job type loads relevant skills and suggested phrasing
- Industry-specific tips displayed

#### 4.5 Resume Upload (ATS Import)
- Drag-and-drop zone for PDF upload
- Parses existing resume to auto-fill fields
- Shows parsing progress with step indicators
- Allows review and editing of parsed content
- Supports PDF format

#### 4.6 PDF Export
- Real-time preview of final resume
- Multiple export options:
  - Standard PDF (A4)
  - US Letter format
  - With/without headers
- Download button with loading state
- Uses html2pdf.js for high-quality conversion

### Interaction Details
- **Form inputs**: Focus ring with primary color, smooth label transitions
- **Add/Remove entries**: Slide-in animation for new items, fade-out for removal
- **Template switch**: Crossfade transition between templates
- **AI generation**: Pulsing glow effect during processing
- **Error states**: Red border, inline error message, shake animation

### Edge Cases
- Empty resume warning before export
- Character limits on summary (max 500 chars)
- Date validation (end date must be after start date)
- Required field indicators
- Auto-save every 30 seconds to localStorage

## 5. Component Inventory

### TemplateCard
- States: default, hover, selected, loading
- Shows: template preview thumbnail, name, category badge
- Hover: scale(1.02), shadow-lg, "Use Template" button appears

### FormSection
- Collapsible accordion style
- Header with section name, completion indicator
- States: collapsed, expanded, complete, has-error

### InputField
- States: default, focused, filled, disabled, error
- Floating label animation
- Helper text slot below

### ExperienceEntry
- Card-style container with fields
- Add button, delete button (trash icon)
- Drag handle for reordering

### AIAssistButton
- Sparkles icon with gradient background
- States: default, loading (pulsing), success
- Tooltip on hover showing capabilities

### JobTypeSelector
- Dropdown with search
- Grouped by industry
- Selected state shows checkmark

### UploadZone
- Dashed border, cloud icon
- States: default, drag-over (highlighted), uploading, success, error
- File type and size hints

### PreviewPanel
- Scaled resume preview (zoomable)
- Page navigation for multi-page resumes
- Export buttons fixed at bottom

### ExportButton
- Primary CTA style
- Loading spinner during generation
- Success checkmark after download

## 6. Technical Approach

### Framework & Libraries
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **html2pdf.js** for PDF generation
- **Lucide React** for icons
- **pdf.js** for resume parsing (client-side)

### State Management
- React useState/useReducer for form state
- localStorage for auto-save and persistence
- Context for template selection and app-wide state

### Key Implementation Decisions
- Modular component architecture
- Template system using CSS classes for easy switching
- PDF generation using html2pdf.js with custom options
- Resume parsing using pdf.js to extract text and structure
- AI features simulated with pre-built content suggestions per job type

### Data Model
```typescript
interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: string[];
  jobType: string;
  template: string;
}

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}
```

### Auto-save Strategy
- Debounced save to localStorage on every change (500ms)
- Load from localStorage on app mount
- Clear option in settings
