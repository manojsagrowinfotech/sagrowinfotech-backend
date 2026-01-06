const DomainError = require("./DomainError");

class UserAlreadyExistsError extends DomainError {
  constructor() {
    super("Email already exists", 409);
  }
}

module.exports = UserAlreadyExistsError;
