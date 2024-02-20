const mongoose = require("mongoose");

require("dotenv").config();

const MONGODB_URI = process.env.URL_MONGODB;

const connect = async () => {
  try {
    let connection = await mongoose.connect(MONGODB_URI ,{ useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Đã kết nối tới database thành công !");
    return connection;
  } catch (err) {
    const { code } = err;
    if (code === 8000) {
      throw new Exception("sai tên đăng nhập hoặc mật khẩu !!!");
    } else if (code === "ENOTFOUIND") {
      throw new Exception("sai tên sever name !!!");
    }
    console.log(err);
    throw new Exception("lỗi gì đó rồi !!m!");
  }
};

module.exports = { connect, MONGODB_URI };
