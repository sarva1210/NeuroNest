import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API ERROR:", err.response || err.message);
    return Promise.reject(err);
  }
);

// TOKEN (auth)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;