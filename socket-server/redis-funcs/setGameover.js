function setGameover(gamecode, gameover) {
  const client = this.client;
  const endpoint = this.endpoints.setGameover;

  const body = {
    gamecode,
    gameover,
  };

  return new Promise((resolve, reject) => {
    client.post(endpoint, body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(res.statusCode);
    });
  });
}

module.exports = setFen;
