import API from "./api";

export const chatAI = async (message, history) => {
  const res = await API.post("/chat", {
    message,
    history,
  });

  return res.data;
};