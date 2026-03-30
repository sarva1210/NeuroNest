import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ItemCard from "../components/item/ItemCard";
import { searchItems } from "../services/search.service";

export default function Feed() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setItems([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchItems(query);
      setItems(data.items || data);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Search Your Brain</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg mb-6 outline-none"
      />

      {/* Results */}
      {loading ? (
        <p className="text-zinc-400">Searching...</p>
      ) : items.length === 0 ? (
        <p className="text-zinc-500">No results found</p>
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