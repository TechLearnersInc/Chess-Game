const restify = require('restify');
const logger = require('morgan');
const server = restify.createServer();

// Middlewares
server.use(logger('dev'));
server.use(restify.plugins.bodyParser());

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

module.exports = server;
