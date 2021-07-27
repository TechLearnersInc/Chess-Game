class index {
  constructor(config) {
    // Variables
    this.client = config.client;
    this.endpoints = config.endpoints;

    // Methods
    this.getGamedata = require('./getGamedata');
    this.setPlayerJoined = require('./setPlayerJoined');
    this.setPlayerLefted = require('./setPlayerLefted');
  }
}

module.exports = index;
