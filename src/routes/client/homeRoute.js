const express = require("express");

const router = express.Router();

const homeController = require("../../controllers/client/homeController");

// lấy dữ liệu Products cho trang home
router.get("/getProducts", homeController.getHomeProducts);

module.exports = router;
