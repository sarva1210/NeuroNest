import { Mistral } from "@mistralai/mistralai";
import { env } from "../../config/env.js";

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

export const generateTags = async (text) => {
  const res = await client.chat.complete({
    model: "mistral-small",
    messages: [
      {
        role: "user",
        content: `Give 5 short tags (1-2 words) as JSON array:\n${text}`
      }
    ]
  });

  try {
    return JSON.parse(res.choices[0].message.content);
  } catch {
    return ["general"];
  }
};