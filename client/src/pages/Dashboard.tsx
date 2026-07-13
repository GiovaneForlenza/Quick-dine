/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  dummyFeaturedRestaurants,
  dummyMyBookingsData,
} from "../assets/assets.ts";
import AuthModal from "../components/AuthModal.tsx";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";
import { useAppContext } from "../context/AppContext.tsx";

export default function Dashboard() {
  const { user } = useAppContext();

  const [bookings, setBookings] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setBookings(dummyMyBookingsData);
      setLoadingBookings(false);
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Fetch generic recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendations(dummyFeaturedRestaurants);
    };
    fetchRecommendations();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      toast.success("Reservation cancelled successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  if (!user) return null;

  // Filter bookings into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((b) => {
    const bDate = new Date(b.date);
    return bDate >= today && b.status === "confirmed";
  });

  const pastBookings = bookings.filter((b) => {
    const bDate = new Date(b.date);
    return bDate < today || b.status !== "confirmed";
  });

  return (
    <div className="bg-surface flex min-h-screen flex-col pt-20">
      <Navbar />
      <AuthModal />

      <main className="mx-auto w-full max-w-7xl grow px-6 py-12 md:px-10">
        {/* Main Content Area */}
        <div className="grow space-y-10">
          {/* Welcoming header */}
          <div className="border-outline-variant/10 border-b pb-4">
            <h2 className="font-display text-primary text-2xl font-semibold md:text-3xl">
              Welcome back, {user.name.split(" ")[0]}
            </h2>
            <p className="mt-1.5 text-xs text-black/55">
              Manage your upcoming dining experiences.
            </p>
          </div>

          <div className="space-y-10">
            {/* Upcoming Reservations */}
            <div className="space-y-4">
              <h3 className="font-display text-primary text-lg font-medium">
                Upcoming Bookings
              </h3>

              {loadingBookings ? (
                <div className="border-outline-variant/10 flex justify-center border bg-white p-12 text-center">
                  <div className="border-outline-variant/30 border-t-secondary h-6 w-6 animate-spin rounded-full border-2"></div>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="border-outline-variant/10 rounded-md border bg-white p-12 text-center">
                  <CalendarDaysIcon
                    size={36}
                    className="text-outline-variant mx-auto mb-2"
                  />

                  <p className="text-xs text-black/55 italic">
                    No upcoming reservations scheduled.
                  </p>

                  <Link
                    to="/search"
                    className="bg-primary hover:bg-secondary mt-4 inline-block px-6 py-2.5 text-[10px] font-medium tracking-widest text-white uppercase transition-colors"
                  >
                    Book a Table
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((b) => (
                    <div
                      key={b._id}
                      className="border-outline-variant/20 flex flex-col items-start justify-between gap-6 rounded-md border bg-white p-6 shadow-sm md:flex-row md:items-center"
                    >
                      <div className="flex gap-4">
                        <div className="bg-surface h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={b.restaurant?.image}
                            alt={b.restaurant?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-secondary text-[9px] font-medium tracking-widest uppercase">
                            {b.restaurant?.cuisine}
                          </span>
                          <h4 className="font-display text-primary text-base font-medium">
                            {b.restaurant?.name}
                          </h4>
                          <p className="flex items-center gap-1 text-xs text-black/55">
                            <MapPinIcon size={12} />
                            {b.restaurant?.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-on-surface bg-surface-container-low border-outline-variant/10 flex w-full flex-wrap items-center gap-6 rounded-md border p-4 text-xs md:w-auto">
                        <div className="border-outline-variant/20 flex items-center gap-2 pr-4 md:border-r">
                          <CalendarIcon size={14} className="text-secondary" />
                          <span className="font-medium">
                            {new Date(b.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="border-outline-variant/20 flex items-center gap-2 pr-4 md:border-r">
                          <ClockIcon size={14} className="text-secondary" />
                          <span className="font-medium">{b.time} PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon size={14} className="text-secondary" />
                          <span className="font-medium">{b.guests} Guests</span>
                        </div>
                      </div>

                      <div className="flex w-full justify-end gap-3 md:w-auto">
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          className="text-error hover:bg-error-container/20 border-outline-variant/40 cursor-pointer rounded-sm border px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past & Cancelled Dining History */}
            <div className="space-y-4">
              {loadingBookings
                ? null
                : pastBookings.length !== 0 && (
                    <>
                      <h3 className="font-display text-primary text-lg font-medium">
                        Dining History
                      </h3>
                      <div className="border-outline-variant/20 overflow-hidden rounded-md border bg-white shadow-sm">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-surface-container-low border-outline-variant/10 border-b text-[10px] font-medium tracking-wider text-black/55 uppercase">
                              <th className="p-4">Restaurant</th>
                              <th className="p-4">Date & Time</th>
                              <th className="p-4">Party</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-outline-variant/10 divide-y">
                            {pastBookings.map((b) => (
                              <tr key={b._id} className="hover:bg-surface/50">
                                <td className="text-primary p-4 font-medium">
                                  <Link
                                    to={`/restaurant/${b.restaurant?.slug}`}
                                    className="hover:text-secondary"
                                  >
                                    {b.restaurant?.name}
                                  </Link>
                                </td>
                                <td className="p-4">
                                  {new Date(b.date).toLocaleDateString()} at{" "}
                                  {b.time} PM
                                </td>
                                <td className="p-4">
                                  {b.guests}{" "}
                                  {b.guests === 1 ? "Guest" : "Guests"}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`inline-block rounded-sm px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase ${
                                      b.status === "confirmed"
                                        ? "bg-secondary-container/30 text-on-secondary-container"
                                        : b.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-error-container text-on-error-container"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="border-outline-variant/10 space-y-4 border-t pt-10">
              <h3 className="font-display text-primary text-lg font-medium">
                Recommended for You
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.slice(0, 3).map((r) => (
                  <RestaurantCard key={r._id} restaurant={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
