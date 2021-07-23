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
  // Gamecode Variables
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

  // Redis Variables
  const redis = req.app.locals.redis;
  const restClient = req.app.locals.restClient;
  const expiresIn = 3600; /* 3600s = 1h */

  // Redis Actions
  try {
    await redis.hmset(gamecode, ...fields); // Creating New gamecode
    await redis.expire(gamecode, expiresIn); // Setting initial expiration
    restClient.get('/expire', (err, req, res, obj) => {
      console.log(obj);
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

module.exports = router;
