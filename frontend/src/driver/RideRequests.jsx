import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { driverAPI } from "../services/api";

export default function RideRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    driverAPI
      .getRequests()
      .then(({ data }) => setRequests(data.requests))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (rideId) => {
    setAcceptingId(rideId);
    try {
      await driverAPI.acceptRide(rideId);
      navigate("/driver/active");
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) return <Loader label="Looking for ride requests" />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Ride requests</h1>

      {requests.length === 0 && (
        <p className="text-ink/60">No requests right now — stay online and the next one will show up here.</p>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="card p-5 flex items-center justify-between">
            <div>
              <p className="font-medium">{req.pickup} &rarr; {req.drop}</p>
              <p className="text-sm text-ink/50 mt-1">
                {req.distanceKm} km &middot; ₹{req.fare} fare
              </p>
            </div>
            <button
              onClick={() => handleAccept(req.id)}
              disabled={acceptingId === req.id}
              className="btn-primary"
            >
              {acceptingId === req.id ? "Accepting…" : "Accept"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
