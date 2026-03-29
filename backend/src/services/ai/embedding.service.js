import { Mistral } from "@mistralai/mistralai";
import { env } from "../../config/env.js";

const client = new Mistral({ apiKey: env.MISTRAL_API_KEY });

export const generateEmbedding = async (text) => {
  const res = await client.embeddings.create({
    model: "mistral-embed",
    inputs: text
  });

  const embedding = res.data?.[0]?.embedding;

  console.log("EMBEDDING LENGTH:", embedding?.length);

  return embedding || [];
};