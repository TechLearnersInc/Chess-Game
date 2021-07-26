// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./config/socketio'));
const restify = require('restify-clients');
const restClient = restify.createJsonClient(process.env.REST_API_SERVER);
const restClientEndpoints = require('./config/rest-client-endpoints');

const Redis = require('ioredis');
const redis_config = require('./config/redis');
const redisFuncsClass = require('./redis-funcs');

// Redis Cache Database
const redis = new Redis(redis_config.cachedb);
const redisFuncs = new redisFuncsClass(redis);

// Socketio Redis Adapter
const pubClient = new Redis(redis_config.msg_broker);
const subClient = pubClient.duplicate();
const { createAdapter } = require('@socket.io/redis-adapter');
const socketAdapter = createAdapter(pubClient, subClient);

/**
 * Middlewares
 */

// Local Variable
io.use((socket, next) => {
  socket.locals = {
    redis,
    redisFuncs,
    restClient,
    restClientEndpoints,
  };
  next();
});

// JWT Verification
io.use(require('./middlewares/jwt-verify'));

// Gamecode Verification
io.use(require('./middlewares/gamecode-verify'));

io.on('connection', async socket => {
  const payload = socket.locals.payload;
  const gamecode = payload.gamecode;
  const player = payload.player;
  const redisFuncs = socket.locals.redisFuncs;

  /*
  // Saved Board State
  const boardState = {
    fen: gameData.fen,
    player: player,
    freeze: gameData.turn === player ? false : true,
  };
  */

  // Remove disconnected users
  socket.on('disconnect', async () => {
    if (payload) redisFuncs.setPlayerLefted(gamecode, player);
  });
});

/**
 * Functions
 */

module.exports = { io, socketAdapter };
