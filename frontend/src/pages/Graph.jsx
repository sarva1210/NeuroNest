import Layout from "../components/layout/Layout";
import GraphView from "../components/graph/GraphView";

export default function Graph() {
  return (
    <Layout>

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">
        Knowledge Graph
      </h1>

      {/* GRAPH CONTAINER */}
      <div className="w-full h-[75vh] bg-[#121212] border border-[#3a2a22] rounded-2xl overflow-hidden">
        <GraphView />
      </div>

    </Layout>
  );
}