// Module dependencies.
const socketio = require('socket.io');
const io = socketio(undefined, require('./config/socketio'));

const restify = require('restify-clients');
const restifyClient = restify.createJsonClient(process.env.REST_API_SERVER);
const restifyEndpoints = require('./config/rest-client-endpoints');

// Redis Functions REST API
const redisFuncClass = require('./redis-funcs/index');
const redisFuncs = new redisFuncClass({
  client: restifyClient,
  endpoints: restifyEndpoints,
});

// Socketio Redis Adapter
const Redis = require('ioredis');
const pubClient = new Redis(require('./config/redis'));
const subClient = pubClient.duplicate();
const { createAdapter } = require('@socket.io/redis-adapter');
const socketAdapter = createAdapter(pubClient, subClient);

/**
 * Middlewares
 */

// Local Variable
io.use((socket, next) => {
  socket.locals = {
    redisFuncs,
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

  // Joining
  socket.join(gamecode);

  // Initialize
  socket.emit('initialize_board', {
    gamecode,
    player,
  });

  io.in(gamecode).emit('move', {
    gamecode,
    player,
    fen: (await redisFuncs.getFen(gamecode)).fen,
    turn: (await redisFuncs.getCurrentTurn(gamecode)).turn,
  });

  socket.on('move', async (player, fen) => {
    let current_turn;
    let next_turn;

    try {
      current_turn = (await redisFuncs.getCurrentTurn(gamecode)).turn;
      if (current_turn !== player) return;
      else next_turn = current_turn === 'white' ? 'black' : 'white';
    } catch (err) {
      console.error(err);
      throw err;
    }

    try {
      await redisFuncs.setFen(gamecode, fen);
      await redisFuncs.setPlayerTurn(gamecode, next_turn);
    } catch (err) {
      console.error(err);
      throw err;
    }

    try {
      io.in(gamecode).emit('move', {
        gamecode,
        player,
        fen: (await redisFuncs.getFen(gamecode)).fen,
        turn: (await redisFuncs.getCurrentTurn(gamecode)).turn,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  // Gameover
  socket.on('gameover', async () => {
    try {
      await redisFuncs.setGameover(gamecode, true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  // Remove disconnected users
  socket.on('disconnect', async () => {
    try {
      if (payload) redisFuncs.setPlayerLefted(gamecode, player);
    } catch (err) {
      console.error(err);
    }
  });
});

/**
 * Functions
 */

module.exports = { io, socketAdapter };
