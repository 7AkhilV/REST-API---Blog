let io;

// Method to initialize Socket.IO with the provided HTTP server.
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },

  // Method to get the existing Socket.IO instance.
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
