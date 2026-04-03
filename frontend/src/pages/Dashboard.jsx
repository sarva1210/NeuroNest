import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    notes: 0,
    videos: 0,
    tweets: 0,
    docs: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/items");
      const data = res.data.data || [];

      setItems(data);

      setStats({
        notes: data.filter(i => i.type === "text").length,
        videos: data.filter(i => i.type === "video").length,
        tweets: data.filter(i => i.type === "tweet").length,
        docs: data.filter(i => i.type === "doc").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Notes" value={stats.notes} />
        <Card title="Videos" value={stats.videos} />
        <Card title="Tweets" value={stats.tweets} />
        <Card title="Docs" value={stats.docs} />
      </div>

      {/* 🔥 MAIN GRID FIX */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-220px)]">

        {/* LEFT (SCROLL ONLY HERE) */}
        <div className="col-span-2 bg-[#1a1a1a] p-4 rounded-xl border border-[#3a2a22] overflow-y-auto">
          <h2 className="mb-4 font-semibold">Recent Saves</h2>

          {items.map(item => (
            <div
              key={item._id}
              className="bg-[#121212] p-4 mb-3 rounded-lg border border-[#3a2a22]"
            >
              <h3 className="font-semibold">
                {item.title || "Untitled"}
              </h3>

              <p className="text-sm text-gray-400">
                {item.content?.slice(0, 80)}
              </p>

              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Type: {item.type}</span>
                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button className="text-xs text-[#AB8D6F] mt-2">
                + Add to Collection
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT (NO SCROLL 🔥) */}
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#3a2a22] sticky top-6 h-fit">
          <h2 className="mb-4 font-semibold">AI Insights</h2>

          <ul className="text-sm text-gray-400 space-y-2">
            <li>• You saved {items.length} items</li>
            <li>• Most frequent: {getTopType(items)}</li>
            <li>• Suggested: AI + Startups</li>
          </ul>

          <button className="mt-4 w-full bg-[#5D3721] py-2 rounded-lg">
            Ask AI
          </button>
        </div>

      </div>
    </Layout>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#3a2a22]">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function getTopType(items) {
  if (!items.length) return "-";

  const count = {};
  items.forEach(i => {
    count[i.type] = (count[i.type] || 0) + 1;
  });

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}