import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../../config/env.js";

const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY
});

const index = pc.Index(env.PINECONE_INDEX);

const sanitizeMetadata = (metadata = {}) => {
  return {
    content: String(metadata?.content || ""),
    type: String(metadata?.type || ""),
    userId: String(metadata?.userId || "")
  };
};

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
        metadata: sanitizeMetadata(metadata)
      }
    ]);

    console.log("Pinecone stored");
  } catch (err) {
    console.log("UPSERT ERROR:", err);
  }
};

export const querySimilar = async (embedding) => {
  try {
    if (!embedding || !Array.isArray(embedding)) return [];

    const cleanEmbedding = embedding.map(Number);

    const res = await index.query({
      vector: cleanEmbedding,
      topK: 5,
      includeMetadata: true
    });

    return res.matches || [];
  } catch (err) {
    console.log("QUERY ERROR:", err);
    return [];
  }
};

// environment: env.PINECONE_ENV