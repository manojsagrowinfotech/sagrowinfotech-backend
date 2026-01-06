const BaseRequest = require("./BaseRequest");
const AppError = require("../errors/DomainError");

class ListStudentsRequest extends BaseRequest {
  normalize() {
    this.mobileNo = this._raw.mobileNo;
    this.emailId = this._raw.emailId;
    this.fromDate = this._raw.fromDate;
    this.toDate = this._raw.toDate;

    // Pagination
    this.page = parseInt(this._raw.page) || 1;
    this.limit = parseInt(this._raw.limit) || 10;
    this.offset = (this.page - 1) * this.limit;

    // Sorting
    this.sortBy = this._raw.sortBy || "createdTime";
    this.order = (this._raw.order || "DESC").toUpperCase();
  }

  validate() {
    const allowedSortFields = [
      "createdTime",
      "emailId",
      "mobileNo",
      "state",
    ];

    if (!allowedSortFields.includes(this.sortBy)) {
      throw new AppError("Invalid sortBy field");
    }

    if (!["ASC", "DESC"].includes(this.order)) {
      throw new AppError("Invalid order value");
    }
  }
}

module.exports = ListStudentsRequest;
