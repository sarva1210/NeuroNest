import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const generateSummary = async (text) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `Summarize this in 3 bullet points:\n${text}`
  );

  return result.response.text();
};