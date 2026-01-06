const { getRoleLabel } = require("../enums/Roles");
const { getStateLabel } = require("../enums/States");

class ProfileResponse {
  static fromEntity(user) {
    const data = user.toJSON();

    delete data.password_hash;
    delete data.refresh_token;
    delete data.login_failed;
    delete data.is_locked;

    return {
      ...data,
      role: getRoleLabel(data.role),
      state: getStateLabel(data.state),
    };
  }
}

module.exports = ProfileResponse;
