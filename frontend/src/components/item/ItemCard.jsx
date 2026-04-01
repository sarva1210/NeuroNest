import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ItemCard({ item, collectionId }) {
  const [collections, setCollections] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // FETCH COLLECTIONS
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await API.get("/collections");
        setCollections(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCollections();
  }, []);

  // ADD
  const handleAdd = async (collectionId) => {
    try {
      await API.post("/collections/add", {
        collectionId,
        itemId: item._id,
      });

      alert("Added");
      setShowDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };

  //REMOVE
  const handleRemove = async () => {
    try {
      await API.post("/collections/remove", {
        collectionId,
        itemId: item._id,
      });

      alert("Removed");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-zinc-600 transition relative">

      <h3 className="font-semibold text-white mb-2">
        {item.title || "Untitled"}
      </h3>

      {item.content && (
        <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
          {item.content}
        </p>
      )}

      <div className="text-xs text-zinc-500 mb-3">
        Type: {item.type}
      </div>

      <div className="flex justify-between items-center mt-3">

        {!collectionId && (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-xs text-purple-400"
          >
            + Add to Collection
          </button>
        )}

        {collectionId && (
          <button
            onClick={handleRemove}
            className="text-xs text-red-400"
          >
            Remove
          </button>
        )}

        <span className="text-xs text-zinc-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute bottom-12 left-4 bg-zinc-900 border border-zinc-700 rounded-lg w-48 z-10">
          {collections.map((col) => (
            <button
              key={col._id}
              onClick={() => handleAdd(col._id)}
              className="block w-full text-left px-3 py-2 hover:bg-zinc-800"
            >
              {col.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}