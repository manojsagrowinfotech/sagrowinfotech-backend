const BaseRequest = require("./BaseRequest");

class LogoutRequest extends BaseRequest {
  normalize() {
    this.emailId = this._raw.emailId?.trim().toLowerCase();
  }

  validate() {
    if (!this.emailId) throw new Error("Email ID is required");
  }
}

module.exports = LogoutRequest;
