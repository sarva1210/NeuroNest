import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Newspaper, MessageSquare, Share2, Layers } from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const nav = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/feed", label: "Feed", icon: Newspaper },
    { path: "/chat", label: "Chat", icon: MessageSquare },
    { path: "/graph", label: "Graph", icon: Share2 },
    { path: "/collections", label: "Collections", icon: Layers },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 bg-[#0f0f0f] border-r border-zinc-800 flex flex-col`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        
        {!collapsed && (
          <h1 className="text-lg font-semibold tracking-wide">
            NeuroNest
          </h1>
        )}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="bg-zinc-800 px-2 py-1 rounded-md hover:bg-zinc-700 transition"
        >
          ☰
        </button>
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
              ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                  : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {/* ICON */}
              <Icon size={20} />

              {/* TEXT */}
              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}