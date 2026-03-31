import Layout from "../components/layout/Layout";
import GraphView from "../components/graph/GraphView";

export default function Graph() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Knowledge Graph</h1>
      <GraphView />
    </Layout>
  );
}