const restify = require('restify');
const Redis = require('ioredis');
const logger = require('morgan');

const server = restify.createServer();
const redis = new Redis(require('./config/redis'));

// Middlewares
server.use(logger('dev'));
server.use(restify.plugins.bodyParser());

function respond(req, res, next) {
  console.log(req.get('myMessage'));
  res.send('hello ' + req.params.name);
  next();
}

function respond(req, res, next) {
  res.json({ status: true });
  next();
}

server.get('/expire', respond);

module.exports = server;
