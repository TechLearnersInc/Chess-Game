const restify_err = require('restify-errors');

async function getGamedata(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const gameData = await redis.hgetall(data.gamecode);
    if (isEmptyObject(gameData)) res.json(gameData);
    else throw new Error("Gamecode doesn't exist or expired");
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 ? true : false;
}

module.exports = getGamedata;
