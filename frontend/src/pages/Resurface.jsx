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
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Resurfaced Memories
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item._id}
            className="bg-[#121212] p-4 rounded-lg border border-[#3a2a22]"
          >
            <h3 className="font-semibold">
              {item.title || "Untitled"}
            </h3>

            <p className="text-sm text-gray-400">
              {item.content?.slice(0, 100)}
            </p>

            <div className="text-xs text-gray-500 mt-2">
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}