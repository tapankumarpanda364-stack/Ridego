import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationInput from "../components/LocationInput";
import Map from "../components/Map";
import FareCard from "../components/FareCard";
import Loader from "../components/Loader";
import { rideAPI } from "../services/api";
import { useRide } from "../context/RideContext";

const VEHICLE_OPTIONS = ["Bike", "Auto", "Sedan", "SUV"];

export default function BookRide() {
  const navigate = useNavigate();
  const { pickup, setPickup, drop, setDrop, setActiveRide } = useRide();
  const [vehicleType, setVehicleType] = useState("Auto");
  const [estimates, setEstimates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const canEstimate = pickup && drop;

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const { data } = await rideAPI.estimateFare({ pickup, drop });
      setEstimates(data.estimates); // array of { vehicleType, distanceKm, durationMin, fare, surge }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setBooking(true);
    try {
      const { data } = await rideAPI.bookRide({ pickup, drop, vehicleType });
      setActiveRide(data.ride);
      navigate(`/rides/${data.ride.id}`);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Book a ride</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-5">
          <LocationInput
            label="Pickup"
            placeholder="Current location"
            value={pickup || ""}
            onChange={setPickup}
            markerColor="bg-ink"
          />
          <LocationInput
            label="Drop"
            placeholder="Where to?"
            value={drop || ""}
            onChange={setDrop}
            markerColor="bg-marigold"
          />

          <div>
            <label className="block text-xs font-medium text-ink/50 mb-2">Vehicle type</label>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_OPTIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVehicleType(v)}
                  className={`py-2.5 rounded-lg border text-sm font-medium ${
                    vehicleType === v ? "border-route bg-route/10 text-route" : "border-ink/15"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleEstimate}
            disabled={!canEstimate || loading}
            className="btn-primary w-full"
          >
            {loading ? "Checking fares…" : "See fare estimates"}
          </button>
        </div>

        <div className="md:col-span-3">
          <Map pickupLabel={pickup || "Pickup"} dropLabel={drop || "Drop"} />
        </div>
      </div>

      {loading && <Loader label="Estimating fares" />}

      {estimates && !loading && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Choose a ride</h2>
          <div className="space-y-3">
            {estimates.map((est) => (
              <FareCard key={est.vehicleType} estimate={est} />
            ))}
          </div>

          <button
            onClick={handleBook}
            disabled={booking}
            className="btn-primary w-full mt-6"
          >
            {booking ? "Confirming your ride…" : `Confirm ${vehicleType}`}
          </button>
        </div>
      )}
    </div>
  );
}
