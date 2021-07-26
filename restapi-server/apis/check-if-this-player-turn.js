const restify_err = require('restify-errors');

async function checkIfThisPlayerTurn(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const turn = await redis.hget(data.gamecode, 'turn');
    const player = data.player;
    res.json({
      turn: turn === player ? true : false,
    });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = checkIfThisPlayerTurn;
