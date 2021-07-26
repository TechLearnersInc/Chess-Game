const restify_err = require('restify-errors');

async function setFen(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    redis.hset(data.gamecode, 'fen', data.fen);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setFen;
