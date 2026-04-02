export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div className="h-16 bg-zinc-900 flex items-center justify-between px-6 border-b border-zinc-800">

      {/* SEARCH */}
      <input
        placeholder="Search your brain..."
        className="bg-zinc-800 px-4 py-2 rounded-lg w-96 outline-none"
      />

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg">
          + Add Content
        </button>

        {/* LOGOUT BUTTON */}
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