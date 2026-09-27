const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");

// Looks up the Drivers.id row for the logged-in user (req.user.id is a
// Users.id — every driver-scoped query needs the Drivers.id instead).
async function getDriverRow(pool, userId) {
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query("SELECT id, status, rating, trips_completed FROM dbo.Drivers WHERE user_id = @userId");
  return result.recordset[0];
}

// PATCH /driver/status  { status: "online" | "offline" }
const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["online", "offline"].includes(status)) {
    res.status(400);
    throw new Error('Status must be "online" or "offline"');
  }

  const pool = await getPool();
  const driver = await getDriverRow(pool, req.user.id);
  if (!driver) {
    res.status(404);
    throw new Error("Driver profile not found for this account");
  }

  await pool
    .request()
    .input("id", sql.Int, driver.id)
    .input("status", sql.VarChar, status)
    .query("UPDATE dbo.Drivers SET status = @status WHERE id = @id");

  res.json({ status });
});

// GET /driver/requests — rides matched to this driver, awaiting acceptance
const getRequests = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const driver = await getDriverRow(pool, req.user.id);
  if (!driver) {
    res.status(404);
    throw new Error("Driver profile not found for this account");
  }

  const result = await pool
    .request()
    .input("driverId", sql.Int, driver.id)
    .query(
      `SELECT id, pickup, drop_location AS drop_, distance_km AS distanceKm, fare
       FROM dbo.Rides
       WHERE driver_id = @driverId AND status = 'requested'
       ORDER BY created_at ASC`
    );

  const requests = result.recordset.map((r) => ({
    id: r.id,
    pickup: r.pickup,
    drop: r.drop_,
    distanceKm: r.distanceKm,
    fare: r.fare,
  }));

  res.json({ requests });
});

// PATCH /driver/rides/:rideId/accept
const acceptRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const pool = await getPool();
  const driver = await getDriverRow(pool, req.user.id);

  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("driverId", sql.Int, driver.id)
    .query(
      `UPDATE dbo.Rides SET status = 'ongoing'
       WHERE id = @rideId AND driver_id = @driverId AND status = 'requested';
       SELECT * FROM dbo.Rides WHERE id = @rideId;`
    );

  const ride = result.recordset[0];
  if (!ride || ride.status !== "ongoing") {
    res.status(409);
    throw new Error("This ride is no longer available to accept");
  }

  res.json({ ride });
});

// PATCH /driver/rides/:rideId/complete
const completeRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const pool = await getPool();
  const driver = await getDriverRow(pool, req.user.id);

  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("driverId", sql.Int, driver.id)
    .query(
      `UPDATE dbo.Rides SET status = 'completed', completed_at = SYSUTCDATETIME()
       WHERE id = @rideId AND driver_id = @driverId AND status = 'ongoing';
       SELECT * FROM dbo.Rides WHERE id = @rideId;`
    );

  const ride = result.recordset[0];
  if (!ride || ride.status !== "completed") {
    res.status(409);
    throw new Error("This ride can't be completed from its current state");
  }

  await pool
    .request()
    .input("driverId", sql.Int, driver.id)
    .query("UPDATE dbo.Drivers SET trips_completed = trips_completed + 1 WHERE id = @driverId");

  await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("amount", sql.Decimal(8, 2), ride.fare)
    .query(
      `INSERT INTO dbo.Payments (ride_id, amount, method, status)
       VALUES (@rideId, @amount, 'cash', 'paid')`
    );

  res.json({ ride });
});

// GET /driver/earnings?range=today|week|month
const getEarnings = asyncHandler(async (req, res) => {
  const range = ["today", "week", "month"].includes(req.query.range) ? req.query.range : "week";
  const daysBack = { today: 1, week: 7, month: 30 }[range];

  const pool = await getPool();
  const driver = await getDriverRow(pool, req.user.id);

  const result = await pool
    .request()
    .input("driverId", sql.Int, driver.id)
    .input("daysBack", sql.Int, daysBack)
    .query(
      `SELECT CONVERT(varchar, completed_at, 23) AS label, SUM(fare) AS amount
       FROM dbo.Rides
       WHERE driver_id = @driverId AND status = 'completed'
             AND completed_at >= DATEADD(day, -@daysBack, SYSUTCDATETIME())
       GROUP BY CONVERT(varchar, completed_at, 23)
       ORDER BY label DESC`
    );

  const breakdown = result.recordset;
  const total = breakdown.reduce((sum, d) => sum + Number(d.amount), 0);

  res.json({
    range,
    total,
    tripsCompleted: breakdown.length,
    breakdown,
  });
});

// GET /admin/drivers
const listDrivers = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(
    `SELECT d.id, u.name, d.rating, d.trips_completed AS tripsCompleted, d.status,
            v.model AS vehicleModel
     FROM dbo.Drivers d
     JOIN dbo.Users u ON u.id = d.user_id
     LEFT JOIN dbo.Vehicles v ON v.driver_id = d.id
     ORDER BY d.id DESC`
  );
  res.json({ drivers: result.recordset });
});

module.exports = { setStatus, getRequests, acceptRide, completeRide, getEarnings, listDrivers };
