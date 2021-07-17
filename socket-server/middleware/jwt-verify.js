// Variables
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const jwt_config = require('../config/jwt').config;
const jwt_secret = require('../config/jwt').secret;

// Middleware
function middleware(socket, next) {
  const headers = socket.request.headers;
  const cookies = cookie.parse(headers.cookie);
  const token = cookies.token;

  // Verifying JWT
  jwt.verify(token, jwt_secret, jwt_config, (err, payload) => {
    if (err) {
      console.log(`${err.name}: ${err.message}`);
      next(new Error('Not authorized'));
    } else {
      socket.data['payload'] = payload;
      next();
    }
  });
}

module.exports = middleware;
