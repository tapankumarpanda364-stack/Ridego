const { getPool, sql } = require("../config/db");

// Finds the closest online, verified driver for the requested vehicle type.
// Falls back to "any online driver" if lat/lng aren't available yet, so the
// booking flow still works before GPS is wired up on the driver app.
async function findNearestDriver(vehicleType, pickupLat, pickupLng) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("vehicleType", sql.VarChar, vehicleType)
    .query(
      `SELECT d.id AS driverId, d.user_id, d.rating, d.current_lat, d.current_lng,
              u.name, v.model AS vehicleModel, v.plate_number
       FROM dbo.Drivers d
       JOIN dbo.Users u ON u.id = d.user_id
       JOIN dbo.Vehicles v ON v.driver_id = d.id
       WHERE d.status = 'online' AND v.type = @vehicleType AND v.verified = 1`
    );

  const candidates = result.recordset;
  if (candidates.length === 0) return null;

  if (pickupLat == null || pickupLng == null) {
    return candidates[0];
  }

  const withDistance = candidates
    .filter((c) => c.current_lat != null && c.current_lng != null)
    .map((c) => ({ ...c, distance: haversineKm(pickupLat, pickupLng, c.current_lat, c.current_lng) }));

  if (withDistance.length === 0) return candidates[0];

  withDistance.sort((a, b) => a.distance - b.distance);
  return withDistance[0];
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

module.exports = { findNearestDriver, haversineKm };
