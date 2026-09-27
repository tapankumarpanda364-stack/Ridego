import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Map from "../components/Map";
import DriverCard from "../components/DriverCard";
import Loader from "../components/Loader";
import { rideAPI } from "../services/api";

export default function RideDetails() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    rideAPI
      .getRide(rideId)
      .then(({ data }) => active && setRide(data.ride))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [rideId]);

  const handleCancel = async () => {
    const { data } = await rideAPI.cancelRide(rideId);
    setRide(data.ride);
  };

  if (loading) return <Loader label="Loading your ride" />;
  if (!ride) return <p className="text-center py-16 text-ink/60">Ride not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Ride #{ride.id}</h1>
        <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-route/10 text-route">
          {ride.status}
        </span>
      </div>

      <Map pickupLabel={ride.pickup} dropLabel={ride.drop} />

      <div className="mt-6 space-y-4">
        {ride.driver && <DriverCard driver={ride.driver} />}

        <div className="card p-5 flex justify-between">
          <span className="text-ink/60">Fare</span>
          <span className="font-display font-semibold">₹{ride.fare}</span>
        </div>
      </div>

      {ride.status === "ongoing" && (
        <button onClick={handleCancel} className="btn-outline w-full mt-6 border-alert/40 text-alert hover:border-alert">
          Cancel ride
        </button>
      )}
    </div>
  );
}
