import { useState } from "react";
import Sidebar from "./Sidebar";
import API from "../../services/api";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("text");
  const [showType, setShowType] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const TYPES = [
    { value: "text", label: "📝 Text" },
    { value: "tweet", label: "🐦 Tweet" },
    { value: "youtube", label: "🎥 YouTube" },
    { value: "image", label: "🖼 Image" },
    { value: "pdf", label: "📄 PDF" },
  ];

  const reset = () => {
    setTitle("");
    setContent("");
    setUrl("");
    setFile(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);

      if (type === "text" || type === "tweet") {
        if (!content.trim()) return alert("Content required");
        formData.append("content", content);
      } else if (type === "youtube") {
        if (!url.trim()) return alert("URL required");
        formData.append("url", url);
      } else {
        if (!file) return alert("File required");
        formData.append("file", file);
      }

      await API.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Saved ✅");
      setOpen(false);
      reset();
      window.location.reload();

    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0b0b] text-white overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-800">
          <h1 className="font-semibold text-base md:text-lg">NeuroNest</h1>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-3 md:px-4 py-2 rounded-lg text-sm"
            >
              + Add
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth";
              }}
              className="bg-red-500 px-3 md:px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1a1a1a] w-[90%] max-w-md p-6 rounded-xl border border-zinc-700">

            <h2 className="mb-4 font-semibold">Add Content</h2>

            {/* TITLE */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)..."
              className="w-full p-2 bg-[#0b0b0b] rounded mb-3 border border-zinc-700"
            />

            {/* TYPE DROPDOWN */}
            <div className="relative mb-3">
              <button
                onClick={() => setShowType(!showType)}
                className="w-full bg-[#0b0b0b] p-2 rounded border border-zinc-700 text-left"
              >
                {TYPES.find((t) => t.value === type)?.label}
              </button>

              {showType && (
                <div className="absolute w-full bg-[#121212] border border-zinc-700 mt-1 rounded z-50">
                  {TYPES.map((t) => (
                    <div
                      key={t.value}
                      onClick={() => {
                        setType(t.value);
                        setShowType(false);
                        reset();
                      }}
                      className="p-2 hover:bg-purple-600 cursor-pointer"
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INPUT BASED ON TYPE */}
            {type === "text" || type === "tweet" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
                className="w-full p-2 bg-[#0b0b0b] rounded mb-3 border border-zinc-700 min-h-[100px]"
              />
            ) : type === "youtube" ? (
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube link..."
                className="w-full p-2 bg-[#0b0b0b] rounded mb-3 border border-zinc-700"
              />
            ) : (
              <input
                type="file"
                accept={type === "pdf" ? ".pdf" : "image/*"}
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="mb-3 text-zinc-400"
              />
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setOpen(false); reset(); }}
                className="px-4 py-2 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}