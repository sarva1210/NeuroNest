import { asyncHandler } from "../../utils/asyncHandler.js";
import { semanticSearchService } from "../search/search.service.js";
import { generateAnswer } from "../../services/ai/summary.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

export const chatAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  let results = await semanticSearchService(message, req.user.id);

  let context = "";
  let source = "database";

  if (!results.length) {
    const web = await searchWeb(message);

    context = web.map(r => `${r.title}\n${r.content}`).join("\n\n");
    source = "web";
  } else {
    context = results.map(i => i.content).join("\n\n");
  }

  const historyText = history
    .map(msg => `${msg.role}: ${msg.text}`)
    .join("\n");

  const prompt = `
Conversation:
${historyText}

User: ${message}

Context:
${context}
`;

  const answer = await generateAnswer(prompt, "");

  res.json({
    answer,
    items: results,
    source,
  });
});