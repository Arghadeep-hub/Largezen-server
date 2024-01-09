const router = require("express").Router();
const {
  allUser,
  addUserSignup,
  userSignin,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/user_controller");
const userMiddleware = require("../middlewares/verify_user");

router.route("/").get(allUser);
router.route("/auth").get(userSignin).post(addUserSignup);

router
  .route("/:id")
  .get(userMiddleware, getUserById)
  .patch(userMiddleware, updateUserById)
  .delete(userMiddleware, deleteUserById);

module.exports = router;
