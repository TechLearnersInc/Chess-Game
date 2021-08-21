const restify_err = require('restify-errors');

async function setGameover(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const gameover = data.gameover.toString();
    await redis.hset(data.gamecode, 'gameover', gameover);
    res.send(200);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setGameover;
