import { generateEmbedding } from "../ai/embedding.service.js";
import { querySimilar } from "../vector/pinecone.service.js";
import Item from "../../modules/item/item.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const chatWithMemory = async (query, userId) => {
  const embedding = await generateEmbedding(query);

  const matches = await querySimilar(embedding);
  const ids = matches.map(m => m.id);

  const items = await Item.find({
    _id: { $in: ids },
    userId
  });

  const context = items.map(i => i.content).join("\n\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const result = await model.generateContent(`
You are a personal AI assistant.

Answer ONLY using the context below.

Context:
${context}

Question:
${query}
`);

  const response = await result.response;

  return response.text();
};