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
server.post('/set-expire', require('./apis/setExpire'));
server.post('/create-gamecode', require('./apis/create-gamecode'));
server.post('/get-gamedata', require('./apis/get-gamedata'));

module.exports = server;
