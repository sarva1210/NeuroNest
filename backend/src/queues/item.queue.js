import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const itemQueue = new Queue("itemQueue", {
  connection: redisConnection
});

export const addItemJob = async (itemId) => {
  await itemQueue.add("processItem", { itemId });
};