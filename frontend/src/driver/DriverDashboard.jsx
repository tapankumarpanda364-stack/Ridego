import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DriverDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-1">Welcome, {user?.name?.split(" ")[0]}</h1>
      <p className="text-ink/60 mb-8">Here's what's happening on your account today.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/driver/requests" className="card p-6 hover:border-ink/30">
          <p className="font-display text-2xl font-semibold text-route">New</p>
          <p className="text-sm text-ink/60 mt-1">Ride requests waiting</p>
        </Link>
        <Link to="/driver/active" className="card p-6 hover:border-ink/30">
          <p className="font-display text-2xl font-semibold text-marigold">Active</p>
          <p className="text-sm text-ink/60 mt-1">Your ongoing ride</p>
        </Link>
        <Link to="/driver/earnings" className="card p-6 hover:border-ink/30">
          <p className="font-display text-2xl font-semibold">Earnings</p>
          <p className="text-sm text-ink/60 mt-1">Track your payouts</p>
        </Link>
      </div>
    </div>
  );
}
