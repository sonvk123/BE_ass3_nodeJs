const express = require("express");

const router = express.Router();

const productsController = require("../../controllers/client/productsController");

const { checkAuthentication, checkRole } = require('../../public/check');

// lấy dữ liệu trang Shop
router.get("/pagination", productsController.getPagination)

// lấy dữ liệu Product theo id
router.get("/:productId", productsController.getDetail);


module.exports = router;
