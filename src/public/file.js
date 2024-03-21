const fs = require("fs");

const deleteFile = (filePath) => {
  console.log("gọi xóa nè");

  fs.unlink(filePath, (err) => {
    console.log("filePath:", filePath);
    if (err) {
      console.log("err:", err);
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
