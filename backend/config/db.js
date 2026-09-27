const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

async function getPool() {
  if (pool && pool.connected) return pool;

  pool = await sql.connect(config);
  return pool;
}

async function connectDB() {
  await getPool();
  console.log(`Connected to SQL Server database "${config.database}"`);
}

module.exports = { sql, getPool, connectDB };
