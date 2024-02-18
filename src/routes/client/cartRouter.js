const express = require("express");

const router = express.Router();

const cartController = require("../../controllers/client/cartController");

const { checkAuthentication } = require("../../public/check");

// lấy cart
router.get("/", checkAuthentication, cartController.getCarts);

// thêm cart
router.post("/add", checkAuthentication, cartController.postAddToCart);

// xóa cart
router.delete("/delete", checkAuthentication, cartController.deleteToCart);

// cập nhật cart
router.put("/update", checkAuthentication, cartController.putToCart);

module.exports = router;
