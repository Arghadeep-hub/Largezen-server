const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { referralCodeGen } = require("../utils");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      enum: [1, 2],
      default: 2,
      required: true,
    },
    referral: {
      type: String,
      require: false,
      unique: true,
      minlength: 6,
    },
    subUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAccountVerified: Boolean,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Get Signed JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY);
};

//Password reset/forget
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; //15 minutes
  return resetToken;
};

// Referral Code generator
userSchema.pre("save", function (next) {
  if (this.role === 1 && !this.referral) {
    this.referral = referralCodeGen(6);
  }
  if (this.role === 2) {
    this.referral = "";
  }

  next();
});

// Creating Collection
const User = mongoose.model("User", userSchema);

module.exports = User;
