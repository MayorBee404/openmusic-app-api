const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
