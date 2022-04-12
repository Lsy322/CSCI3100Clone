// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema
const foodItemsSchema = new Schema({
  picture: Buffer,
  name: String,
  style: String,
  price: Number,
});

const FoodItems = mongoose.model("FoodItems", foodItemsSchema);
module.exports = FoodItems;
