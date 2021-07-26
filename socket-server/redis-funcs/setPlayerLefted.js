function setPlayerLefted(gamecode, player) {
  const client = this.client;
  const endpoint = this.endpoints.setPlayerLefted;

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

module.exports = setPlayerLefted;
