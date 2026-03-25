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

new Worker(
  "itemQueue",
  async (job) => {
    const { itemId } = job.data;

    const item = await Item.findById(itemId);
    if (!item) return;

    // AI PROCESSING
    const embedding = await generateEmbedding(item.content);
    const tags = await generateTags(item.content);
    const summary = await generateSummary(item.content);

    // WEB ENRICHMENT (TAVILY)
    let enrichment = [];
    try {
      enrichment = await searchWeb(item.content.slice(0, 100));
    } catch (e) {
      console.log("Tavily failed, skipping...");
    }

    // TAG UPSERT
    const tagDocs = await upsertTags(tags, item.userId);

    //  STORE VECTOR
    await upsertVector(item._id, embedding, {
      userId: item.userId.toString(),
      content: item.content.slice(0, 200)
    });

    // FIND SIMILAR ITEMS
    const similar = await querySimilar(embedding);

    for (const match of similar) {
      if (
        match.id !== item._id.toString() &&
        match.score > 0.75
      ) {
        await createConnection(item._id, match.id, match.score);
      }
    }

    // SAVE EVERYTHING
    item.embedding = embedding;
    item.tags = tagDocs.map((t) => t.name);
    item.summary = summary;
    item.status = "ready";

    // store enrichment
    item.enrichment = enrichment?.slice(0, 3);

    await item.save();
  },
  { connection: redisConnection }
);