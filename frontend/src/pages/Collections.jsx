import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import ItemCard from "../components/item/ItemCard";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [name, setName] = useState("");

  const fetchCollections = async () => {
    const res = await API.get("/collections");
    setCollections(res.data.data);
  };

  const createCollection = async () => {
    if (!name.trim()) return;

    await API.post("/collections", { name });
    setName("");
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Collections</h1>

          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New collection..."
              className="bg-zinc-900 px-3 py-2 rounded-lg"
            />
            <button
              onClick={createCollection}
              className="bg-purple-600 px-4 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </div>

        {selectedCollection ? (
          <div>

            <button
              onClick={() => setSelectedCollection(null)}
              className="mb-4 text-purple-400"
            >
              ← Back
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {selectedCollection.name}
            </h2>

            {selectedCollection.items.length === 0 ? (
              <p>No items</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {selectedCollection.items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    collectionId={selectedCollection._id}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {collections.map((col) => (
              <div
                key={col._id}
                onClick={() => setSelectedCollection(col)}
                className="p-5 rounded-2xl bg-zinc-800 cursor-pointer hover:bg-zinc-700"
              >
                <h2 className="text-lg font-semibold">
                  {col.name}
                </h2>

                <p className="text-sm text-zinc-400">
                  {col.items.length} items
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}