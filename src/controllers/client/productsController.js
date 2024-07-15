const ProductModel = require("../../models/productModels");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// lấy danh sách products và theo tên
exports.getPagination = async (req, res) => {
  const { count, page, search, category } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm

  const pageSize = +req.query.count;
  const currentPage = +req.query.page;

  const skip = (currentPage - 1) * pageSize;

  // Điều kiện truy vấn dựa trên thông tin từ người dùng
  const query = {};
  if (search) {
    query.name = { $regex: new RegExp(search, "i") };
  }
  if (category && category !== "all") {
    query.category = category;
  }

  try {
    // Sử dụng Mongoose Query Helpers và Aggregation Framework nếu cần thiết
    const [products, totalCount] = await Promise.all([
      ProductModel.find(query).skip(skip).limit(pageSize).lean(),
      ProductModel.countDocuments(query),
    ]);

    // Tổng số bản ghi
    const totalPages = Math.ceil(totalCount / pageSize);

    let newCurrentPageData = products.map((product) => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      short_desc: product.short_desc,
      long_desc: product.long_desc,
      Images: Array.from({ length: 4 }, (_, i) =>
        product[`img${i + 1}`].includes("firebasestorage")
          ? product[`img${i + 1}`]
          : `${url}/${product[`img${i + 1}`]}`
      ),
    }));

    const data_send = {
      totalPages: totalPages,
      products: newCurrentPageData,
    };
    res.status(200).send(data_send);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu sản phẩm" });
  }
};

// lấy Product theo id
exports.getDetail = async (req, res) => {
  const productId = req.params.productId;
  try {
    const Product = await ProductModel.findById(productId);

    for (let i = 1; i <= 4; i++) {
      const imageUrl = Product[`img${i}`];
      if (imageUrl.includes("firebasestorage")) {
        Product[`img${i}`] = imageUrl;
      } else {
        Product[`img${i}`] = `${url}/${imageUrl}`;
      }
    }
    res.send({ message: "gửi dữ liệu thành công", products: Product });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu sản phẩm" });
  }
};
