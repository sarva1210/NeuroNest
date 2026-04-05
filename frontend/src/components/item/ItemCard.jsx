import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ItemCard({ item, collectionId }) {
  const [collections, setCollections] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [preview, setPreview] = useState(false);

  // 🔥 YouTube ID extractor
  const getYouTubeId = (url) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("youtu.be")) {
        return urlObj.pathname.slice(1);
      }

      return urlObj.searchParams.get("v");
    } catch {
      return null;
    }
  };

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

  const handleAdd = async (colId) => {
    try {
      await API.post("/collections/add", {
        collectionId: colId,
        itemId: item._id,
      });
      setShowDropdown(false);
      alert("Added");
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDelete = async () => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/items/${item._id}`);
      setRemoved(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (removed) return null;

  console.log(item);

  return (
    <>
      <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-purple-500 transition relative">

        {/* TYPE + DELETE */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-purple-400 capitalize">{item.type}</p>
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-300"
          >
            🗑 Delete
          </button>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-white mb-2">
          {item.title || item.content?.slice(0, 40) || item.url || "Untitled"}
        </h3>

        {/* IMAGE */}
        {item.type === "image" && item.fileUrl && (
          <img
            src={item.fileUrl}
            alt="preview"
            onClick={() => setPreview(true)}
            className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer hover:scale-105 transition"
          />
        )}

        {/* PDF */}
        {item.type === "pdf" && item.fileUrl && (
          <button
            onClick={() => setPreview(true)}
            className="text-blue-400 text-xs underline mb-2 block"
          >
            📄 View PDF
          </button>
        )}

        {/* YOUTUBE EMBED */}
        {item.type === "youtube" && item.url && getYouTubeId(item.url) && (
          <div className="mb-3">
            <iframe
              width="100%"
              height="180"
              src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        )}

        {/* LINK */}
        {item.type === "link" && item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 text-xs underline"
          >
            Open Link
          </a>
        )}

        {/* TEXT */}
        {item.content && item.type !== "image" && (
          <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
            {item.content}
          </p>
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
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>

        {/* DROPDOWN */}
        {showDropdown && (
          <div className="absolute bottom-14 left-4 bg-zinc-900 border border-zinc-700 rounded-lg w-48 z-10 shadow-lg">
            {collections.length === 0 ? (
              <p className="text-xs text-zinc-400 p-2">No collections</p>
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

      {/* IMAGE MODAL */}
      {preview && item.type === "image" && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
          onClick={() => setPreview(false)}
        >
          <img
            src={item.fileUrl}
            alt="full preview"
            className="max-w-[90%] max-h-[90vh] rounded-xl"
          />
        </div>
      )}

      {/* PDF MODAL */}
      {preview && item.type === "pdf" && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <button
            onClick={() => setPreview(false)}
            className="mb-4 bg-zinc-700 px-4 py-2 rounded-lg text-sm"
          >
            ✕ Close
          </button>
          <iframe
            src={item.fileUrl}
            className="w-[90%] h-[85vh] rounded-xl bg-white"
            title="PDF Preview"
          />
        </div>
      )}
    </>
  );
}