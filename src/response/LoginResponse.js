class LoginResponse {
  constructor({ accessToken, refreshToken, expiresIn, refreshExpiresIn }) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
    this.refreshExpiresIn = refreshExpiresIn;
  }
}

module.exports = LoginResponse;
