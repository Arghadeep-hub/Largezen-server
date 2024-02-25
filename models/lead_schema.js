const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      unique: true,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    requirement: {
      type: String,
      require: true,
    },
    lead_status: {
      type: Number,
      default: 0,
      require: true,
    },
    meeting_status: {
      type: Number,
      default: 0,
      require: true,
    },
    meeting_date: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
