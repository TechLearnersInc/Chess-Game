// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./socket.config'));
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis_config = require('./redis.config');
const redisFuncsClass = require('./redis-funcs');

// Redis Cache Database
const redis = new Redis(redis_config.cachedb);
const redisFuncs = new redisFuncsClass(redis);

// Socketio Redis Adapter
const pubClient = new Redis(redis_config.msg_broker);
const subClient = pubClient.duplicate();
const { createAdapter } = require('@socket.io/redis-adapter');
const socketAdapter = createAdapter(pubClient, subClient);

// Variables
const jwt_config = { algorithm: 'HS256' };
const jwt_secret = process.env.SECRET_TOKEN;

// Custom Errors
const { gamecodeError } = require('./custom-errors');

/**
 * SocketIO
 */

io.on('connection', async client => {
  const clientHeaders = client.request.headers;
  const clientCookies = cookiesStrToObject(clientHeaders.cookie);
  const token = clientCookies.token;
  let tokenPayload;
  let gameData;
  let gamecode;
  let player;

  // Validity Check
  try {
    // JWT Check
    tokenPayload = await jwt.verify(token, jwt_secret, jwt_config);
    gamecode = tokenPayload.gamecode;
    player = tokenPayload.player;

    // Gamecode check
    gameData = await redisFuncs.getGameData(gamecode);

    if (gameData['gamecode'] === undefined) throw new gamecodeError('Invalid gamecode');

    //
  } catch (err) {
    // Emit Invalid Reason to Client
    if (err instanceof jwt.TokenExpiredError)
      client.emit('invalid', 'Session expired, try to re-join.');
    else if (err instanceof jwt.JsonWebTokenError)
      client.emit('invalid', 'Invalid token, server rejected.');
    else if (err instanceof gamecodeError)
      client.emit('invalid', `${err.message}, server rejected.`);
    else console.error(err);
    // Disconnect Client
    client.disconnect(true);
    return;
  }

  const boardInitialState = {
    fen: gameData.fen,
    player: player,
    freeze: false,
  };
  client.emit('valid', boardInitialState);

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
