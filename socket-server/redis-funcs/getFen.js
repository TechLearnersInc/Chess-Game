function getFen(gamecode) {
  const client = this.client;
  const endpoint = this.endpoints.getFen;

  const body = {
    gamecode,
  };

  return new Promise((resolve, reject) => {
    client.post(endpoint, body, (err, req, res, obj) => {
      if (err) reject(err);
      else resolve(obj);
    });
  });
}

module.exports = getFen;
