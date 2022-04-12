const Notification = require("../models/notification");
const socketio = require("./socketIO");

module.exports = {
  globalNoti: async (req, res) => {
    try {
      console.log("> Creating Global Notification"); //For Admin Boardcasting Notification to Everyone
      if (req.restaurant != undefined || req.customer != undefined) {
        //Restrict premission to admin
        throw "Global Noti can't be created with normal token!";
      }
      let noti = {};
      noti.reciever = "All";
      noti.sender = "Administrator";
      noti.message = req.body.message;
      noti = await Notification.create(noti);
      console.log("> Created new noti ", noti);
      socketio.notifyAll(noti);
      res.status(201).send(noti);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  //Testing Fetching all notification
  fetchAll: async (req, res) => {
    try {
      let noti = await Notification.find({}).sort({ createdAt: -1 });
      res.status(200).send(noti);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },

  fetchIndividual: async (req, res) => {
    try {
      if (req.customer != undefined) {
        console.log(`>> ${req.customer.username} is fetching notification`);
        let noti = await Notification.find({
          $or: [{ reciever: req.customer.username }, { reciever: "All" }],
          dismissed: false,
        })
          .sort({ createdAt: -1 })
          .limit(5);
        res.status(200).send(noti);
      }
    } catch (err) {
      console.log(err);
      res.status(401).send(err);
    }
  },

  targetedNoti: async (req, res) => {
    try {
      let noti = {};
      let targettype = "";
      noti.reciever = req.body.targetUser;
      if (req.restaurant != undefined) {
        noti.sender = req.restaurant.username;
        targettype = "customer";
      } else {
        noti.sender = req.customer.username;
        targettype = "restaurant";
      }
      noti.message = req.body.message;
      noti = await Notification.create(noti);
      console.log("> Created new targeted noti to", noti.reciever);
      socketio.notifySingle(noti.reciever, targettype, noti);
      res.status(201).send(noti);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  dismissNotification: async (req, res) => {
    try {
      let noti = await Notification.findById(req.params.id);
      if (noti === undefined) {
        throw `Notification with id ${req.params.id} not exist`;
      }
      noti.dismissed = true;
      await noti.save();
      res.status(200).send(`Dismissed Notification with id ${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
