import API from "./api";

export const searchItems = async (query) => {
  const res = await API.get(`/search?q=${query}`);
  return res.data;
};