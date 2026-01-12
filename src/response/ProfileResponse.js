const { getRoleLabel } = require("../enums/Roles");
const { getStateLabel } = require("../enums/States");

class ProfileResponse {
  static fromEntity(user) {
    const data = user.toJSON();

    return {
      ...data,
      role: getRoleLabel(data.role),
      state: getStateLabel(data.state),
    };
  }
}

module.exports = ProfileResponse;
