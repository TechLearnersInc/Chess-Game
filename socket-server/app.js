// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./socket.config'));
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis_config = require('./redis.config');

// Redis Cache Database
const redis = new Redis(redis_config.cachedb);

// Socketio Redis Adapter
const pubClient = new Redis(redis_config.msg_broker);
const subClient = pubClient.duplicate();
const { createAdapter } = require('@socket.io/redis-adapter');
const socketAdapter = createAdapter(pubClient, subClient);

/**
 * SocketIO
 */

io.on('connection', async client => {
  const clientHeaders = client.request.headers;
  const clientCookies = cookiesStrToObject(clientHeaders.cookie);
  const token = clientCookies.token;
  let tokenPayload;

  try {
    const config = { algorithm: 'HS256' };
    const secret = process.env.SECRET_TOKEN;
    tokenPayload = await jwt.verify(token, secret, config);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      client.emit('invalid', 'Session expired, try to re-join.'); // Emit Invalid Reason to Client
    } else if (err instanceof jwt.JsonWebTokenError) {
      client.emit('invalid', 'Invalid token, server rejected.'); // Emit Invalid Reason to Client
    } else console.error(err);
    client.disconnect(true); // Disconnect Client
  }

  // Remove disconnected users
  client.on('disconnect', async () => {
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

module.exports = { io, socketAdapter };
