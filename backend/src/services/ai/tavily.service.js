import axios from "axios";
import { env } from "../../config/env.js";

export const searchWeb = async (query) => {
  const res = await axios.post("https://api.tavily.com/search", {
    api_key: env.TAVILY_API_KEY,
    query,
    search_depth: "basic"
  });

  return res.data.results;
};