const { User, Login, Logout } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { getRoleCode } = require("../enums/Roles");
const { getStateCode } = require("../enums/States");
const { hashToken } = require("../utils/token");
const {
  generateOTP,
  hashOTP,
  generateResetToken,
} = require("../utils/otpUtil");
const { sendEmail } = require("../utils/sendEmail");
const DomainError = require("../errors/DomainError");

// Configuration
const OTP_EXPIRY_MIN = 5;
const MAX_RESENDS = 3;
const RESEND_COOLDOWN_SEC = 60;

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

  const ACCESS_TOKEN_TTL = 5 * 60; // 30 mins
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

  const ACCESS_TOKEN_TTL = 5 * 60;
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

exports.sendOTP = async (emailId) => {
  const user = await User.findOne({ where: { emailId } });
  if (!user) throw new DomainError("User not found", 404);
  if (user.isLocked) throw new DomainError("Account locked", 423);

  const otp = generateOTP();
  user.otp = hashOTP(otp);
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);
  user.otpResendCount = 1;
  user.otpLastSentAt = new Date();
  user.loginFailed = 0;
  await user.save();

  await sendEmail({
    to: emailId,
    subject: "Password Reset OTP",
    html: forgotPasswordTemplate(user.fullName, otp),
  });

  return { message: "OTP sent successfully" };
};

exports.resendOTP = async (emailId) => {
  const user = await User.findOne({ where: { emailId } });
  if (!user) throw new DomainError("User not found", 404);
  if (user.isLocked) throw new DomainError("Account locked", 423);

  // 1️⃣ Cooldown check
  if (user.otpLastSentAt) {
    const elapsed = Date.now() - user.otpLastSentAt.getTime();
    const waitTime = RESEND_COOLDOWN_SEC * 1000 - elapsed;

    if (waitTime > 0) {
      throw new DomainError(
        `Please wait ${Math.ceil(waitTime / 1000)} seconds before resending OTP`,
        429
      );
    }
  }

  // 2️⃣ Resend limit check (DO NOT LOCK ACCOUNT)
  if (user.otpResendCount >= MAX_RESENDS) {
    throw new DomainError("OTP resend limit exceeded. Try again later.", 429);
  }

  // 3️⃣ Generate new OTP
  const otp = generateOTP();
  user.otp = hashOTP(otp);
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);
  user.otpResendCount += 1;
  user.otpLastSentAt = new Date();
  user.loginFailed = 0;

  await user.save();

  // 4️⃣ Send OTP email
  await sendEmail({
    to: emailId,
    subject: "OTP for Password Reset",
    html: forgotPasswordTemplate(user.fullName, otp),
  });

  return { message: "OTP resent successfully" };
};


exports.verifyOTP = async (emailId, otp) => {
  if (!/^\d{6}$/.test(otp)) {
    throw new DomainError("Invalid OTP format", 400);
  }

  const user = await User.findOne({ where: { emailId } });
  if (!user || !user.otp) {
    throw new DomainError("OTP invalid or expired", 400);
  }

  if (user.isLocked) {
    throw new DomainError("Account locked", 423);
  }

  // ✅ CORRECT TIME COMPARISON
  if (Date.now() > user.otpExpires.getTime()) {
    await clearOTP(user);
    throw new DomainError("OTP expired", 410);
  }

  if (hashOTP(otp) !== user.otp) {
    user.loginFailed += 1;
    if (user.loginFailed >= 3) {
      user.isLocked = true;
    }
    await user.save();
    throw new DomainError("Incorrect OTP", 401);
  }

  // OTP SUCCESS
  await clearOTP(user);

  const resetToken = generateResetToken();
  user.resetPasswordToken = hashOTP(resetToken);
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  return { resetToken };
};

exports.resetPassword = async (resetToken, newPassword) => {
  const user = await User.findOne({
    where: { resetPasswordToken: hashToken(resetToken) },
  });
  if (!user || !user.resetPasswordToken)
    throw new DomainError("Invalid or expired reset token", 400);
  if (user.resetPasswordExpires < new Date())
    throw new DomainError("Reset token expired", 410);

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await Login.update({ is_active: false }, { where: { user_id: user.id } });
  await user.save();

  return { message: "Password reset successfully" };
};

const clearOTP = async (user) => {
  user.otp = null;
  user.otpExpires = null;
  user.otpResendCount = 0;
  user.otpLastSentAt = null;
  user.loginFailed = 0;
  await user.save();
};

const forgotPasswordTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .wrapper {
        width: 100%;
        padding: 30px 0;
      }
      .container {
        max-width: 520px;
        margin: auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .content {
        color: #374151;
        font-size: 14px;
        line-height: 1.6;
      }
      .otp-box {
        margin: 25px 0;
        text-align: center;
      }
      .otp {
        display: inline-block;
        padding: 14px 26px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        background: #f0f7ff;
        color: #1d4ed8;
        border-radius: 8px;
        border: 1px dashed #93c5fd;
      }
      .note {
        background: #f9fafb;
        border-left: 4px solid #2563eb;
        padding: 12px;
        margin-top: 20px;
        font-size: 13px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">

        <div class="content">
          <p>Hello <strong>${name || "User"}</strong>,</p>

          <p>
            We received a request to reset your account password.
            Please use the One-Time Password (OTP) below to continue.
          </p>

          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>

          <p>
            This OTP is valid for <strong>5 minutes</strong>.
            Do not share this code with anyone.
          </p>

          <div class="note">
            If you did not request this, you can safely ignore this email.
            Your account remains secure.
          </div>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Sagrow Infotech. All rights reserved.
        </div>

      </div>
    </div>
  </body>
  </html>
  `;
};
