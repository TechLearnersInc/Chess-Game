function setPlayerTurn(gamecode, player) {
  const client = this.client;
  const endpoint = this.endpoints.setPlayerTurn;

  const body = {
    gamecode,
    player,
  };

  return new Promise((resolve, reject) => {
    client.post(endpoint, body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(res.statusCode);
    });
  });
}

module.exports = setPlayerTurn;
