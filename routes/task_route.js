const router = require("express").Router();
const userMiddleware = require("../middlewares/verify_user");
const adminMiddleware = require("../middlewares/verify_admin");
const {
  getAllTask,
  addTask,
  getTaskById,
} = require("../controllers/task_controller");

router
  .route("/")
  .get(userMiddleware, getAllTask)
  .post(userMiddleware, addTask);

router.route("/:id").get(userMiddleware, getTaskById);

module.exports = router;
