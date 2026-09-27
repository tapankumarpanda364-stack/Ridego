import { useEffect, useState } from "react";
import RideCard from "../components/RideCard";
import Loader from "../components/Loader";
import { rideAPI } from "../services/api";

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rideAPI
      .getHistory()
      .then(({ data }) => setRides(data.rides))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Your rides</h1>

      {loading && <Loader label="Loading ride history" />}

      {!loading && rides.length === 0 && (
        <p className="text-ink/60">No rides yet — book your first one to see it here.</p>
      )}

      <div className="space-y-3">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
}
