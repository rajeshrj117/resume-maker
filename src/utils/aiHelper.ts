import { JOB_PROFILES } from '../constants/jobProfiles';

export async function generateWithAI(prompt: string, apiKey?: string): Promise<string> {
  if (!apiKey?.trim()) {
    console.log('⚠️ No API key → Using smart simulator');
    return simulateAIResponse(prompt);
  }

  const isGeminiKey = apiKey.trim().startsWith('AIza');
  
  if (isGeminiKey) {
    return callGeminiAPI(prompt, apiKey.trim());
  } else {
    return callOpenAI(prompt, apiKey.trim());
  }
}

// ====================== GEMINI API (Improved) ======================
async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Error:', errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) throw new Error('Empty response from Gemini');

    console.log('✅ Gemini Raw Response:', text);
    return text;
  } catch (err: any) {
    console.error('Gemini API failed, falling back to smart simulator:', err.message);
    return simulateAIResponse(prompt);
  }
}

// ====================== OPENAI API ======================
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert ATS optimizer. Always respond with **only** valid JSON, no explanations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    throw new Error('Invalid OpenAI response');
  } catch (err: any) {
    console.error('OpenAI failed, using simulator:', err.message);
    return simulateAIResponse(prompt);
  }
}

// ====================== SMART DYNAMIC SIMULATOR ======================
function simulateAIResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract Job Description part
  const jdMatch = prompt.match(/Job Description:([\s\S]*?)(?=\n\n|$)/i);
  const jobDescription = jdMatch ? jdMatch[1].trim() : prompt;

  const isVideoEditor = /premiere|after effects|motion graphics|video editing|animation|storyboarding|adobe/i.test(jobDescription);
  const isFrontend = /react|javascript|frontend|tailwind|typescript|vue|web development/i.test(jobDescription);
  const isData = /power bi|tableau|sql|python|data analyst|dashboard/i.test(jobDescription);

  let atsScore = 45;
  let missingKeywords: string[] = [];
  let suggestions: string[] = [];

  if (isVideoEditor) {
    atsScore = 38;
    missingKeywords = ["Adobe Premiere Pro", "After Effects", "Motion Graphics", "Storyboarding", "Video Editing", "Adobe Suite", "Animation Principles"];
    suggestions = [
      "Add 'Adobe Premiere Pro', 'After Effects', and 'Motion Graphics' to your Technical Skills section",
      "Rewrite your summary to highlight video editing and animation experience",
      "Add specific project examples with metrics (e.g., 'Created 50+ marketing videos that increased engagement by 40%')",
      "Include keywords like 'storyboarding', 'brand consistency', and 'motion graphics' in your experience bullets"
    ];
  } 
  else if (isFrontend) {
    atsScore = 82;
    missingKeywords = ["Next.js", "Redux", "Jest", "Responsive Design", "Figma"];
    suggestions = [
      "Add missing modern frontend keywords like Next.js and Redux",
      "Quantify your achievements with metrics (users, performance improvements)",
      "Emphasize WCAG compliance and accessibility more prominently"
    ];
  } 
  else if (isData) {
    atsScore = 76;
    missingKeywords = ["Power BI", "Tableau", "ETL", "Statistical Analysis"];
    suggestions = [
      "Add Power BI and Tableau to skills section with practical examples",
      "Include more quantifiable achievements with percentages",
      "Mention specific tools from the JD in your experience bullets"
    ];
  } 
  else {
    // Generic fallback
    atsScore = 62;
    missingKeywords = ["Leadership", "Agile", "Stakeholder Management", "Cross-functional Collaboration"];
    suggestions = [
      "Incorporate more keywords directly from the job description",
      "Add quantifiable metrics to your experience bullets",
      "Strengthen your professional summary with role-specific language"
    ];
  }

  const result = {
    atsScore: atsScore,
    breakdown: {
      keywordMatch: Math.floor(atsScore * 0.7),
      experienceQuality: Math.floor(atsScore * 0.9),
      sectionCompleteness: 85,
      format: 95
    },
    missingCriticalKeywords: missingKeywords,
    matchedKeywords: ["React", "JavaScript", "Team Collaboration", "Problem Solving"].filter(k => !missingKeywords.includes(k)),
    suggestions: suggestions
  };

  console.log('🔧 Using Smart Simulator for JD type:', isVideoEditor ? 'Video Editor' : isFrontend ? 'Frontend' : 'Other');
  return JSON.stringify(result, null, 2);
}

export function parseOldResumeText(text: string) {
  const lines = text.split('\n');
  const result: any = {
    personalInfo: {},
    skills: [{ id: '1', category: 'Skills', items: [] }]
  };
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    if (line.length > 5 && !line.includes('@') && !line.match(/\d/)) {
      result.personalInfo.fullName = line;
      break;
    }
  }
  return result;
}