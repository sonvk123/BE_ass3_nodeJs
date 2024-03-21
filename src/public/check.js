// Middleware kiểm tra xác thực đã đăng nhập
exports.checkAuthentication = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (req.cookies.user && req.cookies.user.isLogin) {
    next(); // Cho phép tiếp tục xử lý yêu cầu
  } else {
    res.status(401).send({ messgae: "lỗi chưa đăng nhập !!!" }); // Trả về lỗi 401 nếu không được xác thực
  }
};

// kiểm tra vai trò
exports.checkRoleAdmin = (req, res, next) => {
  // Kiểm tra vai trò của người dùng
  if (req.cookies.user && req.cookies.user.isAdmin === "Admin") {
    next(); // Cho phép tiếp tục xử lý yêu cầu
  } else {
    res.status(403).send({ messgae: "cần có quyền admin để truy cập !!!" }); // Trả về lỗi 403 nếu không có quyền truy cập
  }
};

exports.checkRoleAdminCounselors = (req, res, next) => {
  // Kiểm tra vai trò của người dùng
  if (
    (req.cookies.user && req.cookies.user.isAdmin === "Admin") ||
    req.cookies.user.isAdmin === "Counselors"
  ) {
    next(); // Cho phép tiếp tục xử lý yêu cầu
  } else {
    res.status(403).send({
      messgae: "cần có quyền admin hoặc Counselors để truy cập !!!",
      data: "lỗi",
    }); // Trả về lỗi 403 nếu không có quyền truy cập
  }
};
