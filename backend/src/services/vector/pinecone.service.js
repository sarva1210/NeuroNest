import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../../config/env.js";

const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: "us-east-1"
});

const index = pc.index(env.PINECONE_INDEX);

const sanitizeMetadata = (metadata = {}) => {
  return {
    title: String(metadata?.title || ""),
    type: String(metadata?.type || ""),
    content: String(metadata?.content || ""),
    userId: String(metadata?.userId || "")
  };
};

export const upsertVector = async (id, embedding, metadata = {}) => {
  try {
    if (!embedding) return;

    const vector =
      Array.isArray(embedding)
        ? embedding
        : embedding?.data?.[0]?.embedding;

    if (!vector || !Array.isArray(vector) || vector.length === 0) return;

    const cleanEmbedding = vector.map((v) => Number(v));
    const safeMetadata = sanitizeMetadata(metadata);

    await index.upsert({
      vectors: [
        {
          id: String(id),
          values: cleanEmbedding,
          metadata: safeMetadata
        }
      ]
    });

    console.log("Pinecone stored");
  } catch (err) {
    console.log("UPSERT ERROR:", err);
  }
};

export const querySimilar = async (embedding) => {
  try {
    if (!embedding) return [];

    const vector =
      Array.isArray(embedding)
        ? embedding
        : embedding?.data?.[0]?.embedding;

    if (!vector || !Array.isArray(vector) || vector.length === 0) return [];

    const cleanEmbedding = vector.map((v) => Number(v));

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