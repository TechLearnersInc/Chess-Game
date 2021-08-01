class index {
  constructor(config) {
    // Variables
    this.client = config.client;
    this.endpoints = config.endpoints;

    // Methods
    this.setFen = require('./getFen');
    this.getGamedata = require('./getGamedata');
    this.getCurrentTurn = require('./getCurrentTurn');
    this.setPlayerJoined = require('./setPlayerJoined');
    this.setPlayerLefted = require('./setPlayerLefted');
  }
}

module.exports = index;
