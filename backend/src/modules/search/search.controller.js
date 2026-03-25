import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateEmbedding } from "../../services/ai/embedding.service.js";
import { querySimilar } from "../../services/vector/pinecone.service.js";
import Item from "../item/item.model.js";

/**
 * @desc Semantic search using vector embeddings
 * @route POST /api/search
 * @access Private
 */
export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required"
    });
  }

  // Generate embedding from query
  const embedding = await generateEmbedding(query);

  // Search in Pinecone
  const results = await querySimilar(embedding);

  // Extract IDs + scores
  const matches = results || [];
  const ids = matches.map(m => m.id);

  if (!ids.length) {
    return res.json({
      success: true,
      count: 0,
      data: []
    });
  }

  // Fetch items from MongoDB
  const items = await Item.find({
    _id: { $in: ids },
    userId: req.user.id
  });

  // Attach similarity score
  const scoredItems = items.map(item => {
    const match = matches.find(m => m.id === item._id.toString());
    return {
      ...item.toObject(),
      score: match?.score || 0
    };
  });

  // Sort by similarity score
  scoredItems.sort((a, b) => b.score - a.score);

  res.status(200).json({
    success: true,
    count: scoredItems.length,
    data: scoredItems
  });
});