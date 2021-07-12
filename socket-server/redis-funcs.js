class RedisFunctions {
  constructor(redis) {
    this.redis = redis;
  }

  async getGameData(gamecode) {
    return this.redis.hgetall(gamecode);
  }
}

module.exports = RedisFunctions;
