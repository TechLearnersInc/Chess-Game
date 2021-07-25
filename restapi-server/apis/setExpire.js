const restify_err = require('restify-errors');

async function setExpire(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    await redis.expire(data.gamecode, data.expiresIn);
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = setExpire;
