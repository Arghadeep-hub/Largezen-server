const Task = require("../models/task_schema");
const { validateUserId } = require("../utils");
const expressAsyncHandler = require("express-async-handler");

const getAllTask = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  let task;
  try {
    if (user.role === 1) {
      task = await Task.find({ admin: user._id }).select("-createdAt").exec();
      return res.status(200).json(task);
    }
    if (user.role === 2) {
      task = await Task.find({ assingedTo: user._id })
        .select("-createdAt")
        .exec();
      return res.status(200).json(task);
    }
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

const addTask = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const body = req.body;
  let payload = {};

  if (user.role === 1) {
    body?.assignedTo && validateUserId(body.assignedTo);
    payload = {
      ...body,
      admin: user._id,
      createdBy: user._id,
      assignedTo: body?.assignedTo || user._id,
    };
  }

  if (user.role === 2) {
    payload = {
      ...body,
      admin: user.subUser[0],
      assignedTo: user._id,
      createdBy: user._id,
    };
  }
  try {
    const task = await Task.create(payload);
    return res.status(201).json(task);
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});

const getTaskById = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;

  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("Task is not found");

  try {
    const task = await Task.findById(id);
    return res.status(200).json(task);
  } catch (error) {
    throw new Error(error, { cause: 400 });
  }
});



module.exports = {
  getAllTask,
  addTask,
  getTaskById,
};
