import { generateEmbedding } from "../../services/ai/embedding.service.js";
import Item from "../item/item.model.js";

// cosine similarity function
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  // prevent division by zero
  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
};


// semantic search service
export const semanticSearchService = async (query, userId) => {
  // generate embedding for query
  const queryEmbedding = await generateEmbedding(query);

  // dynamic filter (works with/without auth)
  const filter = {
    status: "ready",
    embedding: { $exists: true, $ne: [] },
  };

  // add user filter only if exists
  if (userId) {
    filter.userId = userId;
  }

  // limit DB load (imp for scaling)
  const items = await Item.find(filter).limit(50);

  // compute similarity scores
  const scored = items.map((item) => {
    const score = cosineSimilarity(queryEmbedding, item.embedding);

    return {
      ...item.toObject(),
      score,
    };
  });

  // sort + return top 5
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};