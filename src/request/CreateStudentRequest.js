const BaseRequest = require("./BaseRequest");

class CreateStudentRequest extends BaseRequest {
  normalize() {
    this._data.name = this._raw.name?.trim();
    this._data.mobileNo = this._raw.mobileNo?.trim();
    this._data.emailId = this._raw.emailId?.trim().toLowerCase();
    this._data.experienceLevel = this._raw.experienceLevel;
    this._data.yearsOfExperience = this._raw.yearsOfExperience;
    this._data.state = this._raw.state;
    this._data.preferredTechnicalDomain =
      this._raw.preferredTechnicalDomain?.trim();
    this._data.createdBy = "SYSTEM";
  }
  get name() {
    return this._data.name;
  }

  get mobileNo() {
    return this._data.mobileNo;
  }

  get emailId() {
    return this._data.emailId;
  }

  get experienceLevel() {
    return this._data.experienceLevel;
  }

  get yearsOfExperience() {
    return this._data.yearsOfExperience;
  }

  get state() {
    return this._data.state;
  }

  get preferredTechnicalDomain() {
    return this._data.preferredTechnicalDomain;
  }

  get createdBy() {
    return this._data.createdBy;
  }

  toPayload() {
    return {
      name: this.name,
      mobileNo: this.mobileNo,
      emailId: this.emailId,
      experienceLevel: this.experienceLevel,
      yearsOfExperience: this.yearsOfExperience,
      state: this.state,
      createdBy: this.createdBy,
      preferredTechnicalDomain: this.preferredTechnicalDomain,
    };
  }
}

module.exports = CreateStudentRequest;
