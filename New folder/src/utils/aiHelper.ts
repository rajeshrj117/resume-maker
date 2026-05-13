type AIOutputMode = 'json' | 'text';

export async function generateWithAI(
  prompt: string,
  apiKey?: string,
  mode: AIOutputMode = 'text'
): Promise<string> {
  if (!apiKey?.trim()) {
    return simulateAIResponse(prompt, mode);
  }

  const trimmedKey = apiKey.trim();
  const isGeminiKey = trimmedKey.startsWith('AIza');

  try {
    if (isGeminiKey) {
      return await callGeminiAPI(prompt, trimmedKey);
    }
    return await callOpenAI(prompt, trimmedKey, mode);
  } catch (err: any) {
    console.error('AI request failed, using fallback:', err.message);
    return simulateAIResponse(prompt, mode);
  }
}

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) throw new Error('Empty Gemini response');
  return text;
}

async function callOpenAI(
  prompt: string,
  apiKey: string,
  mode: AIOutputMode
): Promise<string> {
  const systemPrompt =
    mode === 'json'
      ? 'You are an expert ATS optimizer. Return only valid JSON. No markdown.'
      : 'You are an expert resume writer. Return only plain text. No markdown. No JSON unless explicitly requested.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed');
  }

  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Invalid OpenAI response');

  return content;
}

function simulateAIResponse(prompt: string, mode: AIOutputMode): string {
  const lowerPrompt = prompt.toLowerCase();

  if (mode === 'text') {
    if (lowerPrompt.includes('professional summary')) {
      return 'Senior Frontend Developer with 5+ years of experience building scalable, high-performance web applications using React.js, Next.js, JavaScript, TypeScript, Redux, HTML5, CSS3, and Tailwind CSS. Proven ability to improve performance, implement responsive interfaces, and collaborate with cross-functional teams to deliver user-focused products.';
    }

    if (lowerPrompt.includes('bullet')) {
      return 'Developed scalable frontend features using React.js and Next.js, improving page load time by 45% and supporting 10,000+ users.';
    }

    return 'Add more relevant keywords, measurable achievements, and stronger action verbs to improve ATS alignment.';
  }

  return JSON.stringify([
    'Add more keywords from the job description into your skills and summary.',
    'Use measurable impact in experience bullets, such as performance gains and user counts.',
    'Strengthen your summary with role-specific technologies and outcomes.',
    'Ensure each work experience includes action verbs and business impact.'
  ]);
}