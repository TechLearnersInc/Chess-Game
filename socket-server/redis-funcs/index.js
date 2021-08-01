class index {
  constructor(config) {
    // Variables
    this.client = config.client;
    this.endpoints = config.endpoints;

    // Methods
    this.getFen = require('./getFen');
    this.setFen = require('./setFen');
    this.getGamedata = require('./getGamedata');
    this.setPlayerTurn = require('./setPlayerTurn');
    this.getCurrentTurn = require('./getCurrentTurn');
    this.setPlayerJoined = require('./setPlayerJoined');
    this.setPlayerLefted = require('./setPlayerLefted');
  }
}

module.exports = index;
