const restify = require('restify');
const Redis = require('ioredis');
const logger = require('morgan');

const server = restify.createServer();
const redisClient = new Redis(require('./config/redis'));

// Middlewares
server.use(logger('dev'));
server.use(restify.plugins.bodyParser());

// App Global Variables
server.use((req, res, next) => {
  res.locals = {
    redisClient: redisClient,
  };
  next();
});

// API Routes
server.post('/set-expire', require('./apis/set-expire'));
server.post('/create-gamecode', require('./apis/create-gamecode'));
server.post('/get-gamedata', require('./apis/get-gamedata'));
server.post('/set-player-lefted', require('./apis/set-player-lefted'));
server.post('/set-player-joined', require('./apis/set-player-joined'));
server.post('/set-player-turn', require('./apis/set-player-turn'));
server.post('/set-fen', require('./apis/set-fen'));
server.post('/get-player-join-details', require('./apis/get-player-join-details'));
server.post('/get-current-turn', require('./apis/get-current-turn'));
server.post('/check-if-this-player-turn', require('./apis/check-if-this-player-turn'));

module.exports = server;
