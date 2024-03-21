const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  img: { type: String, required: true },
  nameProduct: { type: String, required: true },
  priceProduct: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isAdmin: { type: String, required: true },
  cart: {
    items: [cartItemSchema],
  },
  order: [{ type: Schema.Types.ObjectId, ref: "Session", required: true }],
  session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
});

// thêm sản phầm vào giỏ hàng
UserSchema.methods.addToCart = function ({ product, count }) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + +count;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      img: product.img1,
      nameProduct: product.name,
      priceProduct: product.price,
      quantity: +count,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

// xóa một sản phẩm trong giỏ hàng
UserSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

// thêm , bớt quantity
UserSchema.methods.updateCartItemQuantity = function ({ productId, quantity }) {
  const cartItem = this.cart.items;
  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }
  cartItem.forEach((value) => {
    if (value.productId.equals(productId)) {
      value.quantity = quantity;
    }
  });
  return this.save();
};

// xóa tòn bộ cart
UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
