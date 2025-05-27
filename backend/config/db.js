const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connect successfully");
  } catch (error) {
    console.error("error while connecting the database", error.message);
    process.exit(1);
  }
};
module.exports = {
  pool,
  connectDB,
};
