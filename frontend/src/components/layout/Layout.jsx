import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-zinc-950 min-h-screen text-white">
        <Header />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}