// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// const
const SALTLEN = 8;
const MAX_TRIAL = 3;

// schema
const OtpSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    otp: String,
    wrongTrial: { type: Number, default: 0 },
    expiresAt: Date,
  },
  { timestamps: true }
);

// listen save action and hash the password before saving
OtpSchema.pre("save", async function (next) {
  console.log("save action detected, check changes");
  const otp = this;

  if (otp.isModified("otp")) {
    console.log("otp changed, hash before saving");
    otp.otp = await bcrypt.hash(otp.otp, SALTLEN);
  }
  next();
});

const Otp = mongoose.model("Otp", OtpSchema);
module.exports = {
  Otp,
  MAX_TRIAL,
};
