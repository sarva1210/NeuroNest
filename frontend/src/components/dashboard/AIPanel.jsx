import Card from "../ui/Card";
import API from "../../services/api";

export default function AIPanel() {

  const askAI = async () => {
    const query = prompt("Ask something");
    if (!query) return;

    try {
      const res = await API.post("/search/ask", { query });

      alert(res.data.answer);
    } catch (err) {
      console.error("AI error:", err);
    }
  };

  return (
    <Card>
      <h2 className="font-semibold mb-3">AI Assistant</h2>

      <button
        onClick={askAI}
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
      >
        Ask AI
      </button>
    </Card>
  );
}