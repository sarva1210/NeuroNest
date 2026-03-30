import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";

// SEMANTIC SEARCH (API)
export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  // safe user handling
  const results = await semanticSearchService(query, req.user?.id);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});


// AI SEARCH (RAG)
export const askAI = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  //semantic search
  const results = await semanticSearchService(q, req.user?.id);

  //build context
  const context = results
    .map(
      (item) =>
        `Title: ${item.title || ""}\nContent: ${item.content || ""}`
    )
    .join("\n\n");

  // Gemini AI
  const answer = await generateAnswer(q, context);

  res.json({
    answer,
    items: results,
  });
});