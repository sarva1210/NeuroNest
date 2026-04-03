import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ItemCard({ item, collectionId }) {
  const [collections, setCollections] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [removed, setRemoved] = useState(false); // 🔥 no reload

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

      setShowDropdown(false);
      alert("Added");
    } catch (err) {
      console.error(err);
    }
  };

  // REMOVE (no reload)
  const handleRemove = async () => {
    try {
      await API.post("/collections/remove", {
        collectionId,
        itemId: item._id,
      });

      setRemoved(true);
    } catch (err) {
      console.error(err);
    }
  };

  // hide after remove
  if (removed) return null;

  return (
    <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-purple-500 transition relative">

      {/* TYPE */}
      <p className="text-xs text-purple-400 mb-1 capitalize">
        {item.type}
      </p>

      {/* TITLE */}
      <h3 className="font-semibold text-white mb-2">
        {item.content?.slice(0, 40) || item.url || "Untitled"}
      </h3>

      {/* CONTENT */}
      {item.content && (
        <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
          {item.content}
        </p>
      )}

      {/* YOUTUBE PREVIEW */}
      {item.type === "youtube" && item.url && (
        <a
          href={item.url}
          target="_blank"
          className="text-red-400 text-xs underline"
        >
          ▶ Watch Video
        </a>
      )}

      {/* LINK PREVIEW */}
      {item.type === "link" && item.url && (
        <a
          href={item.url}
          target="_blank"
          className="text-blue-400 text-xs underline"
        >
          Open Link
        </a>
      )}

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4">

        {!collectionId && (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            + Add to Collection
          </button>
        )}

        {collectionId && (
          <button
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300"
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
        <div className="absolute bottom-14 left-4 bg-zinc-900 border border-zinc-700 rounded-lg w-48 z-10 shadow-lg">

          {collections.length === 0 ? (
            <p className="text-xs text-zinc-400 p-2">
              No collections
            </p>
          ) : (
            collections.map((col) => (
              <button
                key={col._id}
                onClick={() => handleAdd(col._id)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-zinc-800"
              >
                {col.name}
              </button>
            ))
          )}

        </div>
      )}
    </div>
  );
}