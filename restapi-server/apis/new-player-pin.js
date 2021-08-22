const restify_err = require('restify-errors');
const { customAlphabet } = require('nanoid');
const alphabet = process.env.NANOID_ALPHABET_PINCODE;
const id_length = Number(process.env.NANOID_PINCODE_LENGTH);
const nanoid = customAlphabet(alphabet, id_length);

async function newPlayerPin(req, res, next) {
  const redis = res.locals.redisClient;
  const data = req.body;

  try {
    const playerPin = nanoid();
    await redis.hset(data.gamecode, `${data.player}_pin`, playerPin);
    res.json({ playerPin });
  } catch (err) {
    console.error(err);
    next(new restify_err.InternalServerError(err.message));
    return;
  }

  next();
}

module.exports = newPlayerPin;
