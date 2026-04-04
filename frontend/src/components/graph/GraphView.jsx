import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import API from "../../services/api";

export default function GraphView() {
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const fgRef = useRef();

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const res = await API.get("/graph");
      setGraphData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // auto fit
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 80);
      }, 500);
    }
  }, [graphData]);

  return (
    <div className="w-full h-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}

        backgroundColor="#121212"

        nodeLabel="label"

        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;

          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, node.x + 8, node.y + 8);

          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#AB8D6F";
          ctx.fill();
        }}

        linkColor={() => "#5D3721"}
        linkWidth={1.5}

        linkDirectionalParticles={2}
        linkDirectionalParticleColor={() => "#AB8D6F"}
        linkDirectionalParticleSpeed={0.003}

        onNodeClick={(node) => {
          fgRef.current.centerAt(node.x, node.y, 800);
          fgRef.current.zoom(2.5, 800);
        }}
      />
    </div>
  );
}