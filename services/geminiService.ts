import { GoogleGenAI } from "@google/genai";
import { FamilyMember } from "../types";

// Robust way to get API Key in both AI Studio (process.env) and Vite/Vercel (import.meta.env)
// @ts-ignore - Suppress TS checking for environment variable differences
const getApiKey = () => {
  // Check for Vite (Vercel/Local)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}
  
  // Check for Node/Process (AI Studio)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {}

  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const generateBiography = async (member: FamilyMember): Promise<string> => {
  if (!apiKey) {
    return "API Key 未配置。请检查您的环境变量 (VITE_API_KEY)。";
  }

  const prompt = `
    Create a short, engaging biography (approx 150 words) for a family tree application.
    Language: Simplified Chinese (zh-CN).
    
    Subject Details:
    - Name: ${member.name}
    - Gender: ${member.gender}
    - Birth Date: ${member.birthDate}
    - Birth Place: ${member.birthPlace || 'Unknown'}
    - Occupation: ${member.occupation || 'Unknown'}
    
    Instructions:
    1. Write in a respectful, storytelling tone.
    2. If the birth year is known, mention 1-2 significant historical events from that era (global or Chinese history) to provide context.
    3. If details are missing, creatively describe the era they lived in based on the date.
    4. Do not make up specific personal facts not provided, but elaborate on the lifestyle of their occupation/era.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成传记。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成传记时遇到错误，请稍后再试。";
  }
};