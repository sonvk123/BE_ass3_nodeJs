const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
  category: { type: String, required: true },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  long_desc: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  short_desc: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
