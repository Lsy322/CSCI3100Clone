// packages
const Order = require("../models/order");
const custCtrler = require("../controllers/customer");
const restCtrler = require("../controllers/restaurant");
const socketio = require("./socketIO");
const Notification = require("../models/notification");

module.exports = {
  getOrderByRestaurant: async (req, res) => {
    // TODO : Fetch Order from database
    try {
      const orders = await Order.find({ restaurantID: req.restaurant._id })
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(orders);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getOrderByCustomer: async (req, res) => {
    // TODO : Fetch Order from database
    try {
      const orders = await Order.find({ customerID: req.customer._id })
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(orders);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getOrderByID: async (req, res) => {
    // TODO : Fetch Order from database
    try {
      const order = await Order.findOne({ _id: req.body.orderId })
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(order);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getOrderByIDParams: async (req, res) => {
    try {
      const order = await Order.findOne({ _id: req.params.id })
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(order);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  addOrder: async (req, res) => {
    // TODO : Add order to database
    console.log("> add order");
    try {
      let customer = req.customer;
      let orderDoc = {};
      orderDoc.customerID = customer._id;
      orderDoc.restaurantID = req.body.restaurantID;
      let restaurant = await restCtrler.getRestaurantById(
        orderDoc.restaurantID
      );

      // check if empty order
      if (req.body.items.length < 1) {
        throw { name: "EmtpyOrderError", message: "Can't place empty order" };
      }

      // check if enough points for coupon
      if (customer.points < req.body.couponUsed) {
        throw {
          name: "NotEnoughPointsForCoupon",
          message: "Not enough points for coupon",
        };
      }
      orderDoc.items = req.body.items;
      orderDoc = await Order.create(orderDoc);
      orderDoc = await Order.findById(orderDoc._id)
        .populate("customerID")
        .populate("restaurantID")
        .populate("items");

      // calculate total amount
      let total = 0;
      orderDoc.items.forEach((food) => {
        total += food.price;
        console.log("food: ", food.name, "$", food.price, "cum. total:", total);
      });

      // check if matched total amount
      console.log("total(calc)", total, "total(from req)", req.body.total);
      if (total != req.body.total) {
        await Order.deleteOne(orderDoc._id);
        throw {
          name: "AmountMismatchedAndRejectOrder",
          message:
            "The sent amount is not matched with calculated total, order rejected",
        };
      }

      let netTotal = total - req.body.couponUsed;
      orderDoc.total = total;
      orderDoc.couponUsed = req.body.couponUsed;
      orderDoc.netTotal = netTotal;
      customer.points -= req.body.couponUsed;

      console.log(
        "total:",
        total,
        "coupon used:",
        req.body.couponUsed,
        "netTotal:",
        netTotal
      );
      console.log("points earned:", Math.floor(netTotal / 5));

      // update customer points
      customer.points += Math.floor(netTotal / 5);
      await customer.save();
      orderDoc.customerID.points = customer.points;
      await orderDoc.save();

      console.log("> Successfully placed order");

      socketio.sendOrder(restaurant.username, orderDoc);
      res.status(201).send(orderDoc);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },

  finishOrder: async (req, res, next) => {
    // TODO: complete an order
    console.log("> finish order");
    try {
      //The Request sender is not a restaurant
      // this part can be ignored because it is catched by verifyToken
      // if (req.restaurant == undefined) {
      //   throw {name: 'NotARestaurantError', message: 'Only Restaurant can updated order status!'};
      // }
      console.log("Order", req.body.orderNo, "Finish");
      let doc = await Order.findOne({ orderNo: req.body.orderNo });
      //Check if the order is already finished
      if (doc.status) {
        throw {
          namer: "OrderAlreadyFinshed",
          message: `Order No:${req.body.orderId} already finished!`,
        };
      }

      doc.status = true;
      await doc.save();

      //TODO: Add function to SOCKET.IO to alert user
      const orders = await Order.findOne({ orderNo: req.body.orderNo })
        .populate("customerID")
        .populate("restaurantID")
        .populate("items");

      let noti = {};
      let targettype = "";
      noti.reciever = orders.customerID.username;
      noti.sender = req.restaurant.username;
      targettype = "customer";
      noti.message = `Your order #${orders.orderNo} placed at ${req.restaurant.restaurantName} is ready for pick up!`;
      let notiDoc = await Notification.create(noti);
      console.log("> Created new targeted noti to", noti.reciever);
      socketio.notifySingle(noti.reciever, targettype, notiDoc);

      // continue to notify target customer
      res
        .status(200)
        .send({ message: `Order ${doc._id} status have been updated` });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  getAllOrderData: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
