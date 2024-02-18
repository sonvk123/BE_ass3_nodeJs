const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  cart: {
    items: [{ type: Object, required: true }],
    total: { type: Number, required: true },
  },
  dateTime: { type: String, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
