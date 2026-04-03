import Layout from "../components/layout/Layout";
import API from "../services/api";
import { useEffect, useState } from "react";

export default function Collections() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    API.get("/collections").then(res => setCollections(res.data.data));
  }, []);

  const removeItem = async (collectionId, itemId) => {
    await API.post("/collections/remove", { collectionId, itemId });
    window.location.reload();
  };

  return (
    <Layout>
      <h1 className="text-xl mb-4">Collections</h1>

      {collections.map(c => (
        <div key={c._id} className="bg-zinc-800 p-4 rounded-xl mb-4">
          <h2>{c.name}</h2>

          {c.items?.map(item => (
            <div key={item._id} className="flex justify-between mt-2">
              <span>{item.content}</span>
              <button
                onClick={() => removeItem(c._id, item._id)}
                className="text-red-400 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </Layout>
  );
}