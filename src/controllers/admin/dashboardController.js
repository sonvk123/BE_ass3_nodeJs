const userModels = require("../../models/userModels");

const orderModels = require("../../models/orderModels");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// lấy dashboard
exports.getdashboard = async (req, res) => {
  const { count, page } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm
  try {
    const pageSize = +req.query.count;
    const currentPage = +req.query.page;

    // Số lượng người dùng là khách hàng
    const client = await userModels.countDocuments({ isAdmin: "Client" });

    const orders = await orderModels.find();

    // Sắp xếp orders theo thuộc tính dateTime từ mới nhất đến cũ nhất
    orders.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    let total_revenue = 0;

    orders.map((value) => {
      total_revenue += value.cart.total;
    });

    // tổng số giao dịch
    const transaction_number = await orderModels.countDocuments();

    // tính tiền trung bình tháng
    let averageMonthlyRevenue = 0;
    if (orders.length > 0) {
      const startDate = new Date(orders[0].dateTime);
      const endDate = new Date(orders[orders.length - 1].dateTime);

      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;

      const totalYears = endYear - startYear;
      const totalMonths = totalYears * 12 + (endMonth - startMonth) + 1;

      averageMonthlyRevenue = total_revenue / totalMonths;
    }

    let historys = [];
    orders.map((order) => {
      const history = {
        _id: order._id,
        idUser: order.userId,
        fullname: order.fullname,
        phone: order.phone,
        address: order.address,
        total: order.cart.total,
        delivery: true,
        status: true,
      };
      historys.push(history);
    });

    // Tính vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = historys.length; // Tổng số bản ghi

    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = historys.slice(startIndex, endIndex);

    const data_send = {
      client,
      total_revenue,
      transaction_number,
      historys: currentPageData,
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
      res.status(401).send({ mesage: "không tìm thấy order cần tìm" });
    }
    order.cart.items.forEach((item) => {
      if (item.img && !item.img.includes("firebasestorage")) {
        item.img = `${url}/${item.img}`;
      }
    });
    res.status(200).send(order);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};
