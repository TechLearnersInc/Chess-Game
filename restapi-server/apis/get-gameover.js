const restify_err = require('restify-errors');

async function getGameover(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const gameover = await redis.hget(data.gamecode, 'gameover');
    res.json({ gameover });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getGameover;
