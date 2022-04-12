const express = require("express");
const { login } = require("../controllers/admin");
const { verifyToken } = require("../controllers/token");
const custCtrler = require("../controllers/customer");
const restCtrler = require("../controllers/restaurant");
const Customers = require("../models/customer");
const { Otp } = require("../models/otp");
const Restaurants = require("../models/restaurant");
const { approvalEmail, rejectEmail } = require("../controllers/email");
const orderCtrler = require("../controllers/order");

const app = express.Router();

app.post("/signin", login);

// customers
app.get("/customer/all", verifyToken, custCtrler.getAllCustomerData);
app.post("/customer/resetPw", verifyToken, custCtrler.resetPw);

// restaurants
app.post(
  "/restaurant/approve",
  verifyToken,
  restCtrler.approveAccount,
  approvalEmail
);
app.post(
  "/restaurant/reject",
  verifyToken,
  restCtrler.rejectAccount,
  rejectEmail
);
app.get("/restaurant/all", verifyToken, restCtrler.getAllRestaurantData);
app.post("/restaurant/resetPw", verifyToken, restCtrler.resetPw);

//order
app.get("/order/all", verifyToken, orderCtrler.getAllOrderData);

// dev only
// to clear all customer account with 'test@test.com' for easy development, should be removed at final version
app.delete("/customers", async (req, res) => {
  console.log("> dummmy customers cleared");
  await Customers.deleteMany({ email: "test@test.com" });
  res.send("cleared");
});
// to clear all restaurants account with 'test@test.com' for easy development, should be removed at final version
app.delete("/restaurants", async (req, res) => {
  console.log("> dummmy restaurants cleared");
  await Restaurants.deleteMany({ email: "test@test.com" });
  res.send("cleared");
});
// to clear all otp account for easy development, should be removed at final version
app.delete("/otps", async (req, res) => {
  console.log("> dummmy otp cleared");
  await Otp.deleteMany();
  res.send("cleared");
});

// unrouted requests
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", message: "Request in /admin not found" });
});

module.exports = app;
