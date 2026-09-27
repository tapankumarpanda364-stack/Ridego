const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { getPool, sql } = require("../config/db");
const { signToken } = require("../utils/jwt");

function sanitizeUser(user) {
    const { PasswordHash, ...safe } = user;
    return safe;
}

// POST /auth/register
const register = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        phone,
        password,
        role
    } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
        res.status(400);
        throw new Error(
            "Name, email, phone and password are all required"
        );
    }

    // Frontend role -> Database role
    let finalRole = "Customer";

    if (role === "driver") {
        finalRole = "Driver";
    }

    const pool = await getPool();

    // Check existing user
    const existing = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`
            SELECT UserId
            FROM Users
            WHERE Email = @email
        `);

    if (existing.recordset.length > 0) {
        res.status(409);
        throw new Error(
            "An account with this email already exists"
        );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const inserted = await pool
        .request()
        .input("fullName", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .input("phone", sql.VarChar, phone)
        .input("passwordHash", sql.VarChar, passwordHash)
        .input("role", sql.VarChar, finalRole)
        .query(`
            INSERT INTO Users
            (
                FullName,
                Email,
                Phone,
                PasswordHash,
                Role
            )
            OUTPUT
                INSERTED.UserId,
                INSERTED.FullName,
                INSERTED.Email,
                INSERTED.Phone,
                INSERTED.Role,
                INSERTED.CreatedAt
            VALUES
            (
                @fullName,
                @email,
                @phone,
                @passwordHash,
                @role
            )
        `);

    const user = inserted.recordset[0];

    // Generate JWT
    const token = signToken({
        id: user.UserId,
        role: user.Role
    });

    res.status(201).json({
        message: "Registration successful",
        token,
        user
    });
});


// POST /auth/login
const login = asyncHandler(async (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error(
            "Email and password are required"
        );
    }

    const pool = await getPool();

    // Find user
    const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`
            SELECT
                UserId,
                FullName,
                Email,
                Phone,
                PasswordHash,
                Role,
                CreatedAt
            FROM Users
            WHERE Email = @email
        `);

    const user = result.recordset[0];

    // User doesn't exist
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
        password,
        user.PasswordHash
    );

    if (!passwordMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // Remove password before sending response
    const safeUser = sanitizeUser(user);

    // Generate JWT
    const token = signToken({
        id: user.UserId,
        role: user.Role
    });

    res.json({
        message: "Login successful",
        token,
        user: safeUser
    });
});


// GET /auth/me
const me = asyncHandler(async (req, res) => {

    res.json({
        user: req.user
    });

});


module.exports = {
    register,
    login,
    me
};
