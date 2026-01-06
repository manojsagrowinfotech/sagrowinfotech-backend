const BaseRequest = require("./BaseRequest");

class RegisterUserRequest extends BaseRequest {
  normalize() {
    this.emailId = this._raw.emailId?.trim().toLowerCase();
    this.password = this._raw.password;
    this.fullName = this._raw.fullName?.trim();
    this.mobileNo = this._raw.mobileNo?.trim();
    this.role = this._raw.role?.toUpperCase();
    this.state = this._raw.state?.toUpperCase();
  }
}

module.exports = RegisterUserRequest;