import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Feed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-6">🧠 Your Brain Feed</h1>

      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item._id}
            className="bg-[#121212] p-4 rounded-xl border border-[#2a2a2a] hover:border-purple-500 transition"
          >
            <h2 className="font-semibold mb-2">
              {item.title || item.content?.slice(0, 40) || "Untitled"}
            </h2>

            <p className="text-sm text-gray-400 mb-3">
              {item.summary?.slice(0, 100) ||
                item.content?.slice(0, 100) ||
                "No preview"}
            </p>

            <div className="text-xs text-gray-500 flex justify-between">
              <span>{item.type}</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}