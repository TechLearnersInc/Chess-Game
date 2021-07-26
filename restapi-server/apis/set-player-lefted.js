const restify_err = require('restify-errors');

async function setPlayerLefted(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const field = `${data.player}_joined`;
    const status = 'false';
    await redis.hset(data.gamecode, field, status);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setPlayerLefted;
