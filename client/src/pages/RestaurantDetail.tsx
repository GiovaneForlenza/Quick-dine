/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { dummyAvailability, dummyRestaurant } from "../assets/assets.ts";
import AuthModal from "../components/AuthModal.tsx";
import Footer from "../components/Footer.tsx";
import Loader from "../components/Loader.tsx";
import Navbar from "../components/Navbar.tsx";
import BookingWidget from "../components/restaurant/BookingWidget.tsx";
import RestaurantHero from "../components/restaurant/RestaurantHero.tsx";
import RestaurantInfo from "../components/restaurant/RestaurantInfo.tsx";
import RestaurantReviews from "../components/restaurant/RestaurantReviews.tsx";
import { useAppContext } from "../context/AppContext.tsx";

export default function RestaurantDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, setAuthModalOpen } = useAppContext();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking Widget states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGuests, setSelectedGuests] = useState("2");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotsAvailability, setSlotsAvailability] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setRestaurant(dummyRestaurant.find((r) => r.slug === slug));
      setLoading(false);
    };

    if (slug) {
      fetchRestaurant();
    }
  }, [slug, navigate]);

  useEffect(() => {
    const fetchAvailability = async () => {
      setSlotsAvailability(dummyAvailability);
      setLoadingSlots(false);
    };
    fetchAvailability();
  }, [restaurant?._id, selectedDate]);

  if (loading) {
    return <Loader text="Loading Restaurant Details..." />;
  }

  if (!restaurant) return null;

  const handleReserveClick = () => {
    if (!selectedSlot) {
      toast.error("Please select a dining time slot.");
      return;
    }

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    // Redirect to confirmation page with query params
    navigate(
      `/booking/${restaurant.slug}?slot=${selectedSlot}&date=${selectedDate}&guests=${selectedGuests}`,
    );
  };

  return (
    <div className="bg-surface flex min-h-screen flex-col pt-20">
      <Navbar />
      <AuthModal />

      {/* Hero Image Section */}
      <RestaurantHero restaurant={restaurant} />

      {/* Split Content Section */}
      <main className="mx-auto w-full max-w-7xl grow px-6 py-12 md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column (Details, Menu, Reviews) */}
          <div className="space-y-12 lg:col-span-8">
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantReviews />
          </div>

          {/* Right Column (Sticky Reservation Widget) */}
          <div className="lg:sticky lg:top-36 lg:col-span-4">
            <BookingWidget
              restaurant={restaurant}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedGuests={selectedGuests}
              setSelectedGuests={setSelectedGuests}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              slotsAvailability={slotsAvailability}
              loadingSlots={loadingSlots}
              isAuthenticated={isAuthenticated}
              handleReserveClick={handleReserveClick}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
