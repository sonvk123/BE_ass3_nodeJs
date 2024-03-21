const productModels = require("../../models/productModels");

const file = require("../../public/file");

let url =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL_BACKEND}`
    : "http://localhost:5000";

// lấy danh sách products và theo thên
exports.getPagination = async (req, res) => {
  try {
    const { count, page, search } = req.query;
    // count : số lượng trong 1 trang
    // page : trang hiện tại
    // search : tên tìm kiếm

    const pageSize = +req.query.count;
    const currentPage = +req.query.page;

    let products;
    if (!search) {
      products = await productModels.find();
    } else {
      products = await productModels.find({
        name: { $regex: new RegExp(search, "i") },
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
        quantity: product.quantity,
        Images: updatedImages,
      };
      newCurrentPageData.push(NewProduct);
    });

    const data_send = {
      totalPages: totalPages,
      currentPageData: newCurrentPageData,
    };

    res.status(200).json(data_send);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// xem chi tiết 1 product
exports.getDetail = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productModels.findById(productId);

    if (!product) {
      return res.status(404).send({ message: "Không tìm thấy sản phẩm" });
    }

    for (let i = 1; i <= 4; i++) {
      const imageUrl = product[`img${i}`];
      if (!imageUrl.includes("firebasestorage")) {
        product[`img${i}`] = `${url}/${imageUrl}`;
      }
    }
    res.status(200).send({ message: "Lấy dữ liệu thành công", product });
  } catch (error) {
    res.status(500).send({ message: "Lỗi máy chủ" });
  }
};

// thêm product
exports.postAddProduct = async (req, res) => {
  const { Category, Price, LongDes, ShortDes, Name, Quantity } = req.body;
  const Images = req.files;

  try {
    await productModels.create({
      category: Category,
      img1: Images[0].path,
      img2: Images[1].path,
      img3: Images[2].path,
      img4: Images[3].path,
      long_desc: LongDes,
      short_desc: ShortDes,
      name: Name,
      price: Price,
      quantity: Quantity,
    });

    res.status(200).send({ message: "Thêm sản phẩm thành công !!!" });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server khi thêm sản phẩm" });
  }
};

// cập nhật product
exports.putUpdateProduct = async (req, res) => {
  const { _id, Category, LongDes, ShortDes, Name, Price, Quantity } = req.body;

  const product = await productModels.findById(_id);
  if (!product) {
    return res
      .status(404)
      .send({ message: "Không tìm thấy sản phẩm để cập nhật" });
  }

  try {
    const query = { _id: _id };
    const newProduct = {
      $set: {
        name: Name,
        category: Category,
        long_desc: LongDes,
        short_desc: ShortDes,
        price: Price,
        quantity: Quantity,
      },
    };
    await productModels.updateOne(query, newProduct);
    res.status(200).send({ message: "Cập nhật sản phẩm thành công !!!" });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server khi cập nhật sản phẩm" });
  }
};

// xóa product
exports.getDeleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    // Tìm và xóa sản phẩm theo id
    const product = await productModels.findOneAndDelete({ _id: productId });

    // Kiểm tra sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).send({ message: "Không tìm thấy sản phẩm" });
    }

    // Xóa các tệp ảnh liên quan đến sản phẩm
    file.deleteFile(product.img1);
    file.deleteFile(product.img2);
    file.deleteFile(product.img3);
    file.deleteFile(product.img4);

    // Trả về phản hồi thành công nếu sản phẩm được xóa thành công
    return res.status(200).send({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    return res.status(500).send({ message: "Lỗi server" });
  }
};
