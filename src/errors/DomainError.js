class DomainError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "DomainError";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DomainError;
