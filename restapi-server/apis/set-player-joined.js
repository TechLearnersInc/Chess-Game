const restify_err = require('restify-errors');

async function setPlayerJoined(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const field = `${data.player}_joined`;
    const status = 'true';
    await redis.hset(data.gamecode, field, status);
    res.send(200);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setPlayerJoined;
