import { useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await API.post("/search", { query });
    setResults(res.data.data);
  };

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your brain..."
          className="flex-1 bg-[#1a1a1a] p-3 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 px-4 rounded"
        >
          Search
        </button>
      </div>

      <div className="space-y-3">
        {results.map(item => (
          <div key={item._id} className="bg-[#121212] p-4 rounded">
            <h3>{item.content?.slice(0, 50)}</h3>
            <p className="text-sm text-gray-400">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}