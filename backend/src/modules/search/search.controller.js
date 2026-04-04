import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

// SEMANTIC SEARCH
export const semanticSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query required" });
  }

  const results = await semanticSearchService(query, req.user.id);

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});


// ASK AI (RAG + CLEAN CONTEXT)
export const askAI = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query required" });
  }

  let results = await semanticSearchService(query, req.user.id);

  let context = "";
  let source = "database";

  // if no DB results -> web fallback
  if (!results || results.length === 0) {
    const web = await searchWeb(query);

    context = web
      .map(r => `${r.title}\n${r.content}`)
      .join("\n\n");

    source = "web";
  } else {
    context = results
      .map(
        (i, idx) =>
          `Memory ${idx + 1}:\n${i.content || ""}\nSummary: ${i.summary || ""}`
      )
      .join("\n\n");
  }

  const answer = await generateAnswer(query, context);

  res.json({
    answer,
    items: results,
    source,
  });
});


// CHAT AI (MEMORY + CONTEXT)
export const chatAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message required" });
  }

  let results = await semanticSearchService(message, req.user.id);

  let context = "";
  let source = "database";

  if (!results || results.length === 0) {
    const web = await searchWeb(message);

    context = web
      .map(r => `${r.title}\n${r.content}`)
      .join("\n\n");

    source = "web";
  } else {
    context = results
      .map(
        (i, idx) =>
          `Memory ${idx + 1}:\n${i.content || ""}\nSummary: ${i.summary || ""}`
      )
      .join("\n\n");
  }

  // CONVERSATION MEMORY
  const historyText = history
    .map(msg => `${msg.role}: ${msg.text}`)
    .join("\n");

  const prompt = `
Conversation so far:
${historyText}

User: ${message}

Relevant Context:
${context}

Instructions:
- Answer naturally
- Use context if helpful
- If not enough data, say so
`;

  const answer = await generateAnswer(prompt, "");

  res.json({
    answer,
    items: results,
    source,
  });
});