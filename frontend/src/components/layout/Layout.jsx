import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-zinc-950 text-white">

        <Header />

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
}