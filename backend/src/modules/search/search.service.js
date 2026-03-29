import { generateEmbedding } from "../../services/ai/embedding.service.js";
import Item from "../item/item.model.js";

const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const semanticSearchService = async (query, userId) => {
  const queryEmbedding = await generateEmbedding(query);

  const items = await Item.find({
    userId,
    status: "ready",
    embedding: { $exists: true, $ne: [] }
  });

  const scored = items.map((item) => {
    const score = cosineSimilarity(queryEmbedding, item.embedding);

    return {
      ...item.toObject(),
      score
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};