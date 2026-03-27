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