const mongoose = require("mongoose");

const validateUserId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The id is not valid or found");
  return true
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const id = user.id;
  const role = user.role;
  const name = `${user.first_name} ${user.last_name}`;
  return res.status(statusCode).json({ id, name, role, token });
};

module.exports = { validateUserId, sendToken };
