const { Pool } = require("pg");
const connectionString =
  process.env.CONNECTIONSTRING || "postgres://localhost:5432/vinyl-shop";
const pool = new Pool({ connectionString });

module.exports = { pool };
