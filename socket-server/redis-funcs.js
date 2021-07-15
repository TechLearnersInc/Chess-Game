class RedisFunctions {
  constructor(redis) {
    this.redis = redis;
  }

  async getGameData(gamecode) {
    const redis = this.redis;
    return redis.hgetall(gamecode);
  }

  async setPlayerLefted(gamecode, player) {
    const redis = this.redis;
    const field = `${player}_joined`;
    const status = 'false';
    await redis.hset(gamecode, field, status);
  }

  async setPlayerJoined(gamecode, player) {
    const redis = this.redis;
    const field = `${player}_joined`;
    const status = 'true';
    await redis.hset(gamecode, field, status);
  }

  async setPlayerTurn(gamecode, player) {
    const redis = this.redis;
    await redis.hset(gamecode, 'turn', player);
  }

  async setFen(gamecode, fen) {
    const redis = this.redis;
    await redis.hset(gamecode, 'fen', fen);
  }

  async getPlayerJoinDetails(gamecode) {
    const gamedata = await this.getGameData(gamecode);
    let data = { white: false, black: false };
    if (gamedata.white_joined === 'true') data.white = true;
    if (gamedata.black_joined === 'true') data.black = true;
    return data;
  }

  async getCurrentTurn(gamecode) {
    const gamedata = await this.getGameData(gamecode);
    return gamedata.turn;
  }

  async checkIfThisPlayerTurn(gamecode, player) {
    const turn = await this.getCurrentTurn(gamecode);
    if (turn === player) return true;
    else return false;
  }
}

module.exports = RedisFunctions;
