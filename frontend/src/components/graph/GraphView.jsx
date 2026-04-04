import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import API from "../../services/api";
import ItemDrawer from "../ItemDrawer";

export default function GraphView() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const containerRef = useRef();
  const fgRef = useRef();

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    const res = await API.get("/graph");
    setGraphData(res.data.data || { nodes: [], links: [] });
  };

  return (
    <div ref={containerRef} className="w-full h-full">

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={containerRef.current?.offsetWidth || 800}
        height={containerRef.current?.offsetHeight || 500}
        backgroundColor="#121212"

        nodeCanvasObject={(node, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = "#AB8D6F";
          ctx.fill();
          ctx.fillText(node.label, node.x + 8, node.y + 8);
        }}

        onNodeClick={async (node) => {
          const res = await API.get(`/items/${node.id}`);
          setSelectedItem(res.data.data);
        }}
      />

      <ItemDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}