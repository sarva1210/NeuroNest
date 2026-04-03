import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

// SEMANTIC SEARCH
export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query required" });
  }

  const results = await semanticSearchService(query, req.user.id);

  res.json({
    success: true,
    data: results,
  });
});

// ASK AI (RAG)
export const askAI = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query required" });
  }

  let results = await semanticSearchService(query, req.user.id);

  let context = "";
  let source = "database";

  if (!results.length) {
    const web = await searchWeb(query);

    context = web.map(r => `${r.title}\n${r.content}`).join("\n\n");
    source = "web";
  } else {
    context = results.map(i => i.content).join("\n\n");
  }

  const answer = await generateAnswer(query, context);

  res.json({
    answer,
    items: results,
    source,
  });
});