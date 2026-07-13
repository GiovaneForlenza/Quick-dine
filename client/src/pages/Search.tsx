/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Check,
  MapPin,
  Search as SearchIcon,
  SearchXIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { dummyRestaurant } from "../assets/assets.ts";
import AuthModal from "../components/AuthModal.tsx";
import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI Layout states
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states initialized from URL params
  const searchVal = searchParams.get("search") || "";
  const locationVal = searchParams.get("location") || "";
  const cuisinesSelected = searchParams.getAll("cuisine");
  const pricesSelected = searchParams.getAll("priceRange");
  const sortVal = searchParams.get("sort") || "";

  // Temp text inputs for immediate user typing (submit on enter/click)
  const [tempSearch, setTempSearch] = useState(searchVal);
  const [tempLocation, setTempLocation] = useState(locationVal);

  useEffect(() => {
    // Sync inputs with URL params on navigation
    (() => {
      setTempSearch(searchVal);
      setTempLocation(locationVal);
    })();
  }, [searchVal, locationVal]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setRestaurants(dummyRestaurant);
      setLoading(false);
    };

    fetchRestaurants();
  }, [searchParams]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (tempSearch) nextParams.set("search", tempSearch);
    else nextParams.delete("search");

    if (tempLocation) nextParams.set("location", tempLocation);
    else nextParams.delete("location");

    setSearchParams(nextParams);
  };

  const handleCuisineToggle = (cuisine: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const current = nextParams.getAll("cuisine");

    if (current.includes(cuisine)) {
      // Remove
      const updated = current.filter((c) => c !== cuisine);
      nextParams.delete("cuisine");
      updated.forEach((u) => nextParams.append("cuisine", u));
    } else {
      // Add
      nextParams.append("cuisine", cuisine);
    }
    setSearchParams(nextParams);
  };

  const handlePriceToggle = (price: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const current = nextParams.getAll("priceRange");

    if (current.includes(price)) {
      const updated = current.filter((p) => p !== price);
      nextParams.delete("priceRange");
      updated.forEach((u) => nextParams.append("priceRange", u));
    } else {
      nextParams.append("priceRange", price);
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (sort: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sort) {
      nextParams.set("sort", sort);
    } else {
      nextParams.delete("sort");
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setTempSearch("");
    setTempLocation("");
  };

  const priceOptions = ["$", "$$", "$$$", "$$$$"];
  const cuisineOptions = [
    "Italian",
    "French",
    "Japanese",
    "Steakhouse",
    "Vegetarian",
  ];

  return (
    <div className="bg-surface flex min-h-screen flex-col pt-20">
      <Navbar />
      <AuthModal />

      {/* Sub-header / Search inputs */}
      <div className="border-outline-variant/10 sticky top-16 z-10 border-b bg-white py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-10">
          <form
            onSubmit={handleTextSubmit}
            className="flex w-full flex-wrap items-center gap-3 md:w-auto"
          >
            <div className="relative min-w-50 grow sm:grow-0">
              <SearchIcon
                size={16}
                className="text-black/55/70 absolute top-2 left-2.5"
              />
              <input
                type="text"
                placeholder="Search cuisine or name..."
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                className="border-outline-variant/40 focus:border-secondary bg-surface-container-low/30 w-full rounded-md border py-2 pr-3 pl-9 text-xs focus:outline-none"
              />
            </div>
            <div className="relative min-w-50 grow sm:grow-0">
              <MapPin
                size={16}
                className="text-black/55/70 absolute top-2 left-2.5"
              />
              <input
                type="text"
                placeholder="Location..."
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="border-outline-variant/40 focus:border-secondary bg-surface-container-low/30 w-full rounded-md border py-2 pr-3 pl-9 text-xs focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-secondary cursor-pointer rounded-md px-5 py-2.5 text-[10px] font-medium tracking-wider text-white uppercase transition-colors"
            >
              UPDATE
            </button>
          </form>

          <div className="flex w-full justify-end gap-3 md:w-auto">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="border-outline-variant/50 hover:border-primary flex cursor-pointer items-center gap-1.5 border bg-white px-4 py-2 text-xs font-medium transition-colors md:hidden"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl grow gap-10 px-6 py-10 md:px-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-44 space-y-8">
            <div className="border-outline-variant/10 flex items-center justify-between border-b pb-4">
              <h3 className="font-display text-primary text-lg font-medium">
                Filters
              </h3>
              <button
                onClick={clearAllFilters}
                className="text-secondary hover:text-primary cursor-pointer text-[10px] font-medium tracking-wider uppercase"
              >
                Clear All
              </button>
            </div>

            {/* Cuisine Filter */}
            <div className="space-y-3">
              <h4 className="text-primary text-xs font-medium tracking-wider uppercase">
                Cuisine
              </h4>
              <div className="space-y-2">
                {cuisineOptions.map((c) => {
                  const active = cuisinesSelected.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => handleCuisineToggle(c)}
                      className="hover:text-primary flex w-full cursor-pointer items-center justify-between py-1 text-left text-xs text-black/55 transition-colors"
                    >
                      <span>{c}</span>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-colors ${
                          active
                            ? "bg-primary border-primary text-white"
                            : "border-outline-variant"
                        }`}
                      >
                        {active && <Check size={10} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <h4 className="text-primary text-xs tracking-wider uppercase">
                Price Range
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {priceOptions.map((p) => {
                  const active = pricesSelected.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => handlePriceToggle(p)}
                      className={`cursor-pointer rounded-sm border py-2 text-center text-xs transition-colors ${
                        active
                          ? "bg-primary border-primary text-white"
                          : "border-outline-variant/50 text-on-surface hover:border-primary"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Section */}
        <div className="flex flex-1 flex-col">
          <div className="border-outline-variant/10 mb-8 flex items-center justify-between border-b pb-4">
            <p className="text-sm text-black/55">
              {restaurants.length}{" "}
              {restaurants.length === 1 ? "Restaurant" : "Restaurants"}{" "}
              Available
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider text-black/55 uppercase">
                SORT BY:
              </span>
              <select
                value={sortVal}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border-outline-variant/30 cursor-pointer rounded-sm border bg-transparent px-3 py-1.5 text-xs focus:outline-none"
              >
                <option value="">Default (Newest)</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex grow items-center justify-center py-24">
              <div className="border-outline-variant/30 border-t-secondary h-10 w-10 animate-spin rounded-full border-2"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex grow flex-col items-center justify-center py-24 text-center">
              <SearchXIcon size={36} className="text-outline-variant mb-4" />
              <h3 className="font-display mb-2 text-xl font-medium">
                No Restaurants Found
              </h3>
              <p className="mb-6 max-w-sm text-xs text-black/50">
                We couldn't find any premium establishments matching your search
                query. Try widening your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-primary hover:bg-secondary cursor-pointer px-6 py-3 text-xs tracking-widest text-white uppercase transition-colors"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="flex grow flex-col gap-6 lg:flex-row">
              {/* Restaurants List Grid */}
              <div className="grid grow grid-cols-1 gap-6 lg:grid-cols-2">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm duration-200 md:hidden">
          <div className="animate-in slide-in-from-right flex h-full w-80 flex-col justify-between bg-white p-6 shadow-2xl duration-300">
            <div>
              <div className="border-outline-variant/10 flex items-center justify-between border-b pb-4">
                <h3 className="font-display text-primary text-lg font-medium">
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="hover:text-primary cursor-pointer p-1 text-black/55 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cuisines */}
              <div className="space-y-3 py-6">
                <h4 className="text-primary text-xs tracking-wider uppercase">
                  Cuisine
                </h4>
                <div className="space-y-2">
                  {cuisineOptions.map((c) => {
                    const active = cuisinesSelected.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => handleCuisineToggle(c)}
                        className="hover:text-primary flex w-full cursor-pointer items-center justify-between py-1 text-left text-xs text-black/55"
                      >
                        <span>{c}</span>
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                            active
                              ? "bg-primary border-primary text-white"
                              : "border-outline-variant"
                          }`}
                        >
                          {active && <Check size={10} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prices */}
              <div className="border-outline-variant/10 space-y-3 border-t py-4">
                <h4 className="text-primary text-xs font-medium tracking-wider uppercase">
                  Price Range
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {priceOptions.map((p) => {
                    const active = pricesSelected.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => handlePriceToggle(p)}
                        className={`cursor-pointer rounded-sm border py-2 text-center text-xs font-medium transition-colors ${
                          active
                            ? "bg-primary border-primary text-white"
                            : "border-outline-variant/50 text-on-surface hover:border-primary"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="border-outline-variant/10 flex gap-3 border-t pt-4">
              <button
                onClick={clearAllFilters}
                className="border-outline-variant/50 flex-1 cursor-pointer border py-3 text-xs font-medium tracking-widest uppercase"
              >
                CLEAR
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="bg-primary hover:bg-secondary flex-1 cursor-pointer py-3 text-xs font-medium tracking-widest text-white uppercase"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
