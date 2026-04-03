import API from "./api";

// SEMANTIC SEARCH
export const searchItems = async (query) => {
  const res = await API.post("/search", {
    query,
  });

  return res.data;
};

// ASK AI
export const askAI = async (query) => {
  const res = await API.post("/search/ask", {
    query,
  });

  return res.data;
};