// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// const
const SALTLEN = 8;
// const EXPIRE = 60 * 30; // 30 min
const EXPIRE = 60 * 60 * 24 * 30; // 1 month

const customerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, require: true },
    phoneNum: String,
    profilePic: Buffer,
    email: { type: String, required: true },
    points: { type: Number, default: 10 },
    lastLogin: Date,
    online: { type: Boolean, default: false }, // true: new token is needed as (old token expired) or (old token not expired but user logged out)
    activated: { type: Boolean, default: false },
    fav: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants",
      },
    ],
  },
  { timestamps: true }
);

// listen save action and hash the password before saving
customerSchema.pre("save", async function (next) {
  console.log("save action detected, check changes");
  const customer = this;

  // console.log('orig pw: ', customer.password);

  if (customer.isModified("password")) {
    console.log("password changed, hash before saving");
    customer.password = await bcrypt.hash(customer.password, SALTLEN);
  }
  next();
});

// instance method for generating jwt token
customerSchema.methods.genAuthToken = async function () {
  console.log("> generating auth token");
  let customer = this;
  let token = jwt.sign(
    { _id: customer._id.toString(), usertype: "customer" },
    process.env.SECRET,
    { expiresIn: EXPIRE }
  );
  console.log("> generated token");
  return token;
};

const Customers = mongoose.model("Customers", customerSchema);
module.exports = Customers;
