import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../../config/env.js";

const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY
});

const index = pc.Index(env.PINECONE_INDEX);

export const upsertVector = async (id, text, metadata) => {
  console.log("📡 Sending TEXT to Pinecone...");

  await index.upsertRecords([
    {
      id: id.toString(),
      text: text,
      metadata
    }
  ]);

  console.log("Pinecone stored (text mode)");
};

export const querySimilar = async (queryText) => {
  const res = await index.search({
    query: {
      topK: 5,
      inputs: { text: queryText }
    }
  });

  return res.matches || [];
};