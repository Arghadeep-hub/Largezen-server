const mongoose = require("mongoose");

const validateUserId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The id is not valid or found");
  return true
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const userId = user.id;
  return res.status(statusCode).json({ id: userId, token });
};

module.exports = { validateUserId, sendToken };
