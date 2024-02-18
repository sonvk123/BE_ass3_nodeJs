const express = require("express");

const router = express.Router();

const adminController = require("../../controllers/admin/adminController");
const { checkAuthentication, checkRoleAdmin } = require("../../public/check");

// thêm nhiều postProducts
router.get("/addProducts", adminController.postProducts);

// lấy danh sách user
router.post(
  "/users",
  checkAuthentication,
  checkRoleAdmin,
  adminController.postAllData
);

// lấy user theo id để sửa
router.get(
  "/users/user/:userId",
  checkAuthentication,
  checkRoleAdmin,
  adminController.getDetailData
);

// update user
router.put(
  "/users/putUpdateUser",
  checkAuthentication,
  checkRoleAdmin,
  adminController.putUpdateUser
);

// xóa một user
router.delete(
  "/users/deleteUser/:userId",
  checkAuthentication,
  checkRoleAdmin,
  adminController.deleteUser
);

module.exports = router;
