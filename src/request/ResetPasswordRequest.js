const BaseRequest = require("./BaseRequest");

class ResetPasswordRequest extends BaseRequest {
  normalize() {
    this.resetToken = this._raw.resetToken?.trim();
    this.newPassword = this._raw.newPassword;
  }

  validate() {
    if (!this.resetToken) {
      throw new Error("Reset token is required");
    }

    if (!this.newPassword) {
      throw new Error("New password is required");
    }

    if (this.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        this.newPassword
      )
    ) {
      throw new Error(
        "Password must contain uppercase, lowercase, number, and special character"
      );
    }
  }
}

module.exports = ResetPasswordRequest;
