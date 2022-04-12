// packages
const mongoose = require("mongoose");
const { bool } = require("sharp");
const Schema = mongoose.Schema;

// schema
const notificationSchema = new Schema(
  {
    reciever: String,
    sender: String,
    message: String,
    dismissed: Boolean,
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notifications", notificationSchema);
module.exports = Notification;
