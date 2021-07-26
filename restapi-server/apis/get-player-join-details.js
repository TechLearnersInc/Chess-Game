const restify_err = require('restify-errors');

async function getPlayerJoinDetails(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const white_joined = await redis.hget(data.gamecode, 'white_joined');
    const black_joined = await redis.hget(data.gamecode, 'black_joined');
    res.json({
      white: white_joined === 'true' ? true : false,
      black: black_joined === 'true' ? true : false,
    });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = getPlayerJoinDetails;
