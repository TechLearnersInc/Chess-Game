const restify_err = require('restify-errors');

async function getFen(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const fen = await redis.hget(data.gamecode, 'fen');
    res.json({ fen });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getFen;
