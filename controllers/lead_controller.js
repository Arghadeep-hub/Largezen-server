const Lead = require("../models/lead_schema");
const { validateUserId } = require("../utils");
const expressAsyncHandler = require("express-async-handler");

const allLeads = expressAsyncHandler(async (req, res) => {
  const lead = await Lead.find({}).select("-createdAt").exec();
  return res.status(200).json(lead);
});

const addLead = expressAsyncHandler(async (req, res) => {
  const body = req.body;
  validateUserId(body.user_id);

  try {
    const lead = await Lead.create({ ...body });
    return res.status(201).json(lead);
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

const getLeadById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateUserId(id);

  try {
    const lead = await Lead.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    return res.status(200).json(lead);
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

const updateLeadById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  validateUserId(id);

  try {
    await Lead.findByIdAndUpdate(id, body);
    return res
      .status(200)
      .json({ id, ...body, message: "updated successfully" });
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

module.exports = {
  allLeads,
  addLead,
  getLeadById,
  updateLeadById,
};
