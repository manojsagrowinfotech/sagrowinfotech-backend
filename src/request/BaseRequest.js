class BaseRequest {
  constructor(body = {}) {
    this._raw = Object.freeze({ ...body });
    this._data = {}; // ✅ CREATE DATA CONTAINER

    if (this.normalize) {
      this.normalize();
    }

    Object.freeze(this._data);
    Object.freeze(this);
  }
}

module.exports = BaseRequest;
