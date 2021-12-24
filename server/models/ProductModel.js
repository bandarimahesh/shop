const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, require: true, unique: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  img: { type: String, require: true },
  category: { type: Array },
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema);
