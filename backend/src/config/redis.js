import Redis from "ioredis";
import { env } from "./env.js";

let redisConnection = null;

if (env.REDIS_URI) {
  redisConnection = new Redis(env.REDIS_URI, {
    maxRetriesPerRequest: null,
  });

  redisConnection.on("connect", () => {
    console.log("Redis connected");
  });

  redisConnection.on("error", (err) => {
    console.log("Redis error:", err.message);
  });
}

export { redisConnection };