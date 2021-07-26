const restify_err = require('restify-errors');

async function setFen(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    await redis.hset(data.gamecode, 'fen', data.fen);
    res.send(200);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setFen;
