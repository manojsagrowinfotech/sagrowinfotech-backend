const { User } = require("../models");

exports.getProfile = async (emailId) => {
  const user = await User.findOne({ where: { email_id: emailId } });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

exports.updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  await user.update({
    full_name: data.name ?? user.full_name,
    mobile_no: data.mobileNo ?? user.mobile_no,
    state: data.state ?? user.state,
  });

  return user;
};
