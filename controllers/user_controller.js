const User = require("../models/user_schema");
const expressAsyncHandler = require("express-async-handler");
const { sendToken, validateUserId } = require("../utils");

const allUser = expressAsyncHandler(async (req, res) => {
  const user = await User.find({}).select("-password").exec();
  return res.status(200).json(Object.values(user));
});

const addUserSignup = expressAsyncHandler(async (req, res) => {
  const body = req.body;

  // Check if use Exist
  const userExists = await User.findOne({ email: body.email });
  if (userExists) throw new Error("User already exists", { cause: 400 });

  try {
    const user = await User.create({ ...body });
    sendToken(user, 201, res);
  } catch (error) {
    throw new Error(error);
  }
});

const userSignin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exist
  const userFound = await User.findOne({ email: email });
  if (!userFound)
    return res.status(400).json({ error: "You have to Sign-up first" });

  // check if password matched
  if (userFound && (await userFound.isPasswordMatched(password))) {
    sendToken(userFound, 200, res);
  } else {
    throw new Error("Invalid Password", { cause: 400 });
  }
});

const getUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    return res.status(200).json(user);
  } catch (error) {
    throw new Error("No user found");
  }
});

const updateUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  validateUserId(id);
  try {
    await User.findByIdAndUpdate(id, body);
    return res
      .status(200)
      .json({ id, ...body, message: "updated Successfully" });
  } catch (error) {
    throw new Error("Runtime Error Occure", { cause: 400 });
  }
});

module.exports = {
  allUser,
  addUserSignup,
  userSignin,
  getUserById,
  updateUserById,
};
