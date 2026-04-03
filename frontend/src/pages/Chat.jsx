import { useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input) return;

    try {
      const res = await API.post("/chat", {
        message: input,
        history: messages,
      });

      setMessages([
        ...messages,
        { role: "user", text: input },
        { role: "ai", text: res.data.answer },
      ]);

      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">

        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-md ${
                m.role === "user"
                  ? "bg-purple-600 ml-auto"
                  : "bg-zinc-800"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 p-3 rounded-lg"
            placeholder="Ask anything..."
          />
          <button
            onClick={send}
            className="bg-purple-600 px-4 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </Layout>
  );
}