import API from "./api";

export const chatAI = async (message, history) => {
  const res = await API.post("/search/chat", {
    message,
    history,
  });
  return res.data;
};