import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const generateSummary = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    const result = await model.generateContent(text);
    const response = await result.response;

    return response.text();
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "Summary not available";
  }
};

export const generateAnswer = async (question, context) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `
You are an AI assistant that answers ONLY using the user's saved knowledge.

User Question:
${question}

Context from user's saved data:
${context}

Instructions:
- Answer clearly and concisely
- Use ONLY the given context
- If context is insufficient, say "Not enough data available"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return "AI answer not available";
  }
};