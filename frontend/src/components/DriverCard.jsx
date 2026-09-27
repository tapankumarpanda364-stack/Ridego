export default function DriverCard({ driver }) {
  const { name, rating, vehicleModel, plateNumber, photoUrl, etaMin } = driver;

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-ink/10 overflow-hidden shrink-0">
        {photoUrl && (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-ink/60">
          {vehicleModel} &middot; {plateNumber}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">&#9733; {rating}</p>
        <p className="text-xs text-ink/50">{etaMin} min away</p>
      </div>
    </div>
  );
}
