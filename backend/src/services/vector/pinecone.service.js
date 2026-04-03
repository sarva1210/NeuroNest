import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../../config/env.js";

// FIXED CONFIG
const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: env.PINECONE_ENV,
});

const index = pc.index(env.PINECONE_INDEX);

// CLEAN METADATA
const sanitizeMetadata = (metadata = {}) => ({
  content: String(metadata?.content || ""),
  type: String(metadata?.type || ""),
  userId: String(metadata?.userId || ""),
});

// UPSERT
export const upsertVector = async (id, embedding, metadata = {}) => {
  try {
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      console.log("Invalid embedding");
      return;
    }

    const cleanEmbedding = embedding.map(Number);

    await index.upsert([
      {
        id: String(id),
        values: cleanEmbedding,
        metadata: sanitizeMetadata(metadata),
      },
    ]);

    console.log("Pinecone stored");
  } catch (err) {
    console.log("UPSERT ERROR:", err);
  }
};

// QUERY
export const querySimilar = async (embedding) => {
  try {
    if (!embedding || !Array.isArray(embedding)) return [];

    const cleanEmbedding = embedding.map(Number);

    const res = await index.query({
      vector: cleanEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    return res.matches || [];
  } catch (err) {
    console.log("QUERY ERROR:", err);
    return [];
  }
};