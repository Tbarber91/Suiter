import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};
