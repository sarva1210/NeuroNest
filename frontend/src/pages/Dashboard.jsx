import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  };

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ✅ FIXED EDIT (NO ERROR)
  const startEdit = (item, field) => {
    setEditingId(item._id);
    setEditField(field);
    setEditValue(item[field] || ""); // 🔥 FIX
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/items/${id}`, {
        [editField]: editValue
      });

      setItems(prev =>
        prev.map(i =>
          i._id === id ? { ...i, [editField]: editValue } : i
        )
      );

      setEditingId(null);
      setEditField("");
      setEditValue("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await API.delete(`/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* ❌ ADD BUTTON REMOVED */}
      </div>

      <div className={`grid ${expanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"} gap-6`}>

        {/* LEFT */}
        <div className={`${expanded ? "" : "lg:col-span-2"} bg-[#1a1a1a] p-4 rounded-xl border border-[#3a2a22]`}>

          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Recent Saves</h2>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-purple-400"
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>

          <div className={`space-y-3 ${expanded ? "max-h-[70vh]" : "max-h-[400px]"} overflow-y-auto`}>

            {items.map(item => {
              const isOpen = openItems[item._id];

              return (
                <div key={item._id} className="bg-[#121212] p-4 rounded-lg border border-[#3a2a22] hover:border-purple-500 transition">

                  {/* HEADER */}
                  <div className="flex justify-between items-center">

                    {editingId === item._id && editField === "title" ? (
                      <input
                        value={editValue || ""}   // 🔥 FIX
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(item._id)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                        className="bg-transparent border-b border-purple-500 text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3
                        onDoubleClick={() => startEdit(item, "title")}
                        className="font-semibold cursor-pointer"
                      >
                        {generateSmartTitle(item)}
                      </h3>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {timeAgo(item.createdAt)}
                      </span>

                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div onClick={() => toggleItem(item._id)}>

                    {!isOpen && (
                      <p className="text-sm text-gray-400 mt-2">
                        {generateSmartSummary(item)}...
                      </p>
                    )}

                    {isOpen && (
                      <div className="mt-3 space-y-2">

                        {editingId === item._id && editField === "summary" ? (
                          <textarea
                            value={editValue || ""}   // 🔥 FIX
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(item._id)}
                            className="bg-[#1a1a1a] p-2 rounded w-full"
                          />
                        ) : (
                          <p
                            onDoubleClick={() => startEdit(item, "summary")}
                            className="text-sm text-gray-300 cursor-pointer"
                          >
                            {item.summary || "Double click to add summary"}
                          </p>
                        )}

                        <p className="text-sm text-gray-400">
                          {item.content}
                        </p>

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT PANEL */}
        {!expanded && (
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#3a2a22] h-fit sticky top-6">

            <h2 className="mb-4 font-semibold">AI Insights</h2>

            <ul className="text-sm text-gray-400 space-y-2">
              <li>• You saved {items.length} items</li>
              <li>• Most frequent: {getTopType(items)}</li>
              <li>• Suggested: AI + Startups</li>
            </ul>

            <button
              onClick={() => navigate("/chat")}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-500 py-2 rounded-lg"
            >
              Ask AI
            </button>

          </div>
        )}

      </div>

    </Layout>
  );
}

/* HELPERS */

function generateSmartTitle(item) {
  if (item.title && !item.title.toLowerCase().includes("not enough"))
    return item.title;

  if (item.summary && !item.summary.toLowerCase().includes("not enough"))
    return item.summary.slice(0, 50);

  if (item.content) return item.content.slice(0, 50);

  return "Quick Note";
}

function generateSmartSummary(item) {
  if (item.summary && !item.summary.toLowerCase().includes("not enough"))
    return item.summary.slice(0, 80);

  if (item.content) return item.content.slice(0, 80);

  return "Click to expand";
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = { day: 86400, hour: 3600, minute: 60 };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

function getTopType(items) {
  if (!items.length) return "-";

  const count = {};
  items.forEach(i => {
    count[i.type] = (count[i.type] || 0) + 1;
  });

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}