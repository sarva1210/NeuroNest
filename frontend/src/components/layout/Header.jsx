export default function Header() {
  return (
    <div className="h-16 bg-zinc-900 flex items-center justify-between px-6 border-b border-zinc-800">
      <input
        placeholder="Search your brain..."
        className="bg-zinc-800 px-4 py-2 rounded-lg w-96 outline-none"
      />

      <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg">
        + Add Content
      </button>
    </div>
  );
}