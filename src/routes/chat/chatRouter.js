const express = require("express");

const chatRouter = express.Router();

const chatController = require("../../controllers/chat/chatControlle");

const {
  checkAuthentication,
  checkRoleAdminCounselors,
} = require("../../public/check");

// lấy danh messgae theo Id phòng
chatRouter.get(
  "/getById",
  checkAuthentication,
  chatController.getMessageByRoomId
);

// thêm message
chatRouter.put("/addMessage", checkAuthentication, chatController.addMessage);

// lấy tất cả danh sách phòng
chatRouter.get(
  "/getAllRoom",
  checkAuthentication,
  checkRoleAdminCounselors,
  chatController.getAllRoom
);

module.exports = chatRouter;
