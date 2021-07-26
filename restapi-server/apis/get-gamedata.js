const restify_err = require('restify-errors');

async function getGamedata(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const gameData = await redis.hgetall(data.gamecode);
    if (Object.keys(gameData).length !== 0) res.json(gameData);
    else throw new Error("Gamecode doesn't exist or expired");
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getGamedata;
