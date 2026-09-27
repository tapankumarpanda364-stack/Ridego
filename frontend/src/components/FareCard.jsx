export default function FareCard({ estimate }) {
  if (!estimate) return null;

  const { vehicleType, distanceKm, durationMin, fare, surge } = estimate;

  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="font-display font-semibold">{vehicleType}</p>
        <p className="text-sm text-ink/60">
          {distanceKm} km &middot; {durationMin} min
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-xl font-semibold">₹{fare}</p>
        {surge > 1 && (
          <p className="text-xs text-alert font-medium">{surge}x surge</p>
        )}
      </div>
    </div>
  );
}
