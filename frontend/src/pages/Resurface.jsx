import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Resurface() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchResurface();
  }, []);

  const fetchResurface = async () => {
    try {
      const res = await API.get("/resurface");
      setItems(res.data.data || []);
    } catch (err) {
      console.error("Resurface error:", err);
    }
  };

  const getTimeLabel = (date) => {
    const days = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);

    if (days < 1) return "Today";
    if (days < 3) return `${Math.floor(days)} days ago`;
    if (days < 7) return `${Math.floor(days)} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-6">🧠 Smart Resurface</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-[#121212] p-4 rounded-xl border border-[#2a2a2a] hover:border-purple-500 transition"
          >
            {/* TITLE */}
            <h2 className="font-semibold text-lg mb-1">
              {item.title || item.content?.slice(0, 50) || "Untitled"}
            </h2>

            {/* SUMMARY */}
            <p className="text-sm text-gray-400 mb-2">
              {item.summary?.slice(0, 120) ||
                item.content?.slice(0, 120) ||
                "No preview available"}
            </p>

            {/* META */}
            <div className="text-xs text-gray-500 flex justify-between">
              <span>{item.type}</span>
              <span>{getTimeLabel(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}