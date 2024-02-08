const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
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
      require: true,
    },
    meeting_status: {
      type: Number,
      require: true,
    },
    meeting_date: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
