import API from "./api";

// get recent items
export const getItems = async () => {
  const res = await API.get("/items");
  return res.data.data;
};

// get stats (optional endpoint)
export const getStats = async () => {
  const res = await API.get("/items/stats");
  return res.data;
};