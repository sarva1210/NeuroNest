import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import ForceGraph2D from "react-force-graph-2d";

export default function Graph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await API.get("/graph");

      setData({
        nodes: Array.isArray(res.data.nodes) ? res.data.nodes : [],
        links: Array.isArray(res.data.links) ? res.data.links : [],
      });

    } catch (err) {
      console.error("Graph error:", err);
      setData({ nodes: [], links: [] });
    }
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Knowledge Graph</h1>
      </div>

      {/* GRAPH CONTAINER */}
      <div className="bg-[#121212] rounded-xl p-4">

        <div className="h-[70vh] w-full overflow-hidden">

          {data.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No graph data available
            </div>
          ) : (
            <ForceGraph2D
              graphData={data}

              width={window.innerWidth - 300} 
              height={window.innerHeight - 200}

              nodeRelSize={6}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.003}

              nodeCanvasObject={(node, ctx) => {
                ctx.fillStyle = "#a855f7";
                ctx.beginPath();
                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = "#fff";
                ctx.font = "10px Arial";
                ctx.fillText(
                  node.name?.slice(0, 20) || "node",
                  node.x + 8,
                  node.y + 4
                );
              }}
            />
          )}

        </div>
      </div>
    </Layout>
  );
}