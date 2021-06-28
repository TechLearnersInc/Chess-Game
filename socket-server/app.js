// Module dependencies.
const socketio = require("socket.io");
const io = socketio(undefined, require("./socket.config"));

let sockets = {};

// SocketIO
io.on("connection", function (socket) {
  // Emit the connected users when a new socket connects
  for (let i in sockets) {
    socket.emit("user.add", {
      username: sockets[i].username,
      id: sockets[i].id,
    });
  }

  // Add a new user
  socket.on("username.create", function (data) {
    socket.username = data;
    sockets[socket.id] = socket;
    io.emit("user.add", {
      username: socket.username,
      id: socket.id,
    });
  });

  // Send the hug event to only the socket specified
  socket.on("user.hug", function (id) {
    sockets[id].emit("user.hugged", socket.username);
  });

  // Remove disconnected users
  socket.on("disconnect", function () {
    delete sockets[socket.id];
    io.emit("user.remove", socket.id);
  });
});

module.exports = { socket: io };
