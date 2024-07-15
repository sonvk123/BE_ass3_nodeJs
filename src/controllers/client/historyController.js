const userModel = require("../../models/userModels");
const orderModel = require("../../models/orderModels");

const { format } = require("date-fns");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// lấy History
exports.getHistory = async (req, res) => {
  const { count, page, idUser } = req.query;
  // count: số lượng đơn hàng trong mỗi trang
  // page: trang hiện tại
  // idUser: ID của người dùng

  const pageSize = +count;
  const currentPage = +page;

  const skip = (currentPage - 1) * pageSize;

  try {
    const user = await userModel.findById(idUser);
    // lấy các orderId để lấy các order của user
    const orderIds = user.order;

    const orders = await orderModel
      .find({ _id: { $in: orderIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Tổng số bản ghi
    const totalCount = await orderModel.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize); // Tổng số trang

    const historySend = orders.map((order) => ({
      _id: order._id,
      idUser: idUser,
      fullname: order.fullname,
      phone: order.phone,
      address: order.address,
      total: order.cart.total,
      delivery: true,
      status: true,
      time: format(order.createdAt, "HH:mm:ss yyyy-MM-dd"),
    }));

    const data_send = {
      totalPages: totalPages,
      currentPageData: historySend,
    };
    res.send(data_send);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send({ message: "Lỗi server khi lấy lịch sử đơn hàng" });
  }
};

// lấy History theo id
exports.getDetail = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Đơn hàng không tồn tại" });
    }

    order.cart.items.forEach((item) => {
      if (item.img && !item.img.includes("firebasestorage")) {
        item.img = `${url}/${item.img}`;
      }
    });

    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
};
