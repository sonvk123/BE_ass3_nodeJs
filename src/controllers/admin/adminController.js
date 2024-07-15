const fs = require("fs");

const path = require("path");

const bcrypt = require("bcryptjs");

const DATA_PATH_Hotle = path.join("src", "DataAssignment03", "products.json");

const data_Products = JSON.parse(fs.readFileSync(DATA_PATH_Hotle, "utf8"));

const ProductModel = require("../../models/productModels");
const userModels = require("../../models/userModels");

// thêm Products vào trong database
exports.postProducts = (req, res) => {
  let data_Products_all = [];

  data_Products.map((value) => {
    const Product = {
      _id: value._id.$oid || value._id,
      category: value.category,
      img1: value.img1,
      img2: value.img2,
      img3: value.img3,
      img4: value.img4,
      long_desc: value.long_desc,
      name: value.name,
      price: +value.price,
      short_desc: value.short_desc,
      quantity: 100,
    };
    data_Products_all.push(Product);
  });
  ProductModel.insertMany(data_Products_all)
    .then((result) => res.status(200).json("Đã chèn thành công"))
    .catch((error) => {
      console.error("Lỗi khi chèn", error);
      res.status(500).json("Lỗi khi chèn");
    });
};

// lấy danh sách User
exports.postAllData = async (req, res) => {
  const { count, page, search } = req.query;
  // count : số lượng trong 1 trang
  // page : trang hiện tại
  // search : tên tìm kiếm

  const pageSize = +req.query.count;
  const currentPage = +req.query.page;

  const skip = (currentPage - 1) * pageSize;

  try {
    let users;

    if (!search) {
      users = await userModels
        .find({ isAdmin: "Client" })
        .skip(skip)
        .limit(pageSize);
      // .exec();
    } else {
      users = await userModels
        .find({
          isAdmin: "Client",
          fullName: { $regex: new RegExp(search, "i") },
        })
        .skip(skip)
        .limit(pageSize);
      // .exec();
    }
    const totalCount = await userModels.countDocuments({ isAdmin: "Client" });
    const totalPages = Math.ceil(totalCount / pageSize);

    const data_send = {
      totalPages: totalPages,
      users: users,
    };

    res.status(200).send(data_send);
  } catch (error) {
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// lấy user theo id để sửa
exports.getDetailData = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModels.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ errorMessage: "Không tìm thấy người dùng" });
    }
    res.status(200).send({ message: "Lấy dữ liệu thành công", user });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// update user
exports.putUpdateUser = async (req, res) => {
  const { _id, fullName, email, password, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = { fullName, email, password: hashedPassword, phone };

  try {
    const user = await userModels.findByIdAndUpdate(_id, newUser, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Không tìm thấy User để cập nhật" });
    }
    res.status(200).send({ message: "Cập nhật User thành công !!!" });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server khi cập nhật User" });
  }
};

// xóa user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Sử dụng phương thức remove hoặc deleteOne của Model để xóa user theo id
    const result = await userModels.deleteOne({ _id: userId });
    if (result.deletedCount === 1) {
      // Nếu user được xóa thành công, trả về phản hồi thành công
      return res.status(200).send({ message: "User đã được xóa thành công" });
    } else {
      // Nếu không tìm user với id tương ứng, trả về phản hồi lỗi
      return res.status(404).send({ message: "Không tìm thấy user" });
    }
  } catch (error) {
    // Xử lý lỗi nếu có

    return res.status(500).send({ message: "Lỗi server" });
  }
};
