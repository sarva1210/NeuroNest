import { connectDB } from "../../config/db.js";
import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";

import Item from "../../modules/item/item.model.js";

import { generateEmbedding } from "../../services/ai/embedding.service.js";
import { generateTags } from "../../services/ai/tagging.service.js";
import { generateSummary } from "../../services/ai/summary.service.js";

import { upsertTags } from "../../modules/tag/tag.service.js";
import { createConnection } from "../../modules/graph/graph.service.js";

import { upsertVector, querySimilar } from "../../services/vector/pinecone.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

await connectDB();
console.log("🔥 Worker started...");

new Worker(
  "itemQueue",
  async (job) => {
    try {
      console.log("📦 Job received:", job.data);

      const { itemId } = job.data;

      const item = await Item.findById(itemId);
      if (!item) return;

      console.log("🧠 Processing item:", itemId);

      let embedding = [];
      let tags = [];
      let summary = "";

      try {
        embedding = await generateEmbedding(item.content);
        tags = await generateTags(item.content);
        summary = await generateSummary(item.content);
      } catch (err) {
        console.error("❌ AI error:", err.message);
        embedding = [];
        tags = ["ai"];
        summary = "Auto-generated summary unavailable";
      }

      let enrichment = [];
      try {
        enrichment = await searchWeb(item.content.slice(0, 100));
      } catch (e) {}

      let tagDocs = [];
      try {
        tagDocs = await upsertTags(tags, item.userId);
      } catch (err) {}

      try {
        if (embedding.length) {
          await upsertVector(item._id, embedding, {
            userId: item.userId.toString(),
            content: item.content.slice(0, 200)
          });
        }
      } catch (err) {}

      try {
        if (embedding.length) {
          const similar = await querySimilar(embedding);

          for (const match of similar) {
            if (
              match.id !== item._id.toString() &&
              match.score > 0.75
            ) {
              await createConnection(item._id, match.id, match.score);
            }
          }
        }
      } catch (err) {}

      item.embedding = embedding;
      item.tags = tagDocs.map((t) => t.name) || tags;
      item.summary = summary;
      item.status = "ready";
      item.enrichment = enrichment?.slice(0, 3) || [];

      await item.save();

      console.log("✅ Item processed:", itemId);

    } catch (err) {
      console.error("🔥 Worker fatal error:", err.message);
    }
  },
  {
    connection: redisConnection
  }
);