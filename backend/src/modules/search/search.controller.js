import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

// SEMANTIC SEARCH (API)
export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  const results = await semanticSearchService(query, req.user?.id);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});


// AI SEARCH (RAG + Tavily)
export const askAI = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  // semantic search
  let results = await semanticSearchService(q, req.user?.id);

  let context = "";
  let source = "database";

  // Tavily fallback
  if (!results || results.length === 0) {
    const webResults = await searchWeb(q);

    context = webResults
      .map((r) => `${r.title}\n${r.content}`)
      .join("\n\n");

    source = "web";
  } else {
    //DB context
    context = results
      .map(
        (item) =>
          `Title: ${item.title || ""}\nContent: ${item.content || ""}`
      )
      .join("\n\n");
  }

  // Gemini
  const answer = await generateAnswer(q, context);

  res.json({
    answer,
    items: results,
    source,
  });
});

export const chatAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  // 🔍 semantic search
  let results = await semanticSearchService(message, req.user?.id);

  let context = "";
  let source = "database";

  if (!results || results.length === 0) {
    const webResults = await searchWeb(message);

    context = webResults
      .map((r) => `${r.title}\n${r.content}`)
      .join("\n\n");

    source = "web";
  } else {
    context = results
      .map(
        (item) =>
          `Title: ${item.title || ""}\nContent: ${item.content || ""}`
      )
      .join("\n\n");
  }

  // 🧠 MEMORY (IMPORTANT)
  const historyText = history
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n");

  const fullPrompt = `
Conversation so far:
${historyText}

User: ${message}

Context:
${context}

Answer naturally based on conversation + context.
`;

  const answer = await generateAnswer(fullPrompt, "");

  res.json({
    answer,
    items: results,
    source,
  });
});