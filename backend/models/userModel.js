const { pool } = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users where email=$1", [
    email,
  ]);
  return result.rows[0];
};
const createUser = async (username, email, hashPassword) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
    [username, email, hashPassword]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
};
