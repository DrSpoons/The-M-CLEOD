
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getThematicWisdom(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Wisdom is currently shrouded in mystery...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars are silent today. (Check API Key)";
  }
}
