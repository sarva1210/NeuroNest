import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "./search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";
import Item from "../item/item.model.js";

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

// ASK AI
export const askAI = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query required" });
  }

  const userId = req.user.id;

  let results = await semanticSearchService(query, userId);

  let context = "";
  let source = "database";

  if (!results || results.length === 0) {
    // fallback to web or general AI
    const web = await searchWeb(query);

    context = web
      .map(r => `${r.title}\n${r.content}`)
      .join("\n\n");

    source = "web";
  } else {
    context = results
      .map(i => `${i.content || ""} ${i.summary || ""}`)
      .join("\n\n");
  }

  const answer = await generateAnswer(query, context);

  // AUTO SAVE IF NOT FOUND
  if (!results || results.length === 0) {
    await Item.create({
      userId,
      type: "text",
      content: query,
      summary: answer,
      tags: ["ai-generated"],
      status: "done",
    });
  }

  res.json({
    answer,
    items: results,
    source,
  });
});

// CHAT WITH MEMORY
export const chatWithMemory = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  const userId = req.user.id;

  const items = await Item.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  const context = items
    .map(i => `${i.content || ""} ${i.summary || ""}`)
    .join("\n");

  // PROMPT
  const prompt = `
You are a friendly AI assistant.

IMPORTANT RULES:
- If user is just chatting → respond normally like a human.
- Do NOT say "not enough data".
- Use memory ONLY if relevant.
- Keep answers natural and conversational.

Context (optional):
${context}

User:
${message}

Answer:
`;

  const answer = await generateAnswer(message, prompt);

  res.json({ reply: answer });
});