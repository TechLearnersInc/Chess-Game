class index {
  constructor(config) {
    // Variables
    this.client = config.client;
    this.endpoints = config.endpoints;

    // Methods
    this.setPlayerLefted = require('./setPlayerLefted');
  }
}

module.exports = index;
