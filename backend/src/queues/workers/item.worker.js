import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";

import mongoose from "mongoose";
import { env } from "../../config/env.js";

import Item from "../../modules/item/item.model.js";

import { generateEmbedding } from "../../services/ai/embedding.service.js";
import { generateTags } from "../../services/ai/tagging.service.js";
import { generateSummary } from "../../services/ai/summary.service.js";

import { upsertTags } from "../../modules/tag/tag.service.js";
import { createConnection } from "../../modules/graph/graph.service.js";

import { upsertVector, querySimilar } from "../../services/vector/pinecone.service.js";
import { searchWeb } from "../../services/ai/tavily.service.js";

console.log("Worker starting...");

await mongoose.connect(env.MONGO_URI);

console.log("MongoDB connected (worker)");

new Worker(
  "itemQueue",
  async (job) => {
    const { itemId } = job.data;

    const item = await Item.findById(itemId);
    if (!item) return;

    const text =
      typeof item.content === "string"
        ? item.content
        : item.content
        ? JSON.stringify(item.content)
        : item.url || item.fileUrl || "";

    if (!text || text.trim() === "") {
      item.status = "failed";
      await item.save();
      return;
    }

    console.log("Processing item:", item._id);

    let embedding = [];
    let tags = [];
    let summary = "";

    console.log("Starting embedding...");
    embedding = await generateEmbedding(text);
    console.log("Embedding done");

    console.log("Starting tags...");
    tags = await generateTags(text);
    console.log("Tags done");

    console.log("Starting summary...");
    summary = await generateSummary(text);
    console.log("Summary done");

    console.log("Starting vector upsert...");
    await upsertVector(item._id, embedding, {
      userId: item.userId.toString(),
      content: text.slice(0, 200)
    });
    console.log("Vector stored");

    let enrichment = [];
    try {
      enrichment = await searchWeb(text.slice(0, 100));
    } catch (e) {
      console.log("Tavily error:", e.message);
    }

    const tagDocs = await upsertTags(tags, item.userId);

    if (embedding.length > 0) {
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

    item.embedding = embedding;
    item.tags = Array.isArray(tags) ? tags : [];
    item.summary = summary;
    item.status = "ready";
    item.enrichment = enrichment?.slice(0, 3);

    await item.save();

    console.log("Item processed:", item._id);
  },
  { connection: redisConnection }
);