import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";

export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required"
    });
  }

  const results = await semanticSearchService(query, req.user.id);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});