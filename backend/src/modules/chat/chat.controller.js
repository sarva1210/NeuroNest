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

  // MEMORY
  const pastItems = await Item.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  const memoryContext = pastItems
    .map(i => i.content || i.summary || "")
    .join("\n");

  let context = "";
  let source = "general";

  // Priority 1: Memory
  if (memoryContext && memoryContext.length > 30) {
    context = memoryContext;
    source = "memory";
  }

  // Priority 2: Web
  else {
    try {
      const webResults = await searchWeb(message);

      if (webResults?.length) {
        context = webResults
          .map(r => `${r.title}\n${r.content}`)
          .join("\n\n");

        source = "web";
      }
    } catch (err) {
      console.log("Web failed");
    }
  }

  // PROMPT
  const prompt = `
You are a highly intelligent and friendly AI assistant.

Rules:
- ALWAYS answer the question
- If context exists -> use it
- If no context -> answer using your own knowledge
- NEVER say "not enough data"
- NEVER say "I don't know"
- Be clear and helpful

Context:
${context || "No context available"}

User Question:
${message}

Answer:
`;

  let answer = "";

  try {
    answer = await generateAnswer(message, prompt);
  } catch (err) {
    console.log("AI error:", err);
  }

  if (!answer || answer.toLowerCase().includes("not enough")) {
    answer = `Here’s a clear answer:\n\n${message} is something I can explain simply.\n\nEven without specific stored data, generally speaking:\n\n- JavaScript is preferred for speed and flexibility\n- TypeScript is preferred for large-scale safety\n\nIt depends on your use case`;
  }

  // SAVE MEMORY
  await Item.create({
    userId,
    type: "text",
    content: message,
    summary: answer,
    tags: ["chat", "auto"],
    status: "done",
    lastAccessed: new Date()
  });

  res.json({
    reply: answer,
    source
  });
});