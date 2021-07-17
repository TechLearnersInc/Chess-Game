// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./config/socketio'));
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

// Custom Errors
const { gamecodeError } = require('./custom-errors');

/**
 * Middlewares
 */

// Local Variable
io.use((socket, next) => {
  socket.data = {
    redis,
    redisFuncs,
  };
  next();
});

// JWT Verification
io.use(require('./middleware/jwt-verify'));

// Gamecode Verification
io.use(require('./middleware/gamecode-verify'));

io.on('connection', async client => {
  const gamecode = client.data.gamecode;
  const player = client.data.player;
  // console.log(client.data);
  // console.log(client.request);
  // Joining Game Room
  // client.join(gamecode);
  // console.log('Hello World');
  // console.log(client.handshake.query);
  // console.log(io.sockets.adapter.rooms.get(gamecode));
  /*
  // Saved Board State
  const boardState = {
    fen: gameData.fen,
    player: player,
    freeze: gameData.turn === player ? false : true,
  };

  // Send board to server
  // io.to(gamecode).emit('move', boardState);
  client.emit('initialize-board', boardState);

  // Player Active
  await redisFuncs.setPlayerJoined(gamecode, player);

  // Getting White/Black Turned Fen
  client.on('send-move', async message => {
    console.log(message);
  });
  */
  // Remove disconnected users
  client.on('disconnect', async () => {
    await redisFuncs.setPlayerLefted(gamecode, player);
  });
});

/**
 * Functions
 */

module.exports = { io, socketAdapter };
