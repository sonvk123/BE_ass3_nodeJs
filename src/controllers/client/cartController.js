const mongoose = require("mongoose");
const userModels = require("../../models/userModels");
const ProductModel = require("../../models/productModels");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// Lấy danh sách cart
exports.getCarts = async (req, res) => {
  try {
    const userId = req.query.idUser;
    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const cart = user.cart;

    cart.items.forEach((item) => {
      if (!item.img.includes("firebasestorage")) {
        item.img = `${url}/${item.img}`;
      }
    });

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.postAddToCart = async (req, res) => {
  try {
    const { idProduct, idUser, quantity } = req.query;
    const user = await userModels.findById(idUser);
    const product = await ProductModel.findById(idProduct);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    user.addToCart({ product, count: quantity });

    res
      .status(200)
      .json({ message: "Đã thêm sản phẩm vào giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "lỗi Server" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.deleteToCart = async (req, res) => {
  try {
    const { idProduct, userId } = req.query;
    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    user.removeFromCart(idProduct);

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.putToCart = async (req, res) => {
  try {
    const { productId, userId, quantity } = req.query;
    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    user.updateCartItemQuantity({ productId, quantity });

    res.status(200).json({
      message: "Số lượng mặt hàng trong giỏ hàng được cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};
