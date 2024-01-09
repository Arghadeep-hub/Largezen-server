const mongoose = require("mongoose");

const validateUserId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The id is not valid or found");
  return true
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  return res.status(statusCode).json({ token });
};

module.exports = { validateUserId, sendToken };
