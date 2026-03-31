import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function GraphView() {
  const fgRef = useRef();

  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const data = {
      nodes: [
        { id: "AI", group: "tech", description: "Artificial Intelligence" },
        { id: "React", group: "frontend", description: "UI Library" },
        { id: "Node.js", group: "backend", description: "Runtime" },
        {
          id: "Machine Learning",
          group: "tech",
          description: "Subset of AI",
        },
      ],
      links: [
        { source: "AI", target: "Machine Learning" },
        { source: "React", target: "Node.js" },
        { source: "AI", target: "React" },
      ],
    };

    setGraphData(data);
  }, []);

  // 🔥 Auto center graph
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 80);
      }, 500);
    }
  }, [graphData]);

  // 🔹 Node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);

    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(2.5, 800);
    }
  };

  return (
    <div className="flex h-[70vh] bg-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800">
      
      {/* Graph */}
      <div className="flex-1 relative">
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}

          //LINE COLOR
          linkColor={() => "white"}
          linkWidth={2}

          //particles (optional glow)
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={() => "white"}

          nodeAutoColorBy="group"
          backgroundColor="#0f0f0f"

          onNodeClick={handleNodeClick}

          cooldownTicks={100}
          onEngineStop={() => fgRef.current.zoomToFit(400, 80)}

          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 14 / globalScale;

            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "white";
            ctx.fillText(label, node.x + 8, node.y + 8);
          }}
        />
      </div>

      {/* 📌 Sidebar */}
      {selectedNode && (
        <div className="w-[280px] bg-[#1a1a1a] border-l border-gray-800 p-4">
          <h2 className="text-xl font-semibold mb-2 text-white">
            {selectedNode.id}
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            {selectedNode.description || "No description available"}
          </p>

          <div className="text-xs text-gray-500 mb-4">
            Group: {selectedNode.group}
          </div>

          <button
            onClick={() => setSelectedNode(null)}
            className="mt-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}