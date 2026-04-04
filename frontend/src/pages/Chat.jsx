import { useState, useRef, useEffect } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // USE CHAT (NOT ASK)
      const res = await API.post("/search/chat", {
        message: input,
        history: updatedMessages,
      });

      const aiMsg = {
        role: "ai",
        text: res.data.answer,
        source: res.data.source,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[80vh]">

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-purple-600 ml-auto"
                  : "bg-zinc-800"
              }`}
            >
              {msg.text}

              {msg.source && (
                <div className="text-xs text-gray-400 mt-1">
                  {msg.source === "web" ? "Web" : "Memory"}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-zinc-400">Thinking...</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="flex gap-2 p-4 border-t border-zinc-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your brain..."
            className="flex-1 bg-zinc-900 p-3 rounded-lg outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-purple-600 px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}