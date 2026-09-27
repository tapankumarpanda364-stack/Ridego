const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");

// POST /vehicles — a driver registers their vehicle
const registerVehicle = asyncHandler(async (req, res) => {
  const { plateNumber, model, type } = req.body;
  const allowedTypes = ["Bike", "Auto", "Sedan", "SUV"];

  if (!plateNumber || !model || !allowedTypes.includes(type)) {
    res.status(400);
    throw new Error("plateNumber, model and a valid type are required");
  }

  const pool = await getPool();
  const driverRow = await pool
    .request()
    .input("userId", sql.Int, req.user.id)
    .query("SELECT id FROM dbo.Drivers WHERE user_id = @userId");

  const driver = driverRow.recordset[0];
  if (!driver) {
    res.status(404);
    throw new Error("Driver profile not found for this account");
  }

  const inserted = await pool
    .request()
    .input("driverId", sql.Int, driver.id)
    .input("plateNumber", sql.NVarChar, plateNumber)
    .input("model", sql.NVarChar, model)
    .input("type", sql.VarChar, type)
    .query(
      `INSERT INTO dbo.Vehicles (driver_id, plate_number, model, type)
       OUTPUT INSERTED.*
       VALUES (@driverId, @plateNumber, @model, @type)`
    );

  res.status(201).json({ vehicle: inserted.recordset[0] });
});

// PATCH /vehicles/:vehicleId/verify — admin only
const verifyVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, vehicleId)
    .query(
      `UPDATE dbo.Vehicles SET verified = 1 WHERE id = @id;
       SELECT * FROM dbo.Vehicles WHERE id = @id;`
    );

  const vehicle = result.recordset[0];
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  res.json({ vehicle });
});

// GET /admin/vehicles
const listVehicles = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(
    `SELECT v.id, v.plate_number AS plateNumber, v.model, v.type, v.verified,
            u.name AS driverName
     FROM dbo.Vehicles v
     JOIN dbo.Drivers d ON d.id = v.driver_id
     JOIN dbo.Users u ON u.id = d.user_id
     ORDER BY v.id DESC`
  );
  res.json({ vehicles: result.recordset });
});

module.exports = { registerVehicle, verifyVehicle, listVehicles };
