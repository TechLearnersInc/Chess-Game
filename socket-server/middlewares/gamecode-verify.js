// Middleware
async function middleware(socket, next) {
  const payload = socket.locals.payload;
  const gamecode = payload.gamecode;
  const player = payload.player;
  const redisFuncs = socket.locals.redisFuncs;
  let gamedata;

  // Getting gamedata
  try {
    gamedata = await redisFuncs.getGamedata(gamecode);
  } catch (err) {
    console.error(err);
    next(new Error('Internal Server Error'));
    return;
  }

  // Verifying the gamecode
  if (gamedata.gamecode === undefined) {
    next(new Error('Invalid gamecode'));
    return;
  }

  // Verifying already joined or not
  if (gamedata[`${player}_joined`] === 'true') {
    next(new Error('Already joined in one device'));
    return;
  } else {
    try {
      await redisFuncs.setPlayerJoined(gamecode, player);
    } catch (err) {
      console.error(err);
      next(new Error('Internal Server Error'));
      return;
    }
  }

  // Verifying gameover or not
  if (gamedata.gameover === 'true') {
    next(new Error('Games is already over'));
    return;
  }

  // Verified
  next();
}

module.exports = middleware;
