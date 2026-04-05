import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);

  // 🔥 NEW
  const [collections, setCollections] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchFeed();
    fetchCollections(); // 🔥 NEW
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 NEW
  const fetchCollections = async () => {
    try {
      const res = await API.get("/collections");
      setCollections(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 NEW
  const handleAdd = async (collectionId, itemId) => {
    try {
      await API.post("/collections/add", {
        collectionId,
        itemId,
      });

      setOpenDropdown(null);
      alert("Added to collection ✅");
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <Layout>
      <h1 className="text-2xl mb-6">🧠 Your Brain Feed</h1>

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => {
          const file = item.fileUrl || item.url;

          return (
            <div
              key={item._id}
              className="bg-[#121212] p-4 rounded-xl border border-[#2a2a2a] hover:border-purple-500 transition relative"
            >
              <h2 className="font-semibold mb-2">
                {item.title || item.content?.slice(0, 40) || "Untitled"}
              </h2>

              {/* 🎥 YOUTUBE */}
              {file && file.includes("youtube") && (
                <div
                  onClick={() =>
                    setPreviewItem({ type: "youtube", src: file })
                  }
                  className="cursor-pointer"
                >
                  <iframe
                    width="100%"
                    height="160"
                    src={`https://www.youtube.com/embed/${getYouTubeId(file)}`}
                    className="rounded-lg pointer-events-none mb-2"
                    title="YouTube"
                  />
                </div>
              )}

              {/* 🖼 IMAGE */}
              {file && file.match(/\.(jpg|jpeg|png|webp)$/) && (
                <img
                  src={file}
                  onClick={() =>
                    setPreviewItem({ type: "image", src: file })
                  }
                  className="w-full h-40 object-cover rounded-lg mb-2 cursor-pointer"
                />
              )}

              {/* 📄 PDF */}
              {file && file.endsWith(".pdf") && (
                <div
                  onClick={() =>
                    setPreviewItem({ type: "pdf", src: file })
                  }
                  className="text-blue-400 underline mb-2 cursor-pointer"
                >
                  📄 Open PDF
                </div>
              )}

              {/* 📝 TEXT */}
              <p className="text-sm text-gray-400 mb-3">
                {item.summary?.slice(0, 100) ||
                  item.content?.slice(0, 100) ||
                  "No preview"}
              </p>

              {/* 🔥 ADD TO COLLECTION BUTTON */}
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === item._id ? null : item._id
                  )
                }
                className="text-xs text-purple-400"
              >
                + Add to Collection
              </button>

              {/* 🔥 DROPDOWN */}
              {openDropdown === item._id && (
                <div className="absolute bg-zinc-900 border border-zinc-700 rounded-lg w-48 mt-2 z-10">
                  {collections.length === 0 ? (
                    <p className="text-xs p-2 text-gray-400">
                      No collections
                    </p>
                  ) : (
                    collections.map((col) => (
                      <button
                        key={col._id}
                        onClick={() =>
                          handleAdd(col._id, item._id)
                        }
                        className="block w-full text-left px-3 py-2 hover:bg-zinc-800"
                      >
                        {col.name}
                      </button>
                    ))
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500 flex justify-between mt-3">
                <span>{item.type}</span>
                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 FULLSCREEN MODAL (UNCHANGED) */}
      {previewItem && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setPreviewItem(null)}
        >
          <button className="absolute top-5 right-5 text-white text-xl">
            ✕
          </button>

          {previewItem.type === "image" && (
            <img
              src={previewItem.src}
              className="max-w-[90%] max-h-[90vh]"
            />
          )}

          {previewItem.type === "pdf" && (
            <iframe
              src={previewItem.src}
              className="w-[90%] h-[90vh] bg-white"
              title="PDF"
            />
          )}

          {previewItem.type === "youtube" && (
            <iframe
              width="90%"
              height="80%"
              src={`https://www.youtube.com/embed/${getYouTubeId(
                previewItem.src
              )}?autoplay=1`}
              allow="autoplay"
              allowFullScreen
              title="YouTube"
            />
          )}
        </div>
      )}
    </Layout>
  );
}