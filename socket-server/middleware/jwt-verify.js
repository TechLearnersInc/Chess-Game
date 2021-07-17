// Variables
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const jwt_config = require('../config/jwt').config;
const jwt_secret = require('../config/jwt').secret;

// Middleware
module.exports = (client, next) => {
  const headers = client.request.headers;
  const cookies = cookie.parse(headers.cookie);
  const token = cookies.token;

  // Verifying JWT
  jwt.verify(token, jwt_secret, jwt_config, (err, payload) => {
    if (err) {
      const err_message = `${err.name}: ${err.message}`;
      console.log(err_message);
      client.disconnect(true);
      next(new Error(err_message));
    } else {
      client.payload = payload;
      next();
    }
  });

  // // Validity Check
  // try {
  //   // JWT Check
  //   await jwt.verify(token, jwt_secret, jwt_config);
  //   next(); // Valid Client

  //   /*
  //   // Gamecode check
  //   gameData = await redisFuncs.getGameData(gamecode);
  //   if (gameData['gamecode'] === undefined) throw new gamecodeError('Invalid gamecode');
  //   */
  // } catch (err) {
  //   console.log(token);
  //   client.disconnect(true);
  //   // Emit Invalid Reason to Client
  //   if (err instanceof jwt.TokenExpiredError)
  //     client.emit('invalid', 'Session expired, try to re-join.');
  //   /*
  //     else if (err instanceof jwt.JsonWebTokenError)
  //     client.emit('invalid', 'Invalid token, server rejected.');
  //   else if (err instanceof gamecodeError)
  //     client.emit('invalid', `${err.message}, server rejected.`);
  //   else console.error(err);
  //   */
  // }
};
