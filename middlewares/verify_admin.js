const jwt = require("jsonwebtoken");
const User = require("../models/user_schema");
const expressAsyncHandler = require("express-async-handler");

const adminMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];

  if (!token) throw new Error("There is no token attached to the header");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Find the user by id
    const user = await User.findById(decoded.id);

    if (user.role !== 1) {
      throw new Error("Admin can able to access only.");
    }

    req.user = user;
    // Attached the user to the request Object
    next();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = adminMiddleware;
