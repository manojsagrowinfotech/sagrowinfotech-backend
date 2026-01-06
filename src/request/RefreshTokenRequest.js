const BaseRequest = require("./BaseRequest");

class RefreshTokenRequest extends BaseRequest {
  normalize() {
    this.refreshToken = this._raw.refreshToken?.trim();
  }

  validate() {
    if (!this.refreshToken) {
      throw new Error("Refresh token is required");
    }
  }
}

module.exports = RefreshTokenRequest;
