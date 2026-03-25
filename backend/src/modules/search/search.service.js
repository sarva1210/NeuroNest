import { generateEmbedding } from "../../services/ai/embedding.service.js";
import { querySimilar } from "../../services/vector/pinecone.service.js";
import Item from "../item/item.model.js";

/**
 * Perform semantic search using vector DB
 */
export const semanticSearchService = async (query, userId) => {
  if (!query) throw new Error("Query is required");

  // Convert query -> embedding
  const embedding = await generateEmbedding(query);

  // Query Pinecone
  const results = await querySimilar(embedding);

  // Extract IDs
  const ids = results.map(r => r.id);

  if (!ids.length) return [];

  //Fetch actual items from DB
  const items = await Item.find({
    _id: { $in: ids },
    userId
  }).sort({ createdAt: -1 });

  return items;
};