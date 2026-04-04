import { useState } from "react";
import Sidebar from "./Sidebar";
import AddContentModal from "../AddContentModal";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0b0b0b] text-white overflow-hidden">
      
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col w-full">

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

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </div>
      </div>

      <AddContentModal open={open} setOpen={setOpen} />
    </div>
  );
}