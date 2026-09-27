const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");
const { estimateAllFares, estimateRoute, currentSurgeMultiplier, fareFor } = require("../services/fareService");
const { findNearestDriver } = require("../services/driverService");

// POST /rides/estimate  { pickup, drop }
const estimateFare = asyncHandler(async (req, res) => {
  const { pickup, drop } = req.body;
  if (!pickup || !drop) {
    res.status(400);
    throw new Error("pickup and drop are required");
  }
  const estimates = estimateAllFares(pickup, drop);
  res.json({ estimates });
});

// POST /rides  { pickup, drop, vehicleType, pickupLat?, pickupLng? }
const bookRide = asyncHandler(async (req, res) => {
  const { pickup, drop, vehicleType, pickupLat, pickupLng } = req.body;
  if (!pickup || !drop || !vehicleType) {
    res.status(400);
    throw new Error("pickup, drop and vehicleType are required");
  }

  const { distanceKm, durationMin } = estimateRoute(pickup, drop);
  const surge = currentSurgeMultiplier();
  const fare = fareFor(vehicleType, distanceKm, durationMin, surge);

  const matchedDriver = await findNearestDriver(vehicleType, pickupLat, pickupLng);

  const pool = await getPool();
  const inserted = await pool
    .request()
    .input("riderId", sql.Int, req.user.id)
    .input("driverId", sql.Int, matchedDriver ? matchedDriver.driverId : null)
    .input("pickup", sql.NVarChar, pickup)
    .input("drop", sql.NVarChar, drop)
    .input("vehicleType", sql.VarChar, vehicleType)
    .input("distanceKm", sql.Decimal(6, 2), distanceKm)
    .input("durationMin", sql.Int, durationMin)
    .input("surge", sql.Decimal(3, 1), surge)
    .input("fare", sql.Decimal(8, 2), fare)
    .query(
      `INSERT INTO dbo.Rides
         (rider_id, driver_id, pickup, drop_location, vehicle_type, distance_km, duration_min, surge, fare, status)
       OUTPUT INSERTED.*
       VALUES (@riderId, @driverId, @pickup, @drop, @vehicleType, @distanceKm, @durationMin, @surge, @fare,
               CASE WHEN @driverId IS NULL THEN 'requested' ELSE 'requested' END)`
    );

  const ride = inserted.recordset[0];

  if (!matchedDriver) {
    res.status(202); // accepted, but no driver online yet
  } else {
    res.status(201);
  }

  res.json({
    ride: {
      id: ride.id,
      pickup: ride.pickup,
      drop: ride.drop_location,
      vehicleType: ride.vehicle_type,
      fare: ride.fare,
      status: ride.status,
      driverMatched: Boolean(matchedDriver),
    },
  });
});

// GET /rides/:rideId
const getRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const pool = await getPool();

  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .query(
      `SELECT r.*, du.name AS driverName, d.rating AS driverRating,
              v.model AS vehicleModel, v.plate_number AS plateNumber
       FROM dbo.Rides r
       LEFT JOIN dbo.Drivers d ON d.id = r.driver_id
       LEFT JOIN dbo.Users du ON du.id = d.user_id
       LEFT JOIN dbo.Vehicles v ON v.driver_id = d.id
       WHERE r.id = @rideId`
    );

  const row = result.recordset[0];
  if (!row) {
    res.status(404);
    throw new Error("Ride not found");
  }

  // Riders can only view their own rides; drivers only rides assigned to them.
  const isOwner = req.user.role === "rider" && row.rider_id === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin && req.user.role !== "driver") {
    res.status(403);
    throw new Error("Not authorized to view this ride");
  }

  res.json({
    ride: {
      id: row.id,
      pickup: row.pickup,
      drop: row.drop_location,
      fare: row.fare,
      status: row.status,
      driver: row.driverName
        ? {
            name: row.driverName,
            rating: row.driverRating,
            vehicleModel: row.vehicleModel,
            plateNumber: row.plateNumber,
          }
        : null,
    },
  });
});

// GET /rides/history — the logged-in rider's past rides
const getHistory = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("riderId", sql.Int, req.user.id)
    .query(
      `SELECT id, pickup, drop_location AS drop_, fare, status,
              CONVERT(varchar, created_at, 23) AS date
       FROM dbo.Rides
       WHERE rider_id = @riderId
       ORDER BY created_at DESC`
    );

  const rides = result.recordset.map((r) => ({
    id: r.id,
    pickup: r.pickup,
    drop: r.drop_,
    fare: r.fare,
    status: r.status,
    date: r.date,
  }));

  res.json({ rides });
});

// PATCH /rides/:rideId/cancel
const cancelRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const pool = await getPool();

  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("riderId", sql.Int, req.user.id)
    .query(
      `UPDATE dbo.Rides SET status = 'cancelled'
       WHERE id = @rideId AND rider_id = @riderId AND status IN ('requested', 'ongoing');
       SELECT * FROM dbo.Rides WHERE id = @rideId;`
    );

  const ride = result.recordset[0];
  if (!ride || ride.status !== "cancelled") {
    res.status(409);
    throw new Error("This ride can't be cancelled from its current state");
  }

  res.json({ ride: { id: ride.id, status: ride.status } });
});

// GET /admin/rides
const listRides = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(
    `SELECT r.id, r.pickup, r.drop_location AS drop_, r.fare, r.status,
            ru.name AS riderName, du.name AS driverName
     FROM dbo.Rides r
     JOIN dbo.Users ru ON ru.id = r.rider_id
     LEFT JOIN dbo.Drivers d ON d.id = r.driver_id
     LEFT JOIN dbo.Users du ON du.id = d.user_id
     ORDER BY r.created_at DESC`
  );

  const rides = result.recordset.map((r) => ({
    id: r.id,
    pickup: r.pickup,
    drop: r.drop_,
    fare: r.fare,
    status: r.status,
    riderName: r.riderName,
    driverName: r.driverName,
  }));

  res.json({ rides });
});

module.exports = { estimateFare, bookRide, getRide, getHistory, cancelRide, listRides };
