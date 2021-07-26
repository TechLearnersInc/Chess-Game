/* Variables */
const express = require('express');
const router = express.Router();
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 10);

/* Redirection to Home */
router.get('/', (req, res) => {
  res.clearCookie('token');
  res.redirect(302, '/');
});

/* New Gamecode Creation */
router.post('/', async (req, res) => {
  // App local variables
  const restClient = res.app.locals.restClient;
  const restEndpoints = res.app.locals.restClientEndpoints;

  // Variables
  const gamecode = nanoid();
  const fields = [
    ...['gamecode', gamecode],
    ...['white_joined', 'false'],
    ...['black_joined', 'false'],
    ...['white_pin', 'false'],
    ...['black_pin', 'false'],
    ...['fen', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
    ...['turn', 'white'],
  ];

  // Actions
  try {
    // Creating New gamecode
    await newGamecode({
      client: restClient,
      endpoint: restEndpoints.new_gamecode,
      body: { gamecode, fields },
    });

    // Setting initial expiration
    await setGamecodeExpiration({
      client: restClient,
      endpoint: restEndpoints.set_expire,
      body: { gamecode, expiresIn: 3600 /* 3600s = 1h */ },
    });
  } catch (err) {
    console.error(err);
    res.clearCookie('token');
    res.sendStatus(500);
    return;
  }

  // Final Response
  res.json({ gamecode });
});

// Creating New gamecode
function newGamecode(info) {
  return new Promise((resolve, reject) => {
    info.client.post(info.endpoint, info.body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(res.statusCode);
    });
  });
}

// Setting initial expiration
function setGamecodeExpiration(info) {
  return new Promise((resolve, reject) => {
    info.client.post(info.endpoint, info.body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(res.statusCode);
    });
  });
}

module.exports = router;
