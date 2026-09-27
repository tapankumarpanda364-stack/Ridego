const asyncHandler = require("express-async-handler");
const { getPool, sql } = require("../config/db");

// GET /users/profile — the logged-in user's own profile (alias of /auth/me,
// kept here for REST-ful symmetry with the rest of this resource).
const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// PATCH /users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", sql.Int, req.user.id)
    .input("name", sql.NVarChar, name ?? req.user.name)
    .input("phone", sql.NVarChar, phone ?? req.user.phone)
    .query(
      `UPDATE dbo.Users SET name = @name, phone = @phone WHERE id = @id;
       SELECT id, name, email, phone, role, status, created_at FROM dbo.Users WHERE id = @id;`
    );

  res.json({ user: result.recordset[0] });
});

// GET /admin/users — admin only
const listUsers = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const result = await pool.request().query(
    `SELECT id, name, email, phone, role, status,
            CONVERT(varchar, created_at, 23) AS joinedAt
     FROM dbo.Users
     ORDER BY created_at DESC`
  );
  res.json({ users: result.recordset });
});

module.exports = { getProfile, updateProfile, listUsers };
