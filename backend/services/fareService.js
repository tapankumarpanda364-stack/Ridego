// Per-vehicle-type pricing. Tune these against real-world rates later —
// kept centralized here so rideController never hardcodes pricing.
const RATE_CARD = {
  Bike: { base: 15, perKm: 6, perMin: 0.5 },
  Auto: { base: 25, perKm: 9, perMin: 0.8 },
  Sedan: { base: 40, perKm: 13, perMin: 1.2 },
  SUV: { base: 60, perKm: 17, perMin: 1.5 },
};

// Deterministic mock distance/duration until a real routing/maps API is
// wired in. Swap the body of this function for a Google Directions /
// Mapbox Directions call — keep the same (distanceKm, durationMin) shape.
function estimateRoute(pickup, drop) {
  const seed = `${pickup}|${drop}`
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const distanceKm = Number((3 + (seed % 18)).toFixed(1));
  const durationMin = Math.round(distanceKm * 2.4 + (seed % 5));
  return { distanceKm, durationMin };
}

// Simple time-of-day surge: evenings/mornings get a bump. Replace with a
// real demand-based model once ride volume data exists.
function currentSurgeMultiplier() {
  const hour = new Date().getHours();
  const isPeak = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
  return isPeak ? 1.3 : 1.0;
}

function fareFor(vehicleType, distanceKm, durationMin, surge) {
  const card = RATE_CARD[vehicleType];
  if (!card) throw new Error(`Unknown vehicle type: ${vehicleType}`);
  const raw = card.base + distanceKm * card.perKm + durationMin * card.perMin;
  return Math.round(raw * surge);
}

function estimateAllFares(pickup, drop) {
  const { distanceKm, durationMin } = estimateRoute(pickup, drop);
  const surge = currentSurgeMultiplier();

  return Object.keys(RATE_CARD).map((vehicleType) => ({
    vehicleType,
    distanceKm,
    durationMin,
    surge,
    fare: fareFor(vehicleType, distanceKm, durationMin, surge),
  }));
}

module.exports = { RATE_CARD, estimateRoute, currentSurgeMultiplier, fareFor, estimateAllFares };
