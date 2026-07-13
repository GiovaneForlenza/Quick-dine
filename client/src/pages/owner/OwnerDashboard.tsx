/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { dummyMyBookingsData, dummyRestaurant } from "../../assets/assets.ts";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import Navbar from "../../components/Navbar.tsx";
import OwnerBookings from "../../components/owner/OwnerBookings.tsx";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.tsx";
import PendingApproval from "../../components/owner/PendingApproval.tsx";
import RequestRejected from "../../components/owner/RequestRejected.tsx";
import RestaurantWizard from "../../components/owner/RestaurantWizard.tsx";
import { useAppContext } from "../../context/AppContext.tsx";

export default function OwnerDashboard() {
  const { logout } = useAppContext();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "details">(
    "bookings",
  );

  const fetchOwnerData = async () => {
    setRestaurant(dummyRestaurant[0]);
    setBookings(dummyMyBookingsData);
    setLoading(false);
  };

  useEffect(() => {
    (async () => await fetchOwnerData())();
  }, []);

  if (loading) {
    return <Loader text="Loading Owner Dashboard..." />;
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col pt-20">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl grow px-6 py-12 md:px-10">
        {/* Heading */}
        <div className="border-outline-variant/10 mb-8 flex flex-col items-start justify-between gap-4 border-b pb-8 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-primary text-2xl md:text-3xl">
              Restaurant Portal
            </h1>
            <p className="mt-1.5 text-xs text-black/55">
              Review capacity limits and process live reservations.
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Case 1: No Restaurant Setup Profile */}
        {!restaurant ? (
          <RestaurantWizard setRestaurant={setRestaurant} />
        ) : restaurant.status === "pending" ? (
          /* Case 2: Profile Pending Approval */
          <PendingApproval restaurant={restaurant} />
        ) : restaurant.status === "rejected" ? (
          /* Case 3: Rejected */
          <RequestRejected restaurantName={restaurant.name} />
        ) : (
          /* Case 4: Approved - Full Dashboard Panel */
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Tab selector sidebar */}
            <aside className="border-outline-variant/20 h-fit space-y-6 rounded-md border bg-white p-6 shadow-sm lg:col-span-3">
              <div className="border-outline-variant/10 flex items-center gap-3.5 border-b pb-5">
                <span className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-base font-medium">
                  {restaurant.name.charAt(0)}
                </span>
                <div>
                  <h4 className="font-display text-primary line-clamp-1 text-base font-medium">
                    {restaurant.name}
                  </h4>
                  <span className="text-secondary bg-secondary-container/20 mt-0.5 inline-block rounded-sm px-2 py-0.5 text-[9px] tracking-widest uppercase">
                    APPROVED
                  </span>
                </div>
              </div>

              <nav className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-left text-xs font-medium tracking-wider uppercase transition-colors ${
                    activeTab === "bookings"
                      ? "bg-primary text-white"
                      : "hover:bg-surface text-black/55"
                  }`}
                >
                  <CalendarIcon size={14} />
                  Bookings ({bookings.length})
                </button>

                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-left text-xs font-medium tracking-wider uppercase transition-colors ${
                    activeTab === "details"
                      ? "bg-primary text-white"
                      : "hover:bg-surface text-black/55"
                  }`}
                >
                  <SettingsIcon size={14} />
                  Profile Details
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="space-y-8 lg:col-span-9">
              {/* Tab 1: Bookings List */}
              {activeTab === "bookings" && (
                <OwnerBookings
                  bookings={bookings}
                  setBookings={setBookings}
                  totalSeats={restaurant.totalSeats}
                />
              )}

              {/* Tab 3: Update details & slots capacity */}
              {activeTab === "details" && (
                <OwnerProfileDetails
                  restaurant={restaurant}
                  setRestaurant={setRestaurant}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
