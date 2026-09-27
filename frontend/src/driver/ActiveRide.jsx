import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { useRide } from "../context/RideContext";
import { driverAPI } from "../services/api";

export default function ActiveRide() {
  const navigate = useNavigate();
  const { activeRide } = useRide();
  const [completing, setCompleting] = useState(false);

  if (!activeRide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-ink/60">
        No ride in progress. Accept a request to get started.
      </div>
    );
  }

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await driverAPI.completeRide(activeRide.id);
      navigate("/driver/earnings");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Active ride</h1>

      <Map pickupLabel={activeRide.pickup} dropLabel={activeRide.drop} />

      <div className="card p-5 mt-6 flex items-center justify-between">
        <div>
          <p className="font-medium">{activeRide.riderName}</p>
          <p className="text-sm text-ink/50 mt-1">
            {activeRide.pickup} &rarr; {activeRide.drop}
          </p>
        </div>
        <p className="font-display font-semibold">₹{activeRide.fare}</p>
      </div>

      <button onClick={handleComplete} disabled={completing} className="btn-primary w-full mt-6">
        {completing ? "Wrapping up…" : "Mark ride complete"}
      </button>
    </div>
  );
}
