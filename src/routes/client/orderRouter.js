const express = require("express");

const router = express.Router();

const orderController = require("../../controllers/client/orderController");

const { checkAuthentication, checkRole } = require("../../public/check");

// gửi email xác nhận
router.post("/email", checkAuthentication, orderController.postEmail);

module.exports = router;
