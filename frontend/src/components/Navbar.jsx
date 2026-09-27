import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-ink flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-marigold" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            RideGo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/book" className="hover:text-route">Book a ride</Link>
          <Link to="/history" className="hover:text-route">Ride history</Link>
          {user?.role === "driver" && (
            <Link to="/driver" className="hover:text-route">Driver hub</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-route">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium hover:text-route">
                {user.name?.split(" ")[0] || "Profile"}
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm py-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-route">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="lane" />
    </header>
  );
}
