import { useState, useRef, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { chatAI } from "../services/chat.service";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // typing effect
  const typeMessage = async (text) => {
    let currentText = "";

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];

      await new Promise((resolve) => setTimeout(resolve, 10));

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = currentText;
        return updated;
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    setInput("");
    setLoading(true);

    try {
      const res = await chatAI(input, newMessages); //memory passed

      // add empty AI message first
      const aiMessage = {
        role: "ai",
        text: "",
        source: res.source,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 🔥 typing effect
      await typeMessage(res.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[80vh]">

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-xl ${
                msg.role === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-zinc-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

              {msg.source && (
                <p className="text-xs text-zinc-400 mt-1">
                  {msg.source === "web"
                    ? "🌐 Web"
                    : "🧠 Memory"}
                </p>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-zinc-400 text-sm">Thinking...</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 p-4 border-t border-zinc-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-zinc-900 p-3 rounded-lg outline-none"
            placeholder="Ask anything..."
          />

          <button
            onClick={handleSend}
            className="bg-purple-600 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}