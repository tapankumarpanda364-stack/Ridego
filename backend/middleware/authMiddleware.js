const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../utils/jwt");
const { getPool, sql } = require("../config/db");

// Verifies the Bearer token and attaches { id, role } to req.user.
// Does one lightweight DB check so a deleted/suspended account is rejected
// even if its token hasn't expired yet.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }

  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, decoded.id)
    .query(
      "SELECT id, name, email, phone, role, status FROM dbo.Users WHERE id = @id"
    );

  const user = result.recordset[0];

  if (!user || user.status !== "active") {
    res.status(401);
    throw new Error("Not authorized — account not found or inactive");
  }

  req.user = user;
  next();
});

module.exports = { protect };
