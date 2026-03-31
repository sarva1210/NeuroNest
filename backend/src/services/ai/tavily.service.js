import axios from "axios";
import { env } from "../../config/env.js";

export const searchWeb = async (query) => {
  try {
    const res = await axios.post("https://api.tavily.com/search", {
      api_key: env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
    });

    return res.data.results || [];
  } catch (err) {
    console.error("Tavily Error:", err.message);
    return [];
  }
};