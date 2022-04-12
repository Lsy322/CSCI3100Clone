require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bodyParser = require("body-parser");
const app = express();

app.use(express.json());

// routers
const customerRouter = require("./routers/customer");
const restaurantRouter = require("./routers/restaurant");
const adminRouter = require("./routers/admin");
const orderRouter = require("./routers/order");
const notificationRouter = require("./routers/notification");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use("/customer", customerRouter);
app.use("/restaurant", restaurantRouter);
app.use("/admin", adminRouter);
app.use("/order", orderRouter);
app.use("/notification", notificationRouter);

const CONNECTION_URL = process.env.DB_URL;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log("Server running on port " + PORT))
  )
  .catch((err) => console.log(err));

module.exports.appObject = app;
