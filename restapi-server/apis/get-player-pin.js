const restify_err = require('restify-errors');

async function getPlayerPin(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const playerPin = await redis.hget(data.gamecode, `${data.player}_pin`);
    res.json({ playerPin });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getPlayerPin;
