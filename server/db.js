// server/db.js
const { Pool } = require("pg");

// FORCE the correct public DB URL
const connectionString =
  "postgresql://postgres:KbbEgwuUvmqlDNukBlUXDgXuiCANmNZQ@tramway.proxy.rlwy.net:21505/railway";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
