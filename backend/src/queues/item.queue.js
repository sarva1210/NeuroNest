import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

let itemQueue = null;

if (redisConnection) {
  itemQueue = new Queue("itemQueue", {
    connection: redisConnection,
  });
}

export const addItemJob = async (itemId) => {
  if (!itemQueue) {
    console.log("Queue disabled, skipping job");
    return;
  }

  await itemQueue.add("processItem", { itemId });
};