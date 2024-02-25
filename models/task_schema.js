const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    deadLine: {
      type: Date,
      require: true,
      default: Date.now(),
    },
    status: {
      type: Number,
      enum: [1, 2], // Pending, Done
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
