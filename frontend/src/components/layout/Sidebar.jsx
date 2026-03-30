import { Home, Database, MessageSquare, Share2, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Feed", path: "/feed", icon: Database }, // ✅ added
    { name: "Chat", path: "/chat", icon: MessageSquare },
    { name: "Graph", path: "/graph", icon: Share2 },
    { name: "Collections", path: "/collections", icon: Layers },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-900 p-4 text-white">
      <h1 className="text-xl font-bold mb-6">NeuroNest</h1>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                active ? "bg-purple-600" : "hover:bg-zinc-800"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}