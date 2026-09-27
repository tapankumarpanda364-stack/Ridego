// Lightweight placeholder for the map surface. Swap the SVG for a real
// map SDK (Mapbox GL, Google Maps, Leaflet) by mounting it into the
// same container ref once API keys are wired up on the backend.
export default function Map({ pickupLabel, dropLabel }) {
  return (
    <div className="card relative overflow-hidden h-72 md:h-96 bg-ink/[0.03]">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#16211B" strokeOpacity="0.06" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />
        <path
          d="M60 220 C 120 220, 140 140, 200 140 S 300 60, 340 60"
          fill="none"
          stroke="#0F6E5D"
          strokeWidth="4"
          strokeDasharray="10 8"
          strokeLinecap="round"
        />
        <circle cx="60" cy="220" r="8" fill="#16211B" />
        <circle cx="340" cy="60" r="8" fill="#FFB100" />
      </svg>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-medium">
        <span className="bg-white/90 px-2.5 py-1 rounded-full border border-ink/10">
          {pickupLabel || "Pickup"}
        </span>
        <span className="bg-white/90 px-2.5 py-1 rounded-full border border-ink/10">
          {dropLabel || "Drop"}
        </span>
      </div>
    </div>
  );
}
