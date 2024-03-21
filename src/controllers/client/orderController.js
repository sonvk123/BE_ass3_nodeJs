const userModels = require("../../models/userModels");
const orderModels = require("../../models/orderModels");
const productModels = require("../../models/productModels");
const sendMail = require("../../public/sendMail");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

exports.postEmail = async (req, res) => {
  try {
    const { address, fullname, idUser, phone, to } = req.query;
    const user = await userModels.findById(idUser);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const userCartItems = user.cart.items;
    let total = 0;

    // nếu số lượng sản phẩm trong giỏ hàng nhỏ hơn số lượng sản phẩm trong kho thì tiếp tục
    for (const item of userCartItems) {
      const product = await productModels.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: "Sản phẩm trong kho không đủ" });
      }

      product.quantity -= item.quantity;
      await product.save();

      const s = +item.priceProduct * +item.quantity;
      total += s;
    }
    // tạo một order mới
    const newOrder = await orderModels.create({
      userId: user._id,
      fullname,
      phone,
      email: to,
      address,
      cart: { items: userCartItems, total },
      dateTime: new Date(),
    });

    // lưu các thay đổi của user và order
    user.order.push(newOrder._id);
    await user.save();

    await newOrder.save();
    await user.clearCart();

    for (const item of userCartItems) {
      // sửa link hình ảnh
      if (!item.img.includes("firebasestorage")) {
        item.img = `${url}/${item.img}`;
      }
    }
    // gửi mail sau khi lưu
    await sendMail({
      email: to,
      subject: "TEST",
      fullname,
      phone,
      address,
      userCartItems,
      total,
    });

    res.status(200).send({ message: "Đã gửi email thành công" });
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ" });
  }
};
