const restify_err = require('restify-errors');

async function getGamedata(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    res.json(await redis.hgetall(data.gamecode));
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getGamedata;
