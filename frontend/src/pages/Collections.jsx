import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await API.get("/collections");
      setCollections(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setCollections([]);
    }
  };

  // ✅ CREATE (INSTANT UI UPDATE)
  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter collection name");

    try {
      setLoading(true);

      const res = await API.post("/collections", { name });

      // 🔥 INSTANT ADD (no reload)
      setCollections((prev) => [res.data.data, ...prev]);

      setName("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating collection");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE (INSTANT REMOVE)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;

    try {
      await API.delete(`/collections/${id}`);

      // 🔥 REMOVE FROM UI
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SAFE UNIQUE
  const uniqueCollections = Array.from(
    new Map(collections.map((c) => [c._id, c])).values()
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Collections</h1>

      {/* CREATE */}
      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection..."
          className="bg-zinc-800 px-4 py-2 rounded-lg w-[250px]"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {uniqueCollections.length === 0 && (
          <p className="text-zinc-400">No collections yet</p>
        )}

        {uniqueCollections.map((col) => (
          <div
            key={col._id}
            className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-purple-500 transition"
          >
            <div>
              <h2 className="font-semibold">{col.name}</h2>
              <p className="text-sm text-zinc-400">
                {col.items?.length || 0} items
              </p>
            </div>

            <button
              onClick={() => handleDelete(col._id)}
              className="text-red-400 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}