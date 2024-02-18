const ProductModel = require("../../models/productModels");

exports.getHomeProducts = async (req, res) => {
  try {
    const Products = await ProductModel.find();
    
    res.send({ message: "Gửi dữ liệu thành công", products: Products });
  } catch (error) {

    res.status(500).send({ message: "Lỗi server khi lấy dữ liệu sản phẩm" });
  }
};