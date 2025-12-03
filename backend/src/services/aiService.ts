
import axios, { AxiosInstance } from 'axios';
import NodeCache from 'node-cache';
import { z } from 'zod';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const cache = new NodeCache({ stdTTL: 600 });

async function callGemini(prompt: string, cacheKey?: string) {
  if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey);
  if (!GEMINI_API_KEY) return { mock: true, result: `Mocked response for: ${prompt}` };
  
  try {
    // Use gemini-2.5-flash which is available and supports generateContent
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await axios.post(url, { 
      contents: [{ parts: [{ text: prompt }] }] 
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = response.data;
    // Extract text from Gemini response
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (cacheKey) cache.set(cacheKey, text);
    return text;
  } catch (err: any) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.error?.message || err.message || 'Gemini API error');
  }
}

export async function predictSeverity({ title, description }: { title: string; description: string }) {
  const prompt = `Analyze this bug report and predict its severity. Only respond with one word: "low", "medium", "high", or "critical".

Bug Title: ${title}
Bug Description: ${description}

Severity:`;
  const result = await callGemini(prompt, `severity:${title}:${description}`);
  if (typeof result === 'object' && result.mock) return 'medium';
  const text = typeof result === 'string' ? result.toLowerCase() : '';
  if (text.includes('critical')) return 'critical';
  if (text.includes('high')) return 'high';
  if (text.includes('low')) return 'low';
  return 'medium';
}

export async function estimateResolutionTime({ title, description }: { title: string; description: string }) {
  const prompt = `Estimate the resolution time in hours for this bug. Only respond with a number (e.g., 2, 4, 8, 16).

Bug Title: ${title}
Bug Description: ${description}

Estimated hours:`;
  const result = await callGemini(prompt, `time:${title}:${description}`);
  if (typeof result === 'object' && result.mock) return 4;
  const text = typeof result === 'string' ? result : '';
  const hours = parseInt(text.match(/\d+/)?.[0] || '4');
  return hours > 0 ? hours : 4;
}

export async function classifyBugType({ title, description }: { title: string; description: string }) {
  const prompt = `Classify this bug type. Respond with one word: "UI", "Backend", "API", "Database", "Performance", "Security", or "Other".

Bug Title: ${title}
Bug Description: ${description}

Type:`;
  const result = await callGemini(prompt, `type:${title}:${description}`);
  if (typeof result === 'object' && result.mock) return 'UI';
  const text = typeof result === 'string' ? result.toLowerCase() : '';
  if (text.includes('ui') || text.includes('frontend')) return 'UI';
  if (text.includes('backend') || text.includes('server')) return 'Backend';
  if (text.includes('api')) return 'API';
  if (text.includes('database') || text.includes('db')) return 'Database';
  if (text.includes('performance')) return 'Performance';
  if (text.includes('security')) return 'Security';
  return 'Other';
}

export async function generateSummary(input: any) {
  const prompt = `Generate a concise summary (2-3 sentences) for this bug report:

${JSON.stringify(input, null, 2)}

Summary:`;
  const result = await callGemini(prompt);
  if (typeof result === 'object' && result.mock) return result.result || 'No summary available';
  return typeof result === 'string' ? result.trim() : 'No summary';
}

export async function findDuplicates(input: any) {
  // Simple local similarity fallback
  if (!GEMINI_API_KEY) {
    return { duplicates: [] };
  }
  const prompt = `Analyze this bug report and identify if there are any duplicate bugs. Respond with a JSON array of duplicate bug IDs if found, or an empty array [] if no duplicates.

Bug Report: ${JSON.stringify(input)}

Response format: ["bug-id-1", "bug-id-2"] or []`;
  const result = await callGemini(prompt);
  if (typeof result === 'object' && result.mock) return { duplicates: [] };
  try {
    // Try to parse JSON from the response
    const text = typeof result === 'string' ? result.trim() : '';
    const jsonMatch = text.match(/\[.*?\]/);
    if (jsonMatch) {
      const duplicates = JSON.parse(jsonMatch[0]);
      return { duplicates: Array.isArray(duplicates) ? duplicates : [] };
    }
  } catch (e) {
    // If parsing fails, return empty array
  }
  return { duplicates: [] };
}

export async function recommendPriority(input: any) {
  const prompt = `Recommend priority for this bug. Only respond with one word: "low", "medium", or "high".

Bug Details: ${JSON.stringify(input)}

Priority:`;
  const result = await callGemini(prompt);
  if (typeof result === 'object' && result.mock) return 'medium';
  const text = typeof result === 'string' ? result.toLowerCase() : '';
  if (text.includes('high')) return 'high';
  if (text.includes('low')) return 'low';
  return 'medium';
}

export async function analyzeSentiment(input: any) {
  const prompt = `Analyze the sentiment of this bug report. Only respond with one word: "positive", "neutral", or "negative".

Bug Report: ${JSON.stringify(input)}

Sentiment:`;
  const result = await callGemini(prompt);
  if (typeof result === 'object' && result.mock) return 'neutral';
  const text = typeof result === 'string' ? result.toLowerCase() : '';
  if (text.includes('positive')) return 'positive';
  if (text.includes('negative')) return 'negative';
  return 'neutral';
}

export async function parseQuery(input: any) {
  const prompt = `Parse this search query and extract key terms. Respond with a JSON object containing: { "keywords": [], "filters": {} }.

Query: ${JSON.stringify(input)}

Response:`;
  const result = await callGemini(prompt);
  if (typeof result === 'object' && result.mock) return {};
  try {
    const text = typeof result === 'string' ? result.trim() : '';
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If parsing fails, return empty object
  }
  return {};
}

export default {
  predictSeverity,
  estimateResolutionTime,
  classifyBugType,
  generateSummary,
  recommendPriority,
  findDuplicates,
  analyzeSentiment,
  parseQuery
};
