const crypto = require("crypto");
const mongoose = require("mongoose");

const validateUserId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The id is not valid or found");
  return true;
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const id = user.id;
  const role = user.role;
  const name = `${user.first_name} ${user.last_name}`;
  return res.status(statusCode).json({ id, name, role, token });
};

function referralCodeGen(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomFillSync(Buffer.alloc(length));
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

module.exports = { validateUserId, sendToken, referralCodeGen };
