const express = require("express");

const router = express.Router();

const productsController = require("../../controllers/admin/productsController");

const { checkAuthentication, checkRoleAdmin } = require("../../public/check");

// lấy Produsts
router.get(
  "/pagination",
  checkAuthentication,
  checkRoleAdmin,
  productsController.getPagination
);

// lấy product để sửa
router.get(
  "/product/:productId",
  checkAuthentication,
  checkRoleAdmin,
  productsController.getDetail
);

// cập nhật product
router.put(
  "/updateProduct",
  checkAuthentication,
  checkRoleAdmin,
  productsController.putUpdateProduct
);

// thêm product
router.post(
  "/new",
  checkAuthentication,
  checkRoleAdmin,
  productsController.postAddProduct
);

// xóa product
router.delete("/deleteProduct/:productId", productsController.getDeleteProduct);

module.exports = router;
