import Layout from "../components/layout/Layout";
import GraphView from "../components/graph/GraphView";

export default function Graph() {
  return (
    <Layout>
      <div className="w-full max-w-[1400px] mx-auto">

        <h1 className="text-2xl font-bold mb-2">
          Knowledge Graph
        </h1>

        <p className="text-sm text-gray-400 mb-4">
          Visualize your knowledge
        </p>

        <div className="w-full h-[70vh] bg-[#121212] border border-[#3a2a22] rounded-xl overflow-hidden">
          <GraphView />
        </div>

      </div>
    </Layout>
  );
}