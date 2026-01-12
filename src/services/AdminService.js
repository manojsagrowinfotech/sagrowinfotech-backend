const { User } = require("../models");

exports.getLockedAccounts = async () => {
  return await User.findAll({
    where: { isLocked: true },
    attributes: {
      exclude: ["passwordHash", "refreshToken"],
    },
  });
};

exports.unlockUserAccount = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (!user.isLocked) {
    const err = new Error("User is not locked");
    err.statusCode = 400;
    throw err;
  }

  await user.update({
    isLocked: false,
    failedLoginAttempts: 0,
    lockedAt: null,
  });

  return user;
};
