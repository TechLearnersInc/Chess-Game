// Middleware
async function middleware(client, next) {
  const payload = client.data.payload;
  const gamecode = payload.gamecode;
  const player = payload.player;
  const redisFuncs = client.data.redisFuncs;
  let gamedata;

  // Getting gamadata
  try {
    gamedata = await redisFuncs.getGameData(gamecode);
  } catch (err) {
    console.err(err);
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
  } else await redisFuncs.setPlayerJoined(gamecode, player);

  // Verified
  next();
}

module.exports = middleware;
