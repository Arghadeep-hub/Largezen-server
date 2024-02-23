const router = require("express").Router();
const userMiddleware = require("../middlewares/verify_user");
const adminMiddleware = require("../middlewares/verify_admin");
const {
  allLeads,
  addLead,
  getLeadByUserId,
  updateLeadById,
  deleteLeadById,
} = require("../controllers/lead_controller");

router.route("/").get(adminMiddleware, allLeads).post(userMiddleware, addLead);
router
  .route("/:id")
  .get(userMiddleware, getLeadByUserId)
  .patch(userMiddleware, updateLeadById)
  .delete(userMiddleware, deleteLeadById);

module.exports = router;
