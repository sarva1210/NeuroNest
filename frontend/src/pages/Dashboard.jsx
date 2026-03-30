import Layout from "../components/layout/Layout";
import Stats from "../components/dashboard/Stats";
import RecentItems from "../components/dashboard/RecentItems";
import AIPanel from "../components/dashboard/AIPanel";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Stats */}
      <Stats />

      {/* Main Section */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <RecentItems />
        <AIPanel />
      </div>
    </Layout>
  );
}