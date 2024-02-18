const productModel = require("../../models/productModels");

exports.getProducts = async (req, res) => {
  const name = req.query.name;
  const userCookie = req.cookies.user;
  
  try {
    if (userCookie && userCookie.isAdmin === "admin") {
      if (!name) {
        const products = await productModel.find();
        res.status(200).send({
          message: "Lấy dữ liệu thành công!",
          products
        });
      } else {
        const products = await productModel.find({ name: { $regex: new RegExp(name, "i") } });
        res.status(200).send({
          message: "Lấy dữ liệu thành công!",
          products
        });
      }
    } else {
      console.log("Phải là admin mới có thể truy cập vào trang này !");
      res.status(403).send({
        message: "Phải là admin mới có thể truy cập vào trang này!",
        products: []
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

