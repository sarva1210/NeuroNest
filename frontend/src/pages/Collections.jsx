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
      setCollections(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // REATE COLLECTION (no duplicate clicks)
  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await API.post("/collections", { name });

      setName("");
      fetchCollections();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Collection already exists");
    } finally {
      setLoading(false);
    }
  };

  // DELETE COLLECTION
  const handleDelete = async (id) => {
    try {
      await API.delete(`/collections/${id}`);
      fetchCollections();
    } catch (err) {
      console.log(err);
    }
  };

  // REMOVE DUPLICATES (frontend safety)
  const uniqueCollections = Array.from(
    new Map(collections.map((c) => [c.name, c])).values()
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
        {uniqueCollections.map((col) => (
          <div
            key={col._id}
            className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800"
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