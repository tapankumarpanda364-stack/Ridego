const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");

// POST /ratings  { rideId, rating, comment? } — rider rates the driver
// after a completed ride.
const rateRide = asyncHandler(async (req, res) => {
  const { rideId, rating, comment } = req.body;

  if (!rideId || !rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("rideId and a rating between 1 and 5 are required");
  }

  const pool = await getPool();

  const rideResult = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("riderId", sql.Int, req.user.id)
    .query(
      `SELECT id, driver_id FROM dbo.Rides
       WHERE id = @rideId AND rider_id = @riderId AND status = 'completed'`
    );

  const ride = rideResult.recordset[0];
  if (!ride) {
    res.status(404);
    throw new Error("Completed ride not found for this account");
  }

  const inserted = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("riderId", sql.Int, req.user.id)
    .input("driverId", sql.Int, ride.driver_id)
    .input("rating", sql.Decimal(2, 1), rating)
    .input("comment", sql.NVarChar, comment || null)
    .query(
      `INSERT INTO dbo.Ratings (ride_id, rider_id, driver_id, rating, comment)
       OUTPUT INSERTED.*
       VALUES (@rideId, @riderId, @driverId, @rating, @comment)`
    );

  // Roll the new rating into the driver's running average.
  await pool
    .request()
    .input("driverId", sql.Int, ride.driver_id)
    .query(
      `UPDATE dbo.Drivers
       SET rating = (SELECT AVG(rating) FROM dbo.Ratings WHERE driver_id = @driverId)
       WHERE id = @driverId`
    );

  res.status(201).json({ rating: inserted.recordset[0] });
});

module.exports = { rateRide };
