const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
