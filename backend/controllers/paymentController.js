const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");

// GET /payments/:rideId
const getPaymentForRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const pool = await getPool();

  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .query("SELECT * FROM dbo.Payments WHERE ride_id = @rideId");

  const payment = result.recordset[0];
  if (!payment) {
    res.status(404);
    throw new Error("No payment recorded for this ride yet");
  }

  res.json({ payment });
});

// PATCH /payments/:rideId  { method }
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { method } = req.body;
  const allowed = ["cash", "card", "upi", "wallet"];

  if (!allowed.includes(method)) {
    res.status(400);
    throw new Error(`method must be one of: ${allowed.join(", ")}`);
  }

  const pool = await getPool();
  const result = await pool
    .request()
    .input("rideId", sql.Int, rideId)
    .input("method", sql.VarChar, method)
    .query(
      `UPDATE dbo.Payments SET method = @method WHERE ride_id = @rideId;
       SELECT * FROM dbo.Payments WHERE ride_id = @rideId;`
    );

  const payment = result.recordset[0];
  if (!payment) {
    res.status(404);
    throw new Error("No payment recorded for this ride yet");
  }

  res.json({ payment });
});

module.exports = { getPaymentForRide, updatePaymentMethod };
