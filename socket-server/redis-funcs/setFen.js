function setFen(gamecode, fen) {
  const client = this.client;
  const endpoint = this.endpoints.setFen;

  const body = {
    gamecode,
    fen,
  };

  return new Promise((resolve, reject) => {
    client.post(endpoint, body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(res.statusCode);
    });
  });
}

module.exports = setFen;
