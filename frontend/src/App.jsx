import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookRide from "./pages/BookRide";
import RideDetails from "./pages/RideDetails";
import RideHistory from "./pages/RideHistory";
import Profile from "./pages/Profile";

import DriverDashboard from "./driver/DriverDashboard";
import RideRequests from "./driver/RideRequests";
import ActiveRide from "./driver/ActiveRide";
import Earnings from "./driver/Earnings";

import AdminDashboard from "./admin/Dashboard";
import AdminUsers from "./admin/Users";
import AdminDrivers from "./admin/Drivers";
import AdminVehicles from "./admin/Vehicles";
import AdminRides from "./admin/Rides";

function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/book"
            element={
              <ProtectedRoute roles={["rider"]}>
                <BookRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides/:rideId"
            element={
              <ProtectedRoute>
                <RideDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute roles={["rider"]}>
                <RideHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver"
            element={
              <ProtectedRoute roles={["driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/requests"
            element={
              <ProtectedRoute roles={["driver"]}>
                <RideRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/active"
            element={
              <ProtectedRoute roles={["driver"]}>
                <ActiveRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute roles={["driver"]}>
                <Earnings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDrivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminVehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rides"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminRides />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
