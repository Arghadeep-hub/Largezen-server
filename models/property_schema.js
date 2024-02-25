const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    admin: {
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
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
