import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ItemCard from "../components/item/ItemCard";
import { askAI } from "../services/search.service";

export default function Feed() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        handleAsk();
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  const handleAsk = async () => {
    try {
      setLoading(true);

      const data = await askAI(query);

      setAnswer(data.answer);
      setItems(data.items || []);
      setSource(data.source);
    } catch (err) {
      console.error("AI error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Ask Your Brain</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Ask anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg mb-6"
      />

      {/* AI Answer */}
      {answer && (
        <div className="bg-purple-900/20 border border-purple-700 p-4 rounded-xl mb-6">
          <h2 className="font-semibold mb-2 text-purple-300">AI Answer</h2>
          <p className="text-zinc-300">{answer}</p>

          {source && (
            <p className="text-xs text-zinc-500 mt-2">
              Source:{" "}
              {source === "web" ? "🌐 Web (Tavily)" : "🧠 Your Memory"}
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <p className="text-zinc-400">Thinking...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </Layout>
  );
}