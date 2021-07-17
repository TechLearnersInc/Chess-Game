module.exports = {
  cachedb: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWD,
  },
  msg_broker: {
    host: process.env.REDIS_MSG_BROKER_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWD,
  },
};
