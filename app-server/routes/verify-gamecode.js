/* Variables */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: 'strict',
  secure: 'true',
};

/* Verify of Gamecode's validity and send JWT Token */
router.post('/', async (req, res) => {
  // Request variables
  let gamecode = req.body.gamecode; // Gamecode
  let player = req.body.player; // Which player
  let playerPin = req.body.playerPin; // Player's Pincode

  // Response Object
  let responseData = {
    gamecodeValid: true,
    playerPinValid: true,
  }; // Assuming that all are valid

  // Redis Variables
  const redis = req.app.locals.redis;
  const expiresIn = 86400; /* 86400s = 24h */

  // Checking gamecode and pin's validity
  try {
    // Getting data from redis about the Gamecode
    const gameData = await redis.hgetall(gamecode);

    // Checking gamecode's validity
    if (gameData['gamecode'] === undefined) {
      responseData.gamecodeValid = false;
      res.clearCookie('token');
      res.json(responseData);
      return;
    }

    // Checking pincode's validity
    const player_pin = `${player}_pin`;
    if (gameData[player_pin] !== playerPin) {
      responseData.playerPin = false;
      res.clearCookie('token');
      res.json(responseData);
      return;
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }

  // Set gamecode's expiring time to 24 hours
  try {
    await redis.expire(gamecode, expiresIn);
  } catch (err) {
    console.error(err);
    res.clearCookie('token');
    res.sendStatus(500);
    return;
  }

  // JSON Web Token as Cookie
  try {
    const token = getNewToken({ gamecode, player });
    res.cookie('token', token, cookieOptions);
  } catch (err) {
    console.error(err);
    res.clearCookie('token');
    res.sendStatus(500);
    return;
  }

  res.json(responseData);
});

// A new JSON Web Token generting
function getNewToken(
  data,
  secret = process.env.SECRET_TOKEN,
  config = {
    algorithm: 'HS256',
    expiresIn: '24h',
  }
) {
  return jwt.sign(data, secret, config);
}

module.exports = router;
