const express = require("express");
const { verifyToken } = require("../controllers/token");
const restCtrler = require("../controllers/restaurant");

const app = express.Router();

// account management
app.post(
  "/signup",
  restCtrler.uploadProfilePic,
  restCtrler.addRestaurant,
  restCtrler.setProfilePic,
  (req, res) => {
    // wait for admin approve register request
    res.send({
      name: "RegistrationReceived",
      value: "registration received, wait for admin approval",
    });
  }
);
app.post("/approve", restCtrler.approveAccount);
app.post("/signin", restCtrler.login);
app.post("/changePw", verifyToken, restCtrler.changePw);

// actions
app.get("/data", verifyToken, restCtrler.getRestaurantData);
app.get("/all", verifyToken, restCtrler.getAllRestaurantData);
app.get("/notApproved", restCtrler.getNotApprovedRestaurant);
app.get("/approved", restCtrler.getApprovedRestaurant);
app.post("/logout", verifyToken, restCtrler.logout);
app.post(
  "/profilePic",
  verifyToken,
  restCtrler.uploadProfilePic,
  restCtrler.setProfilePic
); // set profile pic
app.get("/profilePic", verifyToken, restCtrler.getProfilePic); // get profile pic
app.post(
  "/food",
  verifyToken,
  restCtrler.uploadFoodItemPic,
  restCtrler.addFoodItem
);
app.delete("/food", verifyToken, restCtrler.removeFoodItem);

// unrouted requests
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", value: "Request in /restaurant not found" });
});

module.exports = app;
