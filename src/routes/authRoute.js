const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/authController");

const { checkAuthentication } = require("../public/check");

const User = require("../models/userModels");

const router = express.Router();

router.post("/loginClient", authController.postLogin);

router.post("/loginAdmin", authController.postLoginAdmin);

router.get("/logout", checkAuthentication, authController.getlogout);

router.post(
  "/signup",
  [
    check("email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail đã tồn tại, vui lòng chọn một email khác."
            );
          }
        });
      })
      .normalizeEmail(),
    check("phone")
      .isMobilePhone("vi-VN", { strictMode: false }) // Kiểm tra số điện thoại
      .withMessage("Vui lòng nhập số điện thoại hợp lệ.")
      .custom((value, { req }) => {
        return User.findOne({ phoneNumber: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Số điện thoại đã tồn tại, vui lòng chọn một số khác."
            );
          }
        });
      }),
  ],
  authController.postSignup
);

router.get("/:userId", authController.getUser);

module.exports = router;
