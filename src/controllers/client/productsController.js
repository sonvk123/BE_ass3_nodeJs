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
  try {
    let products;
    if (!search && category === "all") {
      products = await ProductModel.find();
    } else if (!search && category !== "all") {
      products = await ProductModel.find({ category: category });
    } else if (search && category === "all") {
      products = await ProductModel.find({
        name: { $regex: new RegExp(search, "i") },
      });
    } else if (search && category !== "all") {
      products = await ProductModel.find({
        name: { $regex: new RegExp(search, "i") },
        category: category,
      });
    }

    // Tính toán vị trí đầu và cuối của trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const totalRecords = products.length; // Tổng số bản ghi

    const totalPages = Math.ceil(totalRecords / pageSize); // Tổng số trang

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = products.slice(startIndex, endIndex);

    let newCurrentPageData = [];
    currentPageData.map((product) => {
      const updatedImages = [];
      for (let i = 1; i <= 4; i++) {
        const imageUrl = product[`img${i}`];
        if (imageUrl.includes("firebasestorage")) {
          updatedImages.push(imageUrl);
        } else {
          updatedImages.push(`${url}/${imageUrl}`);
        }
      }
      const NewProduct = {
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        short_desc: product.short_desc,
        long_desc: product.long_desc,
        Images: updatedImages,
      };
      newCurrentPageData.push(NewProduct);
    });

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
