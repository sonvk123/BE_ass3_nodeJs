const { format } = require("date-fns");

const userModels = require("../../models/userModels");

const orderModels = require("../../models/orderModels");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// lấy dashboard
exports.getdashboard = async (req, res) => {
  const { count, page, sort } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm

  try {
    const pageSize = +req.query.count;
    const currentPage = +req.query.page;

    const skip = (currentPage - 1) * pageSize;

    // Số lượng người dùng là khách hàng
    const client = await userModels.countDocuments({ isAdmin: "Client" });

    const orders = await orderModels.find().sort({ createdAt: -1 });

    let total_revenue = 0;

    orders.map((value) => {
      total_revenue += value.cart.total;
    });

    // tổng số giao dịch
    const transaction_number = await orderModels.countDocuments();

    // tính tiền trung bình tháng
    let averageMonthlyRevenue = 0;
    if (orders.length > 0) {
      const startDate = new Date(orders[0].createdAt);
      const endDate = new Date(orders[orders.length - 1].createdAt);

      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;

      const totalYears = endYear - startYear;
      const totalMonths = totalYears * 12 + (endMonth - startMonth) + 1;

      averageMonthlyRevenue = total_revenue / totalMonths;
    }

    const ordersSort = await orderModels
      .find()
      .sort({ createdAt: sort === "newToOld" ? -1 : 1 })
      .skip(skip)
      .limit(pageSize);
    // .exec();

    const historys = ordersSort.map((order) => ({
      _id: order._id,
      idUser: order.userId,
      fullname: order.fullname,
      phone: order.phone,
      address: order.address,
      total: order.cart.total,
      delivery: true,
      status: true,
      formattedCreatedAt: format(order.createdAt, "yyyy-MM-dd HH:mm:ss"),
    }));

    // Tổng số bản ghi
    const totalCount = await orderModels.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const data_send = {
      client,
      total_revenue,
      transaction_number,
      historys,
      totalPages: totalPages,
      averageMonthlyRevenue: averageMonthlyRevenue,
    };
    res.status(200).send(data_send);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// xem chi tiểt 1 order
exports.getDetail = async (req, res) => {
  const historyId = req.params.historyId;
  try {
    const order = await orderModels.findById(historyId);

    if (!order) {
      return res.status(401).send({ mesage: "không tìm thấy order cần tìm" });
    }
    order.cart.items.forEach((item) => {
      if (item.img && !item.img.includes("firebasestorage")) {
        item.img = `${url}/${item.img}`;
      }
    });
    const formattedCreatedAt = format(order.createdAt, "yyyy-MM-dd HH:mm:ss");
    const orderWithFormattedDate = {
      ...order.toObject(),
      formattedCreatedAt,
    };
    res.status(200).send(orderWithFormattedDate);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};
