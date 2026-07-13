import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import BookingConfirmation from "./pages/BookingConfirmation.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";
import RestaurantDetail from "./pages/RestaurantDetail.tsx";
import Search from "./pages/Search.tsx";

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1c1c",
            color: "#ffffff",
            fontFamily: "Manrope, sans-serif",
            fontSize: "12px",
            letterSpacing: "0.02em",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
        <Route
          path="/booking/:slug"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
