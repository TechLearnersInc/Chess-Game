const restify_err = require('restify-errors');

async function setPlayerTurn(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    await redis.hset(data.gamecode, 'turn', data.player);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setPlayerTurn;
