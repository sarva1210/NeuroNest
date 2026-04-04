import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Graph from "./pages/Graph";
import Collections from "./pages/Collections";
import Auth from "./pages/Auth";
import Resurface from "./pages/Resurface";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTE */}
        <Route
          path="/auth"
          element={isLoggedIn ? <Navigate to="/" /> : <Auth />}
        />

        {/* PROTECTED ROUTES */}
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/resurface" element={<Resurface />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/auth" />} />
        )}

      </Routes>
    </BrowserRouter>
  );
}