import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/layout/Layout";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/search/chat", {
        message,
      });

      const aiMessage = {
        role: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error talking to AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[85vh]">

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              Start a conversation...
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[60%] text-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : "bg-[#1a1a1a] text-gray-300 border border-[#3a2a22]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* TYPING ANIMATION */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl bg-[#1a1a1a] text-gray-400 border border-[#3a2a22] text-sm animate-pulse">
                AI is typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="flex gap-3 p-4 border-t border-[#2a2a2a]">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="have a conversation..."
            className="flex-1 bg-[#1a1a1a] px-4 py-2 rounded-lg outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 rounded-lg disabled:opacity-50"
          >
            Send
          </button>

        </div>
      </div>
    </Layout>
  );
}