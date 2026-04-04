import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Feed() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    try {
      const res = await API.post("/search/ask", { query });

      setAnswer(res.data.answer);

      // 🔥 refresh feed after auto-save
      fetchItems();

      setQuery("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Ask Your Brain</h1>

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything..."
        className="w-full bg-[#1a1a1a] p-3 rounded-lg mb-4 outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
      />

      {/* ANSWER */}
      {answer && (
        <div className="bg-purple-900/20 border border-purple-500 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">AI Answer</h2>
          <p className="text-sm text-gray-300">{answer}</p>
        </div>
      )}

      {/* RECENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-[#1a1a1a] p-4 rounded-lg border border-[#3a2a22]"
          >
            <p className="text-xs text-purple-400 mb-1">{item.type}</p>

            <h3 className="font-semibold text-sm mb-1">
              {item.summary?.slice(0, 60) || "Untitled"}
            </h3>

            <p className="text-xs text-gray-400">
              {item.content?.slice(0, 80)}
            </p>
          </div>
        ))}

      </div>
    </Layout>
  );
}