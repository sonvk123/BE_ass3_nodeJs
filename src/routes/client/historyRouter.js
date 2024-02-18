const express = require("express");

const router = express.Router();

const historyController = require("../../controllers/client/historyController");

const { checkAuthentication, checkRole } = require("../../public/check");

// lấy History
router.get("/", checkAuthentication, historyController.getHistory);

// lấy History theo id
router.get("/historie/:id", checkAuthentication, historyController.getDetail);

module.exports = router;
