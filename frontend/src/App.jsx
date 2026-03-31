import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Graph from "./pages/Graph";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  );
}