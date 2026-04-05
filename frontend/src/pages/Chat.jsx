import { useEffect, useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: "Hey! I’m your second brain \nI can use your memory + internet"
      }
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;

    setMessages(prev => [
      ...prev,
      { role: "user", text: userMsg }
    ]);

    setInput("");

    try {
      const res = await API.post("/chat", {
        message: userMsg
      });

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: res.data.reply,
          source: res.data.source
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Something went wrong" }
      ]);
    }
  };

  return (
    <Layout>
      <div className="h-[80vh] flex flex-col">

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="max-w-[60%]">
                <div
                  className={`px-4 py-2 rounded-xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-[#1a1a1a]"
                  }`}
                >
                  {msg.text}
                </div>

                {/* SOURCE TAG */}
                {msg.source && (
                  <div className="text-xs text-gray-500 mt-1 ml-1">
                    Source: {msg.source}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-[#121212] px-4 py-3 rounded-xl outline-none"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Send
          </button>
        </div>

      </div>
    </Layout>
  );
}