const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const User = require("../models/userModels");

const sessionModel = require("../models/sessionModel");

// khi đăng nhập
exports.postLogin = async (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    // lấy dữ liệu user theo email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "Sai tài khoản hoặc mật khẩu !!!" });
    }

    // kiếm tra xem password có đúng không
    const doMatch = await bcrypt.compare(password, user.password);
    // nếu đúng thì lấy data user để truyền xuống client
    if (doMatch) {
      const userSend = {
        _id: user._id,
        email: user.email,
        name_user: user.fullName,
        cart: user.cart,
        isAdmin: user.isAdmin,
        roomId: user.session,
        isLogin: true,
      };
      // tạo cookie
      res.cookie("user", userSend, {
        httpOnly: true,
        Secure: process.env.NODE_ENV === "production", // Sử dụng HTTPS khi ở production
        SameSite: "None", // Cho phép cookie được chia sẻ giữa các domain,
      });
      return res
        .status(200)
        .send({ message: "Đăng nhập thành công !!", user: userSend });
    } else {
      return res
        .status(401)
        .json({ errorMessage: "Sai tài khoản hoặc mật khẩu !!!" });
    }
  } catch (err) {
    return res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// khi đăng nhập admin
exports.postLoginAdmin = async (req, res, next) => {
  const { email, password } = req.query;
  try {
    // lấy dữ liệu user theo email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "Sai tài khoản hoặc mật khẩu !!!" });
    }

    // kiếm tra xem password có đúng không
    const doMatch = await bcrypt.compare(password, user.password);
    // nếu đúng thì lấy data admin để truyền xuống client
    if (doMatch) {
      if (user.isAdmin === "Admin" || user.isAdmin === "Counselors") {
        const userSend = {
          _id: user._id,
          email: user.email,
          name_user: user.fullName,
          cart: user.cart,
          isAdmin: user.isAdmin,
          isLogin: true,
        };

        // tạo cookie
        res.cookie("user", userSend, {
          httpOnly: true,
          Secure: process.env.NODE_ENV === "production", // Sử dụng HTTPS khi ở production
          SameSite: "None", // Cho phép cookie được chia sẻ giữa các domain,
        });

        return res
          .status(200)
          .send({ message: "Đăng nhập thành công !!", user: userSend });
      } else {
        return res.status(403).send({
          errorMessage:
            "Đăng nhập thất bại, phải đăng nhập bằng tài khoản Admin hoặc Counselors !!",
        });
      }
    } else {
      return res.status(401).json({
        errorMessage: "Sai tài khoản hoặc mật khẩu !!!",
      });
    }
  } catch (err) {
    return res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// khi đăng xuất
exports.getlogout = async (req, res) => {
  res.clearCookie("user").send("Đã xóa cookie thành công");
};

// khi đăng ký
exports.postSignup = async (req, res, next) => {
  const { fullName, email, password, phone } = req.query;
  const isAdmin = req.query.isAdmin ? req.query.isAdmin : "Client";

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const data = {
        errorMessage: errors.array()[0].msg,
        oldInput: { fullName, email, password, phone, isAdmin },
        validationErrors: errors.array(),
      };

      return res.status(422).send(data);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const session = await sessionModel.create({
        userId: null,
        sessionData: [],
      });

      const user = await User.create({
        fullName: fullName,
        email: email,
        phoneNumber: phone,
        password: hashedPassword,
        isAdmin: isAdmin,
        cart: { items: [] },
        session: session._id,
      });

      session.userId = user._id;
      await session.save();

      return res.status(200).send("gửi thành công");
    }
  } catch (error) {
    return res.status(500).send({ errorMessage: "Lỗi server" });
  }
};

// lấy user theo Id
exports.getUser = async (req, res, next) => {
  const userId = req.params.userId; // Lấy userId từ request params
  try {
    const user = await User.findById(userId); // Tìm user dựa trên _id

    if (!user) {
      return res
        .status(404)
        .send({ errorMessage: "Không tìm thấy người dùng" });
    }

    return res.status(200).send({ user: user }); // Trả về thông tin user
  } catch (err) {
    return res.status(500).send({ errorMessage: "Lỗi server" }); // Trả về lỗi server nếu có vấn đề xảy ra
  }
};
