import { useState } from "react";
import API from "../../services/api";

export default function Header() {
  const [query, setQuery] = useState("");

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  // ADD CONTENT (MULTI TYPE)
  const handleAdd = async () => {
    const type = prompt(
      "Enter type:\ntext / youtube / link / image / pdf"
    );

    if (!type) return;

    let content = "";
    let url = "";

    if (type === "text") {
      content = prompt("Enter text content");
    } else {
      url = prompt("Enter URL");
    }

    if (!content && !url) return;

    try {
      await API.post("/items", {
        type,
        content,
        url,
      });

      alert("Saved");
      window.location.reload();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // SEARCH
  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await API.post("/search", { query });
      console.log("Search Results:", res.data);
      alert("Check console");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="h-16 bg-zinc-900 flex items-center justify-between px-6 border-b border-zinc-800">

      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search your brain..."
        className="bg-zinc-800 px-4 py-2 rounded-lg w-96 outline-none"
      />

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          + Add Content
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </div>
  );
}