import { JOB_PROFILES } from '../constants/jobProfiles';

export async function generateWithAI(prompt: string, apiKey?: string): Promise<string> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert career coach and professional resume writer.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      if (data.choices?.[0]?.message) return data.choices[0].message.content.trim();
    } catch (e) {
      console.error('OpenAI API error:', e);
    }
  }
  return simulateAIResponse(prompt);
}

function simulateAIResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('summary')) {
    if (lower.includes('software')) return JOB_PROFILES.software_engineer.suggestedSummary;
    if (lower.includes('data')) return JOB_PROFILES.data_scientist.suggestedSummary;
    if (lower.includes('product')) return JOB_PROFILES.product_manager.suggestedSummary;
    if (lower.includes('design')) return JOB_PROFILES.ui_ux_designer.suggestedSummary;
    if (lower.includes('market')) return JOB_PROFILES.digital_marketer.suggestedSummary;
    return 'Highly motivated professional with a strong track record of success, specializing in cross-functional collaboration and delivering high-impact solutions.';
  }
  return 'Successfully analyzed target metrics and engineered standard operation strategies, facilitating improved engagement frameworks and measurable business growth.';
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
