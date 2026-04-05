import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

export const chatWithMemory = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  let context = "";
  let source = "general";

  // Priority 1: Semantic memory via embeddings (use your chat.service.js)
  try {
    const { answer: memAnswer, sources } = await chatWithMemoryService(message, userId);
    // Only use memory if similarity score is high enough (handled in service)
    if (sources.length > 0) {
      context = sources.map(i => i.content || i.summary || "").join("\n");
      source = "memory";
    }
  } catch (err) {
    console.log("Memory service failed:", err.message);
  }

  // Priority 2: Web search if no relevant memory
  if (!context) {
    try {
      const webResults = await searchWeb(message);
      if (webResults?.length) {
        context = webResults.map(r => `${r.title}\n${r.content}`).join("\n\n");
        source = "web";
      }
    } catch (err) {
      console.log("Web search failed:", err.message);
    }
  }

  const prompt = `
You are a helpful AI assistant. Answer the user's question accurately and concisely.

${context ? `Context:\n${context}\n` : ""}

User Question: ${message}

Answer:
`;

  let answer = "";

  try {
    answer = await generateAnswer(message, prompt);
  } catch (err) {
    console.error("AI generation error:", err);
    return res.status(500).json({ message: "AI service failed" });
  }

  // NO hardcoded fallback - if answer is empty, return an honest error
  if (!answer?.trim()) {
    return res.status(500).json({ message: "Failed to generate answer" });
  }

  // Save to memory
  await Item.create({
    userId,
    type: "text",
    content: message,
    summary: answer,
    tags: ["chat", "auto"],
    status: "done",
    lastAccessed: new Date()
  });

  res.json({ reply: answer, source });
});