const express = require("express");
const { verifyToken } = require("../controllers/token");
const NotificationController = require("../controllers/notification");

const app = express.Router();

app.post("/globeNoti", verifyToken, NotificationController.globalNoti);
app.post("/targetedNoti", verifyToken, NotificationController.targetedNoti);
app.get("/all", NotificationController.fetchAll);
app.get(
  "/fetchIndividual",
  verifyToken,
  NotificationController.fetchIndividual
);
app.post("/dismiss/:id", NotificationController.dismissNotification);
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", value: "Request in /notification not found" });
});

module.exports = app;
