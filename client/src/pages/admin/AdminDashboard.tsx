/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart3Icon, CheckCircleIcon, ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import Navbar from "../../components/Navbar.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

// Subcomponents
import { dummyAdminStats, dummyRestaurant } from "../../assets/assets.ts";
import AdminApprovals from "../../components/admin/AdminApprovals.tsx";
import AdminStats from "../../components/admin/AdminStats.tsx";

export default function AdminDashboard() {
  const { logout } = useAppContext();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"approvals" | "stats">(
    "approvals",
  );
  const [btnLoading, setBtnLoading] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setRestaurants(dummyRestaurant);
    setStats(dummyAdminStats);
    setLoading(false);
  };

  const handleApproveStatus = async (
    restaurantId: string,
    status: "approved" | "rejected",
  ) => {
    console.log(restaurantId, status);
    setBtnLoading(null);
  };

  useEffect(() => {
    (async () => await fetchAdminData())();
  }, []);

  if (loading) {
    return <Loader text="Loading Master Admin Console..." />;
  }

  // Segregate pending / other restaurants
  const pendingRestaurants = restaurants.filter((r) => r.status === "pending");
  const otherRestaurants = restaurants.filter((r) => r.status !== "pending");

  return (
    <div className="bg-surface flex min-h-screen flex-col pt-20">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl grow px-6 py-12 md:px-10">
        {/* Heading */}
        <div className="border-outline-variant/10 mb-8 flex flex-col items-start justify-between gap-4 border-b pb-8 text-left md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-primary flex items-center gap-2 text-2xl font-medium md:text-3xl">
              <ShieldCheckIcon size={28} className="text-secondary" /> Admin
              Console
            </h1>
            <p className="mt-1.5 text-xs text-black/55">
              Approve new restaurant partners, audit active slots listings, and
              review platform booking metrics.
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-error-container hover:bg-error-container/85 text-error cursor-pointer rounded-sm px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Tab Navigation Sidebar */}
          <aside className="border-outline-variant/20 h-fit space-y-6 rounded-md border bg-white p-6 shadow-sm lg:col-span-3">
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab("approvals")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-left text-xs font-medium tracking-wider uppercase transition-colors ${
                  activeTab === "approvals"
                    ? "bg-primary text-white"
                    : "hover:bg-surface text-black/55"
                }`}
              >
                <CheckCircleIcon size={14} />
                Approvals ({pendingRestaurants.length} Pending)
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-left text-xs font-medium tracking-wider uppercase transition-colors ${
                  activeTab === "stats"
                    ? "bg-primary text-white"
                    : "hover:bg-surface text-black/55"
                }`}
              >
                <BarChart3Icon size={14} />
                Analytics & Stats
              </button>
            </nav>
          </aside>

          {/* Content Panel */}
          <div className="space-y-8 lg:col-span-9">
            {/* Tab 1: Restaurant Approvals */}
            {activeTab === "approvals" && (
              <AdminApprovals
                pendingRestaurants={pendingRestaurants}
                otherRestaurants={otherRestaurants}
                btnLoading={btnLoading}
                onApproveStatus={handleApproveStatus}
              />
            )}

            {/* Tab 2: Analytics & Stats */}
            {activeTab === "stats" && stats && <AdminStats stats={stats} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
