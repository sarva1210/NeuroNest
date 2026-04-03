import { useState } from "react";
import API from "../services/api";

export default function AddContentModal({ open, setOpen, refresh }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");

  if (!open) return null;

  const handleAdd = async () => {
    await API.post("/items", { content, type });
    setContent("");
    setOpen(false);
    refresh && refresh();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-[400px]">

        <h2 className="mb-4 text-lg font-semibold">Add Content</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded mb-3"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded mb-3"
        >
          <option value="text">Text</option>
          <option value="video">Video</option>
          <option value="tweet">Tweet</option>
          <option value="doc">Doc</option>
        </select>

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