const BaseRequest = require("./BaseRequest");
const { getStateCode } = require("../enums/States");

class UpdateProfileRequest extends BaseRequest {
  normalize() {
    this.name = this._raw.name?.trim();
    this.mobileNo = this._raw.mobileNo;
    this.state = this._raw.state ? getStateCode(this._raw.state) : undefined;
  }

  validate() {
    if (this.mobileNo && !/^\d{10}$/.test(this.mobileNo)) {
      throw new Error("Invalid mobile number");
    }
  }
}

module.exports = UpdateProfileRequest;
