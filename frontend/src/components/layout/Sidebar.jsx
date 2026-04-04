import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Newspaper, MessageSquare, Share2, Layers, Clock } from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const nav = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/feed", label: "Feed", icon: Newspaper },
    { path: "/chat", label: "Chat", icon: MessageSquare },
    { path: "/graph", label: "Graph", icon: Share2 },
    { path: "/collections", label: "Collections", icon: Layers },
    { path: "/resurface", label: "Resurface", icon: Clock },
  ];

  return (
    <div className={`${collapsed ? "w-16" : "w-60"} md:${collapsed ? "w-20" : "w-64"} transition-all duration-300 bg-[#0f0f0f] border-r border-zinc-800 flex flex-col`}>
      
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && <h1 className="text-lg font-semibold">NeuroNest</h1>}
        <button onClick={() => setCollapsed(p => !p)}>☰</button>
      </div>

      <nav className="p-3 space-y-2">
        {nav.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                active ? "bg-purple-600 text-white" : "text-zinc-400 hover:bg-zinc-800"
              }`}>
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}