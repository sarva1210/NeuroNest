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
    .filter(({ score }) => score > 0.75)  // ← only keep relevant memories
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const context = scored
    .map(
      ({ item }, i) =>
        `Memory ${i + 1}:\n${item.content || ""}\nSummary: ${item.summary || ""}`
    )
    .join("\n\n");

  const prompt = `
You are a personal AI assistant with access to the user's saved knowledge.

${context
  ? `Relevant memories from the user's knowledge base:\n${context}\n\nUse these memories to help answer if relevant.`
  : "No relevant memories found for this question."
}

Answer the question clearly and helpfully using your own knowledge if no memories are relevant.
Never say "I don't know" or "not enough data" — always give a useful answer.

User Question:
${query}
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