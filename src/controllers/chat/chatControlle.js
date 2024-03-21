const usesrModel = require("../../models/userModels");
const sessionModel = require("../../models/sessionModel");

// lấy message theo id phòng
exports.getMessageByRoomId = async (req, res, next) => {
  try {
    const roomId = req.query.roomId;

    const MessageByRoomId = await sessionModel.findById(roomId);

    if (!MessageByRoomId) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tin nhắn trong phòng chat" });
    }

    res.status(200).json(MessageByRoomId);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy tin nhắn trong phòng chat" });
  }
};

// thêm message
exports.addMessage = async (req, res, next) => {
  const cookies = req.cookies;
  const { roomId, message, sender } = req.body;
  const messageNew = {
    sender: sender,
    message: message,
    timestamp: new Date(), // Thêm timestamp vào tin nhắn mới.
  };
  await sessionModel
    .findOneAndUpdate(
      { _id: roomId }, // Điều kiện tìm kiếm
      { $push: { sessionData: messageNew } }, // Thêm newMessage vào sessionData
      { new: true, upsert: true } // Tạo mới nếu không tìm thấy
    )
    .then((updatedSession) => {
      res.status(200).json(updatedSession);
    })
    .catch((error) => {
      res.status(500).json({ error: "Lỗi khi cập nhật session" });
    });
};

// lấy tất cả Room cho admin
exports.getAllRoom = async (req, res, next) => {
  try {
    const users = await usesrModel.find({ isAdmin: "Client" });
    res.status(200).json({ message: "Lấy dữ liệu thành công", data: users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu" });
  }
};
