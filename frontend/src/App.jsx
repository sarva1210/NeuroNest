import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Graph from "./pages/Graph";
import Collections from "./pages/Collections";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </BrowserRouter>
  );
}