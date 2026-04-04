import { useState } from "react";
import API from "../services/api";

export default function AddContentModal({ open, setOpen }) {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("text");

  if (!open) return null;

  const handleAdd = async () => {
    await API.post("/items", { content, url, type });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-[400px]">

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="text">Text</option>
          <option value="youtube">YouTube</option>
        </select>

        <input onChange={e => setContent(e.target.value)} />
        <button onClick={handleAdd}>Save</button>

      </div>
    </div>
  );
}