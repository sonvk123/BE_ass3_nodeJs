const express = require("express");

const router = express.Router();

const homeController = require("../../controllers/admin/homeController");

const { checkAuthentication, checkRoleAdmin } = require("../../public/check");

// lấy Produsts
router.get(
  "/products/name",
  checkAuthentication,
  checkRoleAdmin,
  homeController.getProducts
);

module.exports = router;
