const restify_err = require('restify-errors');

async function getCurrentTurn(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const turn = await redis.hget(data.gamecode, 'turn');
    res.json({ turn });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getCurrentTurn;
