import { generateEmbedding } from "../../services/ai/embedding.service.js";
import { querySimilar } from "../../services/vector/pinecone.service.js";
import Item from "../item/item.model.js";

export const semanticSearchService = async (query, userId) => {
  const embedding = await generateEmbedding(query);

  const matches = await querySimilar(embedding);

  if (!matches || matches.length === 0) return [];

  const ids = matches.map(m => m.id);

  const items = await Item.find({
    _id: { $in: ids },
    userId
  });

  const scoredItems = items.map(item => {
    const match = matches.find(m => m.id === item._id.toString());

    return {
      ...item.toObject(),
      score: match?.score || 0
    };
  });

  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems;
};