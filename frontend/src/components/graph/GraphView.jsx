import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import API from "../../services/api";

export default function GraphView() {
  const fgRef = useRef();
  const containerRef = useRef();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const [hoverNode, setHoverNode] = useState(null);
  const [search, setSearch] = useState("");

  const [size, setSize] = useState({ width: 800, height: 600 });

  // Fetch graph
  const fetchGraph = async () => {
    try {
      const res = await API.get("/graph");
      const data = res.data.data;

      setGraphData({
        nodes: data.nodes.map((n) => ({
          id: n.id,
          group: n.tags?.[0] || "default",
          description: n.label,
        })),
        links: data.links.map((l) => ({
          source: l.source,
          target: l.target,
          weight: l.weight || 1,
        })),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGraph();
    const interval = setInterval(fetchGraph, 10000);
    return () => clearInterval(interval);
  }, []);

  // Resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Center
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length) {
      setTimeout(() => fgRef.current.zoomToFit(400, 80), 500);
    }
  }, [graphData]);

  // Highlight logic
  const highlightNode = (node) => {
    const nodes = new Set();
    const links = new Set();

    nodes.add(node);

    graphData.links.forEach((link) => {
      if (link.source.id === node.id || link.source === node.id) {
        nodes.add(link.target);
        links.add(link);
      }
      if (link.target.id === node.id || link.target === node.id) {
        nodes.add(link.source);
        links.add(link);
      }
    });

    setHighlightNodes(nodes);
    setHighlightLinks(links);

    fgRef.current.centerAt(node.x, node.y, 800);
    fgRef.current.zoom(2.2, 800);
  };

  const handleSearch = (value) => {
    setSearch(value);

    const node = graphData.nodes.find((n) =>
      n.id.toLowerCase().includes(value.toLowerCase())
    );

    if (node) {
      setSelectedNode(node);
      highlightNode(node);
    }
  };

  const clearAll = () => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setSearch("");
  };

  return (
    <div className="w-full relative">

      {/* FLOATING SEARCH */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl px-4 py-2 shadow-lg">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-white placeholder-gray-400 w-64"
        />
      </div>

      {/* GRAPH */}
      <div className="flex w-full h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            width={size.width}
            height={size.height}
            backgroundColor="#050505"

            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 14 / globalScale;

              ctx.font = `${fontSize}px Inter`;

              const isHighlighted = highlightNodes.has(node);
              const opacity =
                highlightNodes.size > 0
                  ? isHighlighted
                    ? 1
                    : 0.15
                  : 1;

              ctx.fillStyle = `rgba(255,255,255,${opacity})`;
              ctx.fillText(label, node.x + 8, node.y + 8);
            }}

            linkColor={(link) =>
              highlightLinks.has(link)
                ? "#ff4d4d"
                : "rgba(255,255,255,0.08)"
            }

            linkWidth={(link) =>
              highlightLinks.has(link)
                ? 2 + (link.weight || 1) * 2
                : 1
            }

            linkDirectionalParticles={(link) =>
              highlightLinks.has(link) ? 3 : 0
            }

            linkDirectionalParticleColor={() => "#ff4d4d"}

            onNodeClick={(node) => {
              setSelectedNode(node);
              highlightNode(node);
            }}

            onNodeHover={(node) => setHoverNode(node || null)}

            cooldownTicks={100}
            d3VelocityDecay={0.25}
          />
        </div>

        {/* SIDEBAR (GLASS) */}
        {selectedNode && (
          <div className="w-[320px] backdrop-blur-xl bg-white/5 border-l border-white/10 p-5 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-2">
              {selectedNode.id}
            </h2>

            <p className="text-sm text-gray-300 mb-4">
              {selectedNode.description || "No description"}
            </p>

            <div className="text-xs text-gray-400">
              Connected nodes: {highlightNodes.size - 1}
            </div>

            <button
              onClick={clearAll}
              className="mt-6 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm transition"
            >
              Close
            </button>
          </div>
        )}

        {/* HOVER TOOLTIP */}
        {hoverNode && (
          <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-white/10">
            {hoverNode.id}
          </div>
        )}
      </div>
    </div>
  );
}