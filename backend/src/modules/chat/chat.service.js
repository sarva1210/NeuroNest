import { generateEmbedding } from "../../services/ai/embedding.service.js";
import Item from "../item/item.model.js";
import { Mistral } from "@mistralai/mistralai";
import { env } from "../../config/env.js";

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const chatWithMemoryService = async (query, userId) => {
  const queryEmbedding = await generateEmbedding(query);

  const items = await Item.find({
    userId,
    status: "ready",
    embedding: { $exists: true, $ne: [] }
  });

  const scored = items
    .map((item) => ({
      item,
      score: cosineSimilarity(queryEmbedding, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const context = scored
    .map(
      ({ item }, i) =>
        `Memory ${i + 1}:\n${item.content || ""}\nSummary: ${
          item.summary || ""
        }`
    )
    .join("\n\n");

  const prompt = `
You are an AI assistant with access to user's saved knowledge.

User Question:
${query}

Relevant Memories:
${context}

Instructions:
- Answer using the memories
- Be clear and helpful
- If unsure, say you don't have enough data
`;

  const res = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return {
    answer: res.choices[0].message.content,
    sources: scored.map(({ item }) => item)
  };
};