import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../../config/env.js";

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY });
const index = pc.index(env.PINECONE_INDEX);

console.log("INDEX:", env.PINECONE_INDEX);

export const upsertVector = async (id, embedding, metadata) => {
  await index.upsert([
    {
      id: id.toString(),
      values: embedding,
      metadata
    }
  ]);
};

export const querySimilar = async (embedding) => {
  const res = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true
  });

  return res.matches;
};