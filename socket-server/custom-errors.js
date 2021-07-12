// Custom errors

class gamecodeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'gamecodeError';
  }
}

module.exports = { gamecodeError };
