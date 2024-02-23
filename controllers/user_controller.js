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
  const email = await User.findOne({ email: body.email });
  const phone = await User.findOne({ phone: body.phone });
  if (email)
    throw new Error("User email address already exists", { cause: 400 });
  if (phone)
    throw new Error("User phone number already exists", { cause: 400 });

  try {
    if (body.role !== 1 && !body?.referral)
      throw new Error("Give your admin Referral");

    if (body.role === 1) {
      const user = await User.create({ ...body }); // user creation
      sendToken(user, 201, res);
    } else {
      const user = await User.findOne({ referral: body.referral }); // find user by referral code

      const createUser = await User.create({
        ...body,
        subUser: user._id,
      }); // create new user

      await User.findByIdAndUpdate(user._id, {
        subUser: user.subUser.concat(createUser.id),
      }); // updating sub user id

      sendToken(createUser, 201, res);
    }
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
    throw new Error(error, { cause: 400 });
  }
});

// Deleting as per user role 
const deleteUserById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;

  validateUserId(id);
  try {
    const user = await User.findById(id);
    if (user.role === 1) {
      const subUserIds = user.subUser; // Assuming user.subUser is an array of ObjectIDs

      // Delete all sub users
      await User.deleteMany({ _id: { $in: subUserIds } });
    
      // Delete the admin user
      await User.findByIdAndDelete(id);
    }

    if (user.role === 2) {
      const parentId = user.subUser[0];

      await User.findOneAndUpdate(
        { _id: parentId }, // Query to find the document
        { $pull: { subUser: id } }, // Operation to pull the userIdToRemove from subUser array
        { new: true } //  To return modified document
      );

      await User.findByIdAndDelete(id); //  Delete User from the collection
    }
    return res.status(202).json({
      first_name: user.first_name,
      last_name: user.last_name,
      message: "Deleted successfully",
    });
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

module.exports = {
  allUser,
  addUserSignup,
  userSignin,
  getUserById,
  updateUserById,
  deleteUserById,
};
