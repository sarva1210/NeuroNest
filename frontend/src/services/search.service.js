import API from "./api";

// semantic search
export const searchItems = async (query) => {
  const res = await API.get(`/search?q=${query}`);
  return res.data;
};

// AI ASK
export const askAI = async (query) => {
  const res = await API.get(`/search/ask?q=${query}`);
  return res.data;
};