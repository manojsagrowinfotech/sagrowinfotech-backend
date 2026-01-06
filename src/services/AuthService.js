const { User, Login, Logout } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { getRoleCode } = require("../enums/Roles");
const { getStateCode } = require("../enums/States");
const crypto = require("crypto");
const { hashToken } = require("../utils/token");

exports.registerUser = async (request) => {
  const existing = await User.findOne({
    where: {
      [Op.or]: [{ email_id: request.emailId }, { mobile_no: request.mobileNo }],
    },
  });

  if (existing) {
    if (existing.email_id === request.emailId) {
      throw new Error("Email ID already exists");
    }
    if (existing.mobile_no === request.mobileNo) {
      throw new Error("Mobile number already exists");
    }
    throw new Error("Email or mobile already exists");
  }
  const passwordHash = await bcrypt.hash(request.password, 10);

  const user = await User.create({
    emailId: request.emailId,
    passwordHash: passwordHash,
    fullName: request.fullName,
    mobileNo: request.mobileNo,
    role: getRoleCode(request.role),
    state: getStateCode(request.state),
    createdBy: request.emailId,
  });

  return user;
};

exports.loginUser = async (request, meta) => {
  const { ipAddress, userAgent } = meta;

  const user = await User.findOne({
    where: { email_id: request.emailId },
  });

  if (!user) throw new Error("Invalid credentials");
  if (user.isLocked) throw new Error("Account locked");

  // 🔹 Logout all active sessions (if any)
  await Login.update(
    {
      is_active: false,
      logged_out_at: new Date(),
    },
    {
      where: {
        user_id: user.id,
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
      },
    }
  );

  const isMatch = await bcrypt.compare(request.password, user.passwordHash);

  if (!isMatch) {
    user.loginFailed += 1;
    if (user.loginFailed >= 8) user.isLocked = true;
    await user.save();
    throw new Error("Invalid credentials");
  }

  // Reset failed count
  user.loginFailed = 0;
  await user.save();

  const ACCESS_TOKEN_TTL = 30 * 60; // 30 mins
  const REFRESH_TOKEN_TTL = 3 * 60 * 60; // 3 hrs

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );

  await Login.create({
    user_id: user.id,
    email_id: user.emailId,
    access_token_hash: hashToken(accessToken),
    refresh_token_hash: hashToken(refreshToken),
    ip_address: ipAddress,
    user_agent: userAgent,
    is_active: true,
    expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
    created_by: user.emailId,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL,
    refreshExpiresIn: REFRESH_TOKEN_TTL,
  };
};

exports.refreshToken = async (request, meta) => {
  const { ipAddress } = meta;

  const ACCESS_TOKEN_TTL = 30 * 60;
  const REFRESH_TOKEN_TTL = 3 * 60 * 60;

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(request.refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Refresh token expired");
    }
    throw new Error("Invalid refresh token");
  }

  const login = await Login.findOne({
    where: {
      user_id: decoded.userId,
      is_active: true,
    },
  });

  if (!login) {
    throw new Error("Invalid refresh token");
  }

  if (login.ip_address !== ipAddress) {
    throw new Error("IP changed. Please login again.");
  }

  if (login.refresh_token_hash !== hashToken(request.refreshToken)) {
    throw new Error("Invalid refresh token");
  }
  // Generate new tokens
  const newAccessToken = jwt.sign(
    { userId: decoded.userId, role: decoded.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

  const newRefreshToken = jwt.sign(
    { userId: decoded.userId, role: decoded.role },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );

  // Rotate tokens
  login.access_token_hash = hashToken(newAccessToken);
  login.refresh_token_hash = hashToken(newRefreshToken);
  login.expires_at = new Date(Date.now() + REFRESH_TOKEN_TTL * 1000);

  await login.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: ACCESS_TOKEN_TTL,
    refreshExpiresIn: REFRESH_TOKEN_TTL,
  };
};

exports.logoutUser = async (request, meta) => {
  const { ipAddress } = meta;

  const logins = await Login.findAll({
    where: {
      email_id: { [Op.iLike]: request.emailId },
      is_active: true,
    },
  });

  if (!logins || logins.length === 0) {
    throw new Error("No active session found");
  }

  for (const login of logins) {
    login.is_active = false;
    await login.save();

    await Logout.create({
      user_login_id: login.id,
      ip_address: ipAddress,
    });
  }

  return { sessionsLoggedOut: logins.length };
};

exports.forgotPassword = async (emailId) => {
  const user = await User.findOne({ where: { email_id: emailId } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();
  return hashedToken;
};

exports.resetPassword = async (resetToken, newPassword) => {
  const user = await User.findOne({
    where: {
      reset_password_token: resetToken,
    },
  });
  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await Login.update({ is_active: false }, { where: { user_id: user.id } });
  await user.save();
};
