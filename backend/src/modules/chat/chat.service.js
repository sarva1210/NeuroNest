import Item from "../item/item.model.js";
import { Mistral } from "@mistralai/mistralai";
import { env } from "../../config/env.js";

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

export const chatWithMemoryService = async (query, userId) => {
  const items = await Item.find({
    userId,
    $or: [
      { content: { $regex: query, $options: "i" } },
      { summary: { $regex: query, $options: "i" } },
      { tags: { $in: [query.toLowerCase()] } }
    ]
  }).limit(5);

  const context = items
    .map(
      (item, i) =>
        `Memory ${i + 1}:\n${item.content || ""}\nSummary: ${item.summary || ""}`
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
- If not enough info, say "I don't have enough saved data"
- Keep answer clear and helpful
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
    sources: items
  };
};