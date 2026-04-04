import { X } from "lucide-react";

export default function ItemDrawer({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

      {/* PANEL */}
      <div className="w-full md:w-[400px] h-full bg-[#111] border-l border-zinc-800 p-5 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Detail</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          <div>
            <p className="text-xs text-gray-400">Type</p>
            <p>{item.type}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Content</p>
            <p className="text-sm">{item.content}</p>
          </div>

          {item.summary && (
            <div>
              <p className="text-xs text-gray-400">Summary</p>
              <p className="text-sm">{item.summary}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </div>

        </div>
      </div>
    </div>
  );
}