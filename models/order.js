// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

// schema
const orderSchema = new Schema(
  {
    customerID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Customers",
    },
    restaurantID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Restaurants",
    },
    items: [{ type: mongoose.Types.ObjectId, ref: "FoodItems" }],
    total: Number,
    netTotal: Number,
    couponUsed: Number,
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Import plugin for auto increment
orderSchema.plugin(AutoIncrement, { inc_field: "orderNo" });

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
