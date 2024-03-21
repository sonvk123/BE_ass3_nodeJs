const express = require("express");

const router = express.Router();

const dashboardController = require("../../controllers/admin/dashboardController");

const { checkAuthentication, checkRoleAdmin } = require("../../public/check");

// lấy dashboard
router.get(
  "/all",
  checkAuthentication,
  checkRoleAdmin,
  dashboardController.getdashboard
);

// xem chi tiểt 1 order
router.get(
  "/:historyId",
  checkAuthentication,
  checkRoleAdmin,
  dashboardController.getDetail
);

module.exports = router;
