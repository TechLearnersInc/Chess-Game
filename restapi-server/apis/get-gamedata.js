const restify_err = require('restify-errors');

async function getGamedata(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const status = await redis.expire(data.gamecode, data.expiresIn);
    // 0 => Failed and 1 => Success
    if (status === 0) throw new Error("Gamecode doesn't exist");
    res.send(200);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getGamedata;
