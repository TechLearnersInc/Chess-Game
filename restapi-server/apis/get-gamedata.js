const restify_err = require('restify-errors');

async function getGamedata(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const gamedata = await redis.hgetall(data.gamecode);
    res.json(gamedata);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getGamedata;
