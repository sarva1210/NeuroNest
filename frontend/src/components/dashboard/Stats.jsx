import { useEffect, useState } from "react";
import Card from "../ui/Card";
import { FileText, PlayCircle, X, File } from "lucide-react";
import { getStats } from "../../services/item.service";

export default function Stats() {
  const [stats, setStats] = useState({
    notes: 0,
    videos: 0,
    tweets: 0,
    docs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error("Stats error", err);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Notes",
      value: stats.notes,
      icon: FileText,
      color: "text-blue-400",
    },
    {
      title: "Videos",
      value: stats.videos,
      icon: PlayCircle,
      color: "text-red-400",
    },
    {
      title: "Tweets",
      value: stats.tweets,
      icon: X,
      color: "text-sky-400",
    },
    {
      title: "Docs",
      value: stats.docs,
      icon: File,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statsData.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title} className="flex justify-between">
            <div>
              <p className="text-zinc-400 text-sm">{item.title}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>

            <Icon className={item.color} />
          </Card>
        );
      })}
    </div>
  );
}