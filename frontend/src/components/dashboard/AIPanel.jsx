import Card from "../ui/Card";
import { Sparkles } from "lucide-react";

export default function AIPanel() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-purple-400" size={18} />
        <h2 className="font-semibold">AI Insights</h2>
      </div>

      <div className="text-sm text-zinc-400 space-y-2">
        <p>• You saved 12 AI-related items this week</p>
        <p>• Most frequent topic: Startups</p>
        <p>• Suggested topic to explore: "Fundraising"</p>
      </div>

      <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm">
        Ask AI
      </button>
    </Card>
  );
}