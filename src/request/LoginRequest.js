const BaseRequest = require("./BaseRequest");

class LoginRequest extends BaseRequest {
  normalize() {
    this.emailId = this._raw.emailId?.trim().toLowerCase();
    this.password = this._raw.password;
  }

  validate() {
    if (!this.emailId) throw new Error("Email ID is required");
    if (!this.password) throw new Error("Password is required");
  }
}

module.exports = LoginRequest;
