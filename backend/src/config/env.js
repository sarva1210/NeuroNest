import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URI: process.env.REDIS_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  PINECONE_ENV: process.env.PINECONE_ENV,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY
};