import { useState } from "react";
import API from "../services/api";

export default function AddContentModal({ open, setOpen, refresh }) {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("text");

  if (!open) return null;

  const handleAdd = async () => {
    try {
      await API.post("/items", {
        content,
        url,
        type,
      });

      setContent("");
      setUrl("");
      setOpen(false);
      refresh && refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-[400px]">

        <h2 className="mb-4 text-lg font-semibold">Add Content</h2>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded mb-3"
        >
          <option value="text">Text</option>
          <option value="tweet">Tweet</option>
          <option value="youtube">YouTube</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>

        {/* TEXT */}
        {type === "text" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-800 p-2 rounded mb-3"
            placeholder="Write something..."
          />
        )}

        {/* URL */}
        {type !== "text" && (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-zinc-800 p-2 rounded mb-3"
            placeholder="Paste URL..."
          />
        )}

        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <button
            onClick={handleAdd}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}