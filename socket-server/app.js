// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./socket.config'));

// SocketIO
io.on('connection', socket => {
  const clientHeaders = socket.request.headers;
  const clientCookies = cookiesStrToObject(clientHeaders.cookie);
  const token = clientCookies.token;
  console.log(token);

  // Remove disconnected users
  socket.on('disconnect', () => {
    // do something
  });
});

/**
 * Functions
 */

function cookiesStrToObject(cookie_string) {
  return cookie_string.split('; ').reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
}

module.exports = { socket: io };
