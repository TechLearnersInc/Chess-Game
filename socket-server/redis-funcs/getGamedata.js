function getGamedata(gamecode) {
  const client = this.client;
  const endpoint = this.endpoints.getGamedata;

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

module.exports = getGamedata;
