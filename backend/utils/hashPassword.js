const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const comparePassword = async (plainPassword, bcryptpassword) => {
  return await bcrypt.compare(plainPassword, bcryptpassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
