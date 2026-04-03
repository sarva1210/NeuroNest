import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0b0b0b] text-white">

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">

          <input
            placeholder="Search your brain..."
            className="bg-zinc-800 px-4 py-2 rounded-xl w-[300px] outline-none focus:ring-2 focus:ring-purple-600 transition"
          />

          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-xl shadow-md">
              + Add Content
            </button>

            <button className="bg-red-500 px-4 py-2 rounded-xl">
              Logout
            </button>
          </div>

        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}