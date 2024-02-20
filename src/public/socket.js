let io;

require("dotenv").config();

const urlAdmin = process.env.URL_ADMIN;
const urlClient = process.env.URL_CLIENT;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          `${urlAdmin}`,
          `${urlClient}`,
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
